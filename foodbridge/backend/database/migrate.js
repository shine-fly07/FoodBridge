import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/foodbridge";

export async function runMigrations() {
  console.log("Starting FoodBridge database migrations...");
  console.log(`Target: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}`);

  const pool = new pg.Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });

  let client;
  try {
    client = await pool.connect();
    console.log("[OK] Connected to PostgreSQL.");
  } catch (err) {
    console.error("[FATAL] Could not connect to PostgreSQL:", err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }

  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(120) NOT NULL UNIQUE,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // 2. Discover migration files
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found: ${migrationsDir}`);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    console.log(`Found ${files.length} migration file(s).`);

    // 3. Apply pending migrations inside transactions
    for (const file of files) {
      const { rows } = await client.query(
        "SELECT id FROM schema_migrations WHERE name = $1",
        [file]
      );

      if (rows.length > 0) {
        console.log(`  [SKIP] ${file} (already applied)`);
        continue;
      }

      console.log(`  [APPLYING] ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (name) VALUES ($1)",
          [file]
        );
        await client.query("COMMIT");
        console.log(`  [APPLIED] ${file} successfully.`);
      } catch (migrationErr) {
        await client.query("ROLLBACK");
        console.error(`  [FAILED] Migration ${file} failed:`, migrationErr.message);
        throw migrationErr;
      }
    }

    console.log("[SUCCESS] All migrations completed successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
}
