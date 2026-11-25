import { AppError } from "./errors.js";

/**
 * Validates request body against a Zod schema.
 */
export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new AppError("VALIDATION_ERROR", 400, "Request payload validation failed.", formatted));
    }
    req.body = result.data;
    next();
  };
}

/**
 * Validates request query parameters against a Zod schema.
 */
export function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const formatted = result.error.issues.map((e) => ({
        param: e.path.join("."),
        message: e.message,
      }));
      return next(new AppError("VALIDATION_ERROR", 400, "Query parameter validation failed.", formatted));
    }
    req.query = result.data;
    next();
  };
}
