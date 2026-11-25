import pg from "pg";
import bcrypt from "bcryptjs";

const isProduction = process.env.NODE_ENV === "production";
const isDemoModeAllowed = process.env.DEMO_MODE === "true" && !isProduction;

export const realPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/foodbridge",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isPostgresConnected = false;

export async function checkDbConnection() {
  try {
    const client = await realPool.connect();
    await client.query("SELECT 1");
    client.release();
    isPostgresConnected = true;
    console.log("[OK] PostgreSQL database connected successfully.");
    return true;
  } catch (err) {
    isPostgresConnected = false;
    if (isDemoModeAllowed) {
      console.warn(`[WARN] PostgreSQL connection failed (${err.message}). DEMO_MODE=true is enabled: operating with memory fallback.`);
      return false;
    }
    console.error(`[FATAL] PostgreSQL connection failed: ${err.message}`);
    throw err;
  }
}

// In-Memory fallback store for offline development when DEMO_MODE=true
const defaultPasswordHash = bcrypt.hashSync("password123", 10);

const memoryStore = {
  users: [
    {
      id: 1,
      name: "Campus Canteen Manager",
      email: "donor@foodbridge.org",
      password_hash: defaultPasswordHash,
      role: "donor",
      org: "Green Valley Dining Hall",
      phone: "+91 98765 43210",
      created_at: new Date(),
    },
    {
      id: 2,
      name: "Courier Alex",
      email: "volunteer@foodbridge.org",
      password_hash: defaultPasswordHash,
      role: "volunteer",
      org: "Swift Rescue Network",
      phone: "+91 98765 43211",
      created_at: new Date(),
    },
    {
      id: 3,
      name: "Hope Shelter Staff",
      email: "ngo@foodbridge.org",
      password_hash: defaultPasswordHash,
      role: "ngo",
      org: "Hope Community Shelter",
      phone: "+91 98765 43212",
      created_at: new Date(),
    },
  ],
  listings: [
    {
      id: 1,
      donor_id: 1,
      donor_name: "Campus Canteen Manager",
      donor_org: "Green Valley Dining Hall",
      title: "50 Servings Fresh Veg Curry & Rice",
      meals: 50,
      pickup_address: "Student Center Gate 3, Central Campus",
      notes: "Packed in sanitized hot containers. Ready for immediate pickup.",
      expires_at: new Date(Date.now() + 120 * 60000).toISOString(),
      status: "available",
      volunteer_id: null,
      volunteer_name: null,
      ngo_id: null,
      ngo_org: null,
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 2,
      donor_id: 1,
      donor_name: "Campus Canteen Manager",
      donor_org: "Green Valley Dining Hall",
      title: "35 Packets Fresh Sandwiches & Fruit",
      meals: 35,
      pickup_address: "Faculty Club Dining, West Wing",
      notes: "Vegetarian and vegan options clearly labeled.",
      expires_at: new Date(Date.now() + 60 * 60000).toISOString(),
      status: "available",
      volunteer_id: null,
      volunteer_name: null,
      ngo_id: null,
      ngo_org: null,
      created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    },
    {
      id: 3,
      donor_id: 1,
      donor_name: "Campus Canteen Manager",
      donor_org: "Green Valley Dining Hall",
      title: "40 Portions Pasta & Salad Trays",
      meals: 40,
      pickup_address: "Main Kitchen Receiving Dock",
      notes: "Chilled storage. Assigned to Courier Alex.",
      expires_at: new Date(Date.now() + 90 * 60000).toISOString(),
      status: "claimed",
      volunteer_id: 2,
      volunteer_name: "Courier Alex",
      ngo_id: null,
      ngo_org: null,
      created_at: new Date(Date.now() - 60 * 60000).toISOString(),
      claimed_at: new Date(Date.now() - 10 * 60000).toISOString(),
    },
  ],
  audits: [],
  scores: [],
};

export const pool = {
  async query(text, params = []) {
    try {
      const res = await realPool.query(text, params);
      return res;
    } catch (err) {
      if (isDemoModeAllowed) {
        return handleMemoryQuery(text, params);
      }
      throw err;
    }
  },
  async connect() {
    try {
      return await realPool.connect();
    } catch (err) {
      if (isDemoModeAllowed) {
        return {
          query: (t, p) => pool.query(t, p),
          release: () => {},
        };
      }
      throw err;
    }
  },
  async end() {
    return realPool.end();
  },
  on() {},
};

function handleMemoryQuery(text, params = []) {
  const sql = text.trim();
  const now = Date.now();

  if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") {
    return { rows: [], rowCount: 0 };
  }

  // Users queries
  if (sql.includes("FROM users")) {
    if (sql.includes("WHERE role = $1")) {
      const user = memoryStore.users.find((u) => u.role === String(params[0]));
      return { rows: user ? [user] : [] };
    }
    if (sql.includes("WHERE LOWER(email) = LOWER($1)") || sql.includes("WHERE email = $1")) {
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
      return { rows: user ? [user] : [] };
    }
    if (sql.includes("WHERE org IS NOT NULL")) {
      return {
        rows: memoryStore.users
          .filter((u) => u.org)
          .map((u) => ({ id: u.id, name: u.name, role: u.role, org: u.org }))
          .slice(0, 30),
      };
    }
    if (sql.includes("WHERE id = $1") || sql.includes("id = $1")) {
      const user = memoryStore.users.find((u) => u.id === Number(params[0]));
      return { rows: user ? [user] : [] };
    }
    return { rows: memoryStore.users };
  }

  if (sql.includes("INSERT INTO users")) {
    const id = memoryStore.users.length + 1;
    const user = {
      id,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3],
      org: params[4] || null,
      phone: params[5] || null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    memoryStore.users.push(user);
    return { rows: [user] };
  }

  // Listings pipeline & summary queries
  if (sql.includes("FROM listings") && (sql.includes("meals_diverted") || sql.includes("SUM(l.meals)") || sql.includes("COUNT(*) FILTER"))) {
    const available = memoryStore.listings.filter(
      (l) => l.status === "available" && (!l.expires_at || new Date(l.expires_at).getTime() > now)
    ).length;
    const claimed = memoryStore.listings.filter((l) => l.status === "claimed").length;
    const collected = memoryStore.listings.filter((l) => l.status === "collected").length;
    const distributed = memoryStore.listings.filter((l) => l.status === "distributed").length;
    const mealsDiverted = memoryStore.listings
      .filter((l) => l.status === "collected" || l.status === "distributed")
      .reduce((acc, l) => acc + (Number(l.meals) || 0), 0);

    return {
      rows: [
        {
          available,
          claimed,
          collected,
          distributed,
          active_listings: available + claimed,
          meals_diverted: mealsDiverted,
          total_meals: mealsDiverted,
          meals: mealsDiverted,
        },
      ],
    };
  }

  // Select listings query
  if (sql.includes("SELECT l.*") || sql.includes("FROM listings")) {
    if (sql.includes("WHERE l.id = $1") || sql.includes("WHERE id = $1")) {
      const item = memoryStore.listings.find((l) => l.id === Number(params[0]));
      return { rows: item ? [item] : [] };
    }
    // Filter out expired unclaimed listings
    const rows = memoryStore.listings.filter(
      (l) => l.status !== "available" || !l.expires_at || new Date(l.expires_at).getTime() > now
    );
    return { rows };
  }

  // Insert listing query
  if (sql.includes("INSERT INTO listings")) {
    const id = memoryStore.listings.length + 1;
    const donorId = Number(params[0]) || 1;
    const donor = memoryStore.users.find((u) => u.id === donorId) || memoryStore.users[0];
    const mins = Number(params[5]) || 120;
    const item = {
      id,
      donor_id: donorId,
      donor_name: donor ? donor.name : "Campus Canteen Manager",
      donor_org: donor ? donor.org || donor.name : "Green Valley Dining Hall",
      title: params[1],
      meals: Number(params[2]),
      pickup_address: params[3],
      notes: params[4] || null,
      expires_at: new Date(now + mins * 60000).toISOString(),
      status: "available",
      volunteer_id: null,
      volunteer_name: null,
      ngo_id: null,
      ngo_org: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.listings.unshift(item);
    return { rows: [item] };
  }

  // Update listing transition query
  if (sql.includes("UPDATE listings")) {
    const id = Number(params[0]);
    const item = memoryStore.listings.find((l) => l.id === id);
    if (!item) return { rows: [], rowCount: 0 };

    if (sql.includes("SET status = 'claimed'") || sql.includes("SET status='claimed'")) {
      if (item.status !== "available" || (item.expires_at && new Date(item.expires_at).getTime() <= now)) {
        return { rows: [], rowCount: 0 };
      }
      item.status = "claimed";
      item.volunteer_id = Number(params[1]);
      const vol = memoryStore.users.find((u) => u.id === item.volunteer_id);
      if (vol) item.volunteer_name = vol.name;
      item.claimed_at = new Date().toISOString();
      return { rows: [item], rowCount: 1 };
    }

    if (sql.includes("SET status = 'collected'") || sql.includes("SET status='collected'")) {
      if (item.status !== "claimed" || item.volunteer_id !== Number(params[1])) {
        return { rows: [], rowCount: 0 };
      }
      item.status = "collected";
      item.collected_at = new Date().toISOString();
      return { rows: [item], rowCount: 1 };
    }

    if (sql.includes("SET status = 'distributed'") || sql.includes("SET status='distributed'")) {
      if (item.status !== "collected") {
        return { rows: [], rowCount: 0 };
      }
      item.status = "distributed";
      item.ngo_id = Number(params[1]);
      const ngo = memoryStore.users.find((u) => u.id === item.ngo_id);
      if (ngo) item.ngo_org = ngo.org || ngo.name;
      item.distributed_at = new Date().toISOString();
      return { rows: [item], rowCount: 1 };
    }

    if (sql.includes("SET status = 'cancelled'") || sql.includes("SET status='cancelled'")) {
      if (item.status !== "available" || item.donor_id !== Number(params[1])) {
        return { rows: [], rowCount: 0 };
      }
      item.status = "cancelled";
      return { rows: [item], rowCount: 1 };
    }

    if (sql.includes("status = 'expired'")) {
      const expiredItems = memoryStore.listings.filter(
        (l) => (l.status === "available" || l.status === "claimed") && l.expires_at && new Date(l.expires_at).getTime() <= now
      );
      expiredItems.forEach((l) => {
        l.status = "expired";
        l.volunteer_id = null;
        l.volunteer_name = null;
      });
      return { rows: expiredItems, rowCount: expiredItems.length };
    }
  }

  // Audits queries
  if (sql.includes("INSERT INTO audits")) {
    const exists = memoryStore.audits.some(
      (a) =>
        a.audit_date === params[0] &&
        a.location === params[1] &&
        a.volunteer === params[2] &&
        a.food_type === params[3]
    );
    if (!exists) {
      memoryStore.audits.push({
        id: memoryStore.audits.length + 1,
        audit_date: params[0],
        location: params[1],
        volunteer: params[2],
        food_type: params[3],
        weight_kg: Number(params[4]),
        meals_served: Number(params[5]),
        notes: params[6] || null,
      });
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (sql.includes("FROM audits")) {
    const totalAudits = memoryStore.audits.length;
    const totalWeight = memoryStore.audits.reduce((acc, a) => acc + (a.weight_kg || 0), 0);
    const totalMeals = memoryStore.audits.reduce((acc, a) => acc + (a.meals_served || 0), 0);
    return {
      rows: [
        {
          total_audits: totalAudits,
          total_weight_kg: totalWeight,
          total_meals_served: totalMeals,
        },
      ],
    };
  }

  // Scores & Players queries
  if (sql.includes("INSERT INTO players")) {
    let player = (memoryStore.players = memoryStore.players || []).find((p) => p.name === params[0]);
    if (!player) {
      player = { id: memoryStore.players.length + 1, name: params[0] };
      memoryStore.players.push(player);
    }
    return { rows: [player] };
  }

  if (sql.includes("INSERT INTO scores")) {
    const id = (memoryStore.scores = memoryStore.scores || []).length + 1;
    const score = {
      id,
      player_id: Number(params[0]),
      points: Number(params[1]),
      items_saved: Number(params[2]),
      items_wasted: Number(params[3]),
      estimated_meals: Number(params[4]),
    };
    memoryStore.scores.push(score);
    return { rows: [score] };
  }

  if (sql.includes("FROM scores")) {
    const scores = memoryStore.scores || [];
    const gameMeals = scores.reduce((acc, s) => acc + (s.estimated_meals || 0), 0);
    const gamesPlayed = scores.length;
    return {
      rows: [
        {
          game_estimated_meals: gameMeals,
          games_played: gamesPlayed,
          total_games: gamesPlayed,
        },
      ],
    };
  }

  return { rows: [] };
}
