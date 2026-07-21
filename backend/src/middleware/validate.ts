import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validates req.body against a Zod schema. On failure, throws a 422 with a
 * flat list of field-level messages so the frontend can show them inline.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ApiError(422, 'Validation failed', details);
    }

    req.body = result.data;
    next();
  };
}
