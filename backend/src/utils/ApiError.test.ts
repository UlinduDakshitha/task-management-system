import { ApiError } from './ApiError';

describe('ApiError', () => {
  it('stores the status code and message', () => {
    const err = new ApiError(404, 'Task not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Task not found');
  });

  it('is a real instance of Error and ApiError', () => {
    const err = new ApiError(500, 'Something broke');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('optionally carries structured details', () => {
    const details = [{ field: 'email', message: 'Enter a valid email address' }];
    const err = new ApiError(422, 'Validation failed', details);
    expect(err.details).toEqual(details);
  });

  it('defaults details to undefined when not provided', () => {
    const err = new ApiError(401, 'Unauthorized');
    expect(err.details).toBeUndefined();
  });
});
