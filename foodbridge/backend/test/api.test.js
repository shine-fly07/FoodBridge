import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";

describe("FoodBridge Hardened API Test Suite", () => {
  let donorToken = "";
  let volunteerToken = "";
  let ngoToken = "";
  let testListingId = null;

  before(async () => {
    // Authenticate demo roles to obtain JWT tokens
    const donorRes = await request(app)
      .post("/api/users/login")
      .send({ demoRole: "donor" });
    assert.equal(donorRes.status, 200, "Donor demo login failed");
    donorToken = donorRes.body.token;

    const volunteerRes = await request(app)
      .post("/api/users/login")
      .send({ demoRole: "volunteer" });
    assert.equal(volunteerRes.status, 200, "Volunteer demo login failed");
    volunteerToken = volunteerRes.body.token;

    const ngoRes = await request(app)
      .post("/api/users/login")
      .send({ demoRole: "ngo" });
    assert.equal(ngoRes.status, 200, "NGO demo login failed");
    ngoToken = ngoRes.body.token;
  });

  test("1. System Health Check: GET /api/health", async () => {
    const res = await request(app).get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.status, "healthy");
    assert.ok(res.body.timestamp);
  });

  test("2. User Signup & Duplicate Email Guard: POST /api/users/signup", async () => {
    const testEmail = `newuser_${Date.now()}@foodbridge.org`;

    // Successful registration
    const signupRes = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Test Partner Chef",
        email: testEmail,
        password: "securePassword123",
        role: "donor",
        org: "City Bakery",
      });
    assert.equal(signupRes.status, 201);
    assert.ok(signupRes.body.token, "Expected token in signup response");
    assert.equal(signupRes.body.user.email, testEmail);
    assert.equal(signupRes.body.user.password_hash, undefined, "password_hash must never leak");

    // Duplicate email returns 409
    const dupRes = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Duplicate User",
        email: testEmail,
        password: "securePassword123",
        role: "donor",
      });
    assert.equal(dupRes.status, 409);
    assert.equal(dupRes.body.error.code, "EMAIL_EXISTS");
  });

  test("3. User Login & Password Verification: POST /api/users/login", async () => {
    // Valid login
    const validLogin = await request(app)
      .post("/api/users/login")
      .send({
        email: "donor@foodbridge.org",
        password: "password123",
      });
    assert.equal(validLogin.status, 200);
    assert.ok(validLogin.body.token);
    assert.equal(validLogin.body.user.role, "donor");

    // Invalid password returns 401
    const invalidLogin = await request(app)
      .post("/api/users/login")
      .send({
        email: "donor@foodbridge.org",
        password: "wrongPassword!",
      });
    assert.equal(invalidLogin.status, 401);
    assert.equal(invalidLogin.body.error.code, "INVALID_CREDENTIALS");
  });

  test("4. Auth Guard & Role Verification: GET /api/users/me & Safe Partners", async () => {
    // Without token returns 401
    const noToken = await request(app).get("/api/users/me");
    assert.equal(noToken.status, 401);
    assert.equal(noToken.body.error.code, "UNAUTHENTICATED");

    // With valid token returns profile
    const withToken = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${donorToken}`);
    assert.equal(withToken.status, 200);
    assert.equal(withToken.body.user.role, "donor");

    // Safe partners endpoint returns public info only (no emails or passwords)
    const partners = await request(app).get("/api/users/partners");
    assert.equal(partners.status, 200);
    assert.ok(Array.isArray(partners.body.data));
    if (partners.body.data.length > 0) {
      assert.equal(partners.body.data[0].email, undefined);
      assert.equal(partners.body.data[0].password_hash, undefined);
    }
  });

  test("5. Role Enforcement: Volunteers cannot create listings", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${volunteerToken}`)
      .send({
        title: "Unauthorized Food Listing",
        meals: 20,
        pickupAddress: "Main Gate",
        expiresInMinutes: 60,
      });
    assert.equal(res.status, 403);
    assert.equal(res.body.error.code, "UNAUTHORIZED");
  });

  test("6. Listing Creation & Owner Cancellation", async () => {
    // Donor creates listing
    const createRes = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${donorToken}`)
      .send({
        title: "30 Servings Fresh Salad & Bread",
        meals: 30,
        pickupAddress: "Dining Hall B Loading Bay",
        notes: "Kept chilled, ready now.",
        expiresInMinutes: 120,
      });
    assert.equal(createRes.status, 201);
    const listing = createRes.body;
    assert.equal(listing.status, "available");
    assert.equal(listing.meals, 30);

    // Volunteers cannot claim an order until an NGO accepts it.
    const earlyClaim = await request(app)
      .post(`/api/listings/${listing.id}/claim`)
      .set("Authorization", `Bearer ${volunteerToken}`);
    assert.equal(earlyClaim.status, 409);
    assert.equal(earlyClaim.body.error.code, "NOT_ACCEPTED");

    // Volunteer tries to cancel -> 403
    const badCancel = await request(app)
      .post(`/api/listings/${listing.id}/cancel`)
      .set("Authorization", `Bearer ${volunteerToken}`);
    assert.equal(badCancel.status, 403);

    // Donor cancels own listing -> 200
    const cancelRes = await request(app)
      .post(`/api/listings/${listing.id}/cancel`)
      .set("Authorization", `Bearer ${donorToken}`);
    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.status, "cancelled");
  });

  test("7. NGO Acceptance & Concurrency Guard: one NGO reservation and one courier claim", async () => {
    // Step 1: Donor creates a fresh listing for acceptance and race test
    const createRes = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${donorToken}`)
      .send({
        title: "Hot Soup & Rice for 45 people",
        meals: 45,
        pickupAddress: "Campus Center East",
        expiresInMinutes: 90,
      });
    assert.equal(createRes.status, 201);
    testListingId = createRes.body.id;

    // Step 2: An NGO accepts it and supplies the delivery destination.
    const acceptRes = await request(app)
      .post(`/api/listings/${testListingId}/accept`)
      .set("Authorization", `Bearer ${ngoToken}`)
      .send({ dropoffAddress: "Hope Shelter, 10 Main Street" });
    assert.equal(acceptRes.status, 200);
    assert.equal(acceptRes.body.status, "accepted");
    assert.equal(acceptRes.body.dropoffAddress, "Hope Shelter, 10 Main Street");

    // A different NGO cannot reserve an already accepted listing.
    const secondNgoRes = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Second Shelter",
        email: `second-ngo_${Date.now()}@foodbridge.org`,
        password: "securePassword123",
        role: "ngo",
        org: "Second Shelter",
      });
    assert.equal(secondNgoRes.status, 201);
    const duplicateAccept = await request(app)
      .post(`/api/listings/${testListingId}/accept`)
      .set("Authorization", `Bearer ${secondNgoRes.body.token}`)
      .send({ dropoffAddress: "Another Shelter, 5 Side Road" });
    assert.equal(duplicateAccept.status, 409);

    // Step 3: Fire 10 concurrent claim requests simultaneously
    const claimPromises = Array.from({ length: 10 }, () =>
      request(app)
        .post(`/api/listings/${testListingId}/claim`)
        .set("Authorization", `Bearer ${volunteerToken}`)
    );

    const responses = await Promise.all(claimPromises);

    // Step 3: Verify atomic locking guarantees exactly 1 winner (200) and 9 conflicts (409)
    const successCount = responses.filter((r) => r.status === 200).length;
    const conflictCount = responses.filter((r) => r.status === 409).length;

    assert.equal(successCount, 1, `Expected exactly 1 claim success, got ${successCount}`);
    assert.equal(conflictCount, 9, `Expected exactly 9 claim conflicts (409), got ${conflictCount}`);
  });

  test("8. Full Food Rescue Pipeline: NGO confirms volunteer-reported delivery", async () => {
    // Current status is 'claimed' from the race test winner
    // Delivery cannot be confirmed before collection.
    const earlyDeliver = await request(app)
      .post(`/api/listings/${testListingId}/deliver`)
      .set("Authorization", `Bearer ${volunteerToken}`);
    assert.equal(earlyDeliver.status, 409);

    const earlyReceiptConfirmation = await request(app)
      .post(`/api/listings/${testListingId}/confirm-delivery`)
      .set("Authorization", `Bearer ${ngoToken}`);
    assert.equal(earlyReceiptConfirmation.status, 409);

    // Volunteer collects food
    const collectRes = await request(app)
      .post(`/api/listings/${testListingId}/collect`)
      .set("Authorization", `Bearer ${volunteerToken}`);
    assert.equal(collectRes.status, 200);
    assert.equal(collectRes.body.status, "collected");

    // Assigned volunteer reports the drop-off; delivery is not complete until NGO confirmation.
    const deliverRes = await request(app)
      .post(`/api/listings/${testListingId}/deliver`)
      .set("Authorization", `Bearer ${volunteerToken}`);
    assert.equal(deliverRes.status, 200);
    assert.equal(deliverRes.body.status, "delivered");
    assert.equal(deliverRes.body.dropoffAddress, "Hope Shelter, 10 Main Street");
    assert.ok(deliverRes.body.deliveredAt);

    const secondNgoRes = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Second Shelter",
        email: `receipt-ngo_${Date.now()}@foodbridge.org`,
        password: "securePassword123",
        role: "ngo",
        org: "Second Shelter",
      });
    assert.equal(secondNgoRes.status, 201);
    const wrongNgoConfirmation = await request(app)
      .post(`/api/listings/${testListingId}/confirm-delivery`)
      .set("Authorization", `Bearer ${secondNgoRes.body.token}`);
    assert.equal(wrongNgoConfirmation.status, 403);

    const confirmRes = await request(app)
      .post(`/api/listings/${testListingId}/confirm-delivery`)
      .set("Authorization", `Bearer ${ngoToken}`);
    assert.equal(confirmRes.status, 200);
    assert.equal(confirmRes.body.status, "distributed");
    assert.ok(confirmRes.body.deliveredAt);
    assert.ok(confirmRes.body.distributedAt);
  });

  test("9. Impact Metrics & Canonical Formula Verification", async () => {
    const summary = await request(app).get("/api/impact/summary");
    assert.equal(summary.status, 200);
    assert.ok(typeof summary.body.mealsDiverted === "number");
    assert.ok(typeof summary.body.wasteKg === "number");
    assert.ok(typeof summary.body.co2eKg === "number");

    // Environmental math verification (0.4 kg/meal and 2.5 kg CO2e/kg waste)
    const expectedWaste = Math.round(summary.body.mealsDiverted * 0.4 * 10) / 10;
    const expectedCo2e = Math.round(expectedWaste * 2.5 * 10) / 10;
    assert.equal(summary.body.wasteKg, expectedWaste);
    assert.equal(summary.body.co2eKg, expectedCo2e);
  });

  test("10. Community Physical Audit: Bulk Sync & Duplicate Handling", async () => {
    const sampleRows = [
      {
        audit_date: "2026-11-20",
        location: "Green Valley Dining Hall",
        volunteer: "Courier Alex",
        food_type: "Prepared Meals",
        weight_kg: 18.5,
        meals_served: 45,
        notes: "Direct handover verified",
      },
      {
        audit_date: "2026-11-21",
        location: "Faculty Club West",
        volunteer: "Courier Alex",
        food_type: "Sandwiches",
        weight_kg: 12.0,
        meals_served: 30,
        notes: "All sealed and fresh",
      },
    ];

    // Unauthorized without key
    const noKey = await request(app).post("/api/audits/bulk").send({ rows: sampleRows });
    assert.equal(noKey.status, 401);

    // Initial bulk insert with valid key
    const firstSync = await request(app)
      .post("/api/audits/bulk")
      .set("x-api-key", "foodbridge-secret-key-2026")
      .send({ rows: sampleRows });
    assert.equal(firstSync.status, 200);
    assert.equal(firstSync.body.inserted, 2);

    // Resyncing identical rows gracefully skips duplicates (ON CONFLICT DO NOTHING)
    const secondSync = await request(app)
      .post("/api/audits/bulk")
      .set("x-api-key", "foodbridge-secret-key-2026")
      .send({ rows: sampleRows });
    assert.equal(secondSync.status, 200);
    assert.equal(secondSync.body.inserted, 0, "Duplicate rows should be skipped");
    assert.equal(secondSync.body.totalProcessed, 2);
  });

  test("11. Side Game Scores: Isolation from real meal totals", async () => {
    // Record initial platform meals
    const beforeImpact = await request(app).get("/api/impact/summary");
    const platformMealsBefore = beforeImpact.body.mealsDiverted;

    // Submit a game score
    const gameRes = await request(app)
      .post("/api/scores")
      .send({
        playerName: "SpeedyPlayer",
        points: 450,
        itemsSaved: 20,
        itemsWasted: 2,
      });
    assert.equal(gameRes.status, 201);
    assert.ok(gameRes.body.estimatedMeals > 0);

    // Query game impact endpoint
    const gameImpact = await request(app).get("/api/scores/impact");
    assert.equal(gameImpact.status, 200);
    assert.ok(gameImpact.body.gamesPlayed >= 1);

    // Confirm real platform meal total was NOT affected by game scores
    const afterImpact = await request(app).get("/api/impact/summary");
    assert.equal(afterImpact.body.mealsDiverted, platformMealsBefore, "Game score must NOT count towards platform meals");
  });
});
