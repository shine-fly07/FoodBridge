export class AppError extends Error {
  constructor(code, statusCode, message, details = null) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps async Express handlers to catch unhandled promise rejections
 * and route them to Express's global error handler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Canonical Express error handling middleware.
 * Outputs { error: { code, message, details? } }
 */
export function globalErrorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || (err.status >= 400 && err.status < 600 ? err.status : 500);
  const code = err.code || (statusCode === 400 ? "BAD_REQUEST" : statusCode === 401 ? "UNAUTHENTICATED" : statusCode === 403 ? "UNAUTHORIZED" : statusCode === 404 ? "NOT_FOUND" : statusCode === 409 ? "CONFLICT" : statusCode === 422 ? "VALIDATION_ERROR" : "INTERNAL_SERVER_ERROR");

  const message = err.message || "An unexpected internal server error occurred.";
  const details = err.details || undefined;

  // Log 500 errors for observability
  if (statusCode >= 500) {
    console.error(`[ERROR 500] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV !== "production" && err.stack && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  });
}
