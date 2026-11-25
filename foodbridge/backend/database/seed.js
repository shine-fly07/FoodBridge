import pg from "pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/foodbridge";

export async function runSeed() {
  if (process.env.NODE_ENV === "production") {
    console.error("[FATAL] Cannot run db:seed in production environment (NODE_ENV=production).");
    process.exit(1);
  }

  console.log("Seeding development data...");
  const pool = new pg.Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });

  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error("[FATAL] Could not connect to database for seeding:", err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }

  try {
    await client.query("BEGIN");

    // Standard demo users
    const passwordHash = await bcrypt.hash("password123", 10);

    const demoUsers = [
      {
        id: 1,
        name: "Campus Canteen Manager",
        email: "donor@foodbridge.org",
        role: "donor",
        org: "Green Valley Dining Hall",
        phone: "+91 98765 43210",
      },
      {
        id: 2,
        name: "Courier Alex",
        email: "volunteer@foodbridge.org",
        role: "volunteer",
        org: "Swift Rescue Network",
        phone: "+91 98765 43211",
      },
      {
        id: 3,
        name: "Hope Shelter Staff",
        email: "ngo@foodbridge.org",
        role: "ngo",
        org: "Hope Community Shelter",
        phone: "+91 98765 43212",
      },
    ];

    for (const u of demoUsers) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, role, org, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           org = EXCLUDED.org,
           phone = EXCLUDED.phone`,
        [u.id, u.name, u.email, passwordHash, u.role, u.org, u.phone]
      );
    }

    // Reset sequence so auto-increment works cleanly
    await client.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");

    // Sample active & completed listings
    const now = Date.now();
    const demoListings = [
      {
        id: 1,
        donor_id: 1,
        title: "50 Servings Fresh Veg Curry & Rice",
        meals: 50,
        pickup_address: "Student Center Gate 3, Central Campus",
        notes: "Packed in sanitized hot containers. Ready for immediate pickup.",
        expires_at: new Date(now + 130 * 60000), // ~2h 10m
        status: "available",
        volunteer_id: null,
        ngo_id: null,
        created_at: new Date(now - 15 * 60000),
      },
      {
        id: 2,
        donor_id: 1,
        title: "35 Packets Fresh Sandwiches & Fruit",
        meals: 35,
        pickup_address: "Faculty Club Dining, West Wing",
        notes: "Vegetarian and vegan options clearly labeled.",
        expires_at: new Date(now + 65 * 60000), // ~1h 05m
        status: "available",
        volunteer_id: null,
        ngo_id: null,
        created_at: new Date(now - 30 * 60000),
      },
      {
        id: 3,
        donor_id: 1,
        title: "40 Portions Pasta & Salad Trays",
        meals: 40,
        pickup_address: "Main Kitchen Receiving Dock",
        notes: "Chilled storage. Courier assigned.",
        expires_at: new Date(now + 90 * 60000),
        status: "claimed",
        volunteer_id: 2,
        ngo_id: null,
        created_at: new Date(now - 60 * 60000),
      },
      {
        id: 4,
        donor_id: 1,
        title: "60 Servings Steamed Rice & Dal",
        meals: 60,
        pickup_address: "Hostel 4 Canteen Kitchen",
        notes: "Successfully delivered to Hope Shelter.",
        expires_at: new Date(now - 20 * 60000),
        status: "distributed",
        volunteer_id: 2,
        ngo_id: 3,
        created_at: new Date(now - 180 * 60000),
      },
    ];

    for (const l of demoListings) {
      await client.query(
        `INSERT INTO listings (id, donor_id, title, meals, pickup_address, notes, expires_at, status, volunteer_id, ngo_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           meals = EXCLUDED.meals,
           pickup_address = EXCLUDED.pickup_address,
           notes = EXCLUDED.notes,
           expires_at = EXCLUDED.expires_at,
           status = EXCLUDED.status,
           volunteer_id = EXCLUDED.volunteer_id,
           ngo_id = EXCLUDED.ngo_id`,
        [
          l.id,
          l.donor_id,
          l.title,
          l.meals,
          l.pickup_address,
          l.notes,
          l.expires_at,
          l.status,
          l.volunteer_id,
          l.ngo_id,
          l.created_at,
        ]
      );
    }

    await client.query("SELECT setval('listings_id_seq', (SELECT MAX(id) FROM listings))");

    await client.query("COMMIT");
    console.log("[OK] Seeded 3 demo users and 4 sample listings successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[FAILED] Seeding error:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
