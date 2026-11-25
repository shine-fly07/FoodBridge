/**
 * Validates critical environment variables at boot.
 * Enforces production safety while providing sensible development defaults.
 */
export function validateEnvironment() {
  const isProd = process.env.NODE_ENV === "production";

  // Development defaults if not explicitly set
  if (!process.env.PORT) process.env.PORT = "4000";
  if (!process.env.JWT_SECRET && !isProd) {
    process.env.JWT_SECRET = "foodbridge-super-secret-jwt-dev-key-2026-min32chars";
  }
  if (!process.env.AUDIT_API_KEY && !isProd) {
    process.env.AUDIT_API_KEY = "foodbridge-secret-key-2026";
  }

  const required = isProd
    ? ["PORT", "DATABASE_URL", "JWT_SECRET", "AUDIT_API_KEY", "CORS_ORIGIN"]
    : ["PORT"];

  const missing = required.filter((key) => !process.env[key] || !process.env[key].trim());

  if (missing.length > 0) {
    console.error(`\n[FATAL] Missing required environment variable(s): ${missing.join(", ")}`);
    console.error("Please configure these variables in your .env file or environment.\n");
    process.exit(1);
  }

  if (isProd) {
    if (process.env.AUDIT_API_KEY === "change-me") {
      console.error("\n[FATAL] AUDIT_API_KEY cannot be 'change-me' in production environment.");
      process.exit(1);
    }
    if (process.env.JWT_SECRET.length < 32) {
      console.error("\n[FATAL] JWT_SECRET must be at least 32 characters long in production.");
      process.exit(1);
    }
  }
}
