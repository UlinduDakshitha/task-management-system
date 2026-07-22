import { loginSchema } from './authValidators';

describe('loginSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    const result = loginSchema.safeParse({ email: 'admin@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/valid email/i);
    }
  });

  it('rejects an empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'admin@test.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/password is required/i);
    }
  });

  it('rejects a missing password field entirely', () => {
    const result = loginSchema.safeParse({ email: 'admin@test.com' });
    expect(result.success).toBe(false);
  });
});
