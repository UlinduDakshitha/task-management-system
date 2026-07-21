import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../types';
import { LoginInput } from '../validators/authValidators';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  // Same message whether the email doesn't exist or the password is wrong,
  // so we don't leak which emails are registered.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ id: user.id, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // JWTs are stateless, so there's no server-side session to destroy.
  // This endpoint exists for a clean client-side contract (and to make room
  // for a token denylist later if that becomes necessary).
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
