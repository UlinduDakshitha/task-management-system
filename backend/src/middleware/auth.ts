import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

/**
 * Reads the "Authorization: Bearer <token>" header, verifies it, and attaches
 * the decoded user to `req.user`. Every task route sits behind this.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required. Please log in.');
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }
}
