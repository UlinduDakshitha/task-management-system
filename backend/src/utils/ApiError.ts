/**
 * Lets controllers throw a typed error with an HTTP status attached,
 * instead of scattering `res.status(x).json(...)` calls next to every check.
 * The central error handler middleware turns these into a consistent response shape.
 */
export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
