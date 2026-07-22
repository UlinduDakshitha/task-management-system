import { createTaskSchema, updateTaskSchema } from './taskValidators';

// A fixed "today" so due-date tests don't become flaky depending on when
// the test suite happens to run.
const REAL_DATE = Date;
function mockToday(isoDate: string): void {
  const fixed = new REAL_DATE(isoDate);
  // @ts-expect-error - intentionally overriding the global Date for the test
  global.Date = class extends REAL_DATE {
    constructor(...args: unknown[]) {
      if (args.length === 0) {
        super(fixed.getTime());
      } else {
        // @ts-expect-error - forwarding constructor args
        super(...args);
      }
    }
  };
}
function restoreDate(): void {
  global.Date = REAL_DATE;
}

describe('createTaskSchema', () => {
  afterEach(() => restoreDate());

  const validTask = {
    title: 'Write documentation',
    description: 'Cover setup and API endpoints',
    priority: 'Medium' as const,
    status: 'Pending' as const,
    due_date: '2026-08-01',
  };

  it('accepts a fully valid task', () => {
    mockToday('2026-07-22');
    const result = createTaskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createTaskSchema.safeParse({ ...validTask, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/title is required/i);
    }
  });

  it('rejects a title longer than 200 characters', () => {
    const result = createTaskSchema.safeParse({ ...validTask, title: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('allows description to be omitted', () => {
    const { description, ...withoutDescription } = validTask;
    mockToday('2026-07-22');
    const result = createTaskSchema.safeParse(withoutDescription);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid priority value', () => {
    const result = createTaskSchema.safeParse({ ...validTask, priority: 'Urgent' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/priority must be/i);
    }
  });

  it('rejects an invalid status value', () => {
    const result = createTaskSchema.safeParse({ ...validTask, status: 'Archived' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/status must be/i);
    }
  });

  it('rejects a missing due date', () => {
    const result = createTaskSchema.safeParse({ ...validTask, due_date: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a due date before today', () => {
    mockToday('2026-07-22');
    const result = createTaskSchema.safeParse({ ...validTask, due_date: '2026-07-20' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/cannot be earlier than today/i);
    }
  });

  it("accepts today's date as a valid due date", () => {
    mockToday('2026-07-22');
    const result = createTaskSchema.safeParse({ ...validTask, due_date: '2026-07-22' });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed due date string', () => {
    const result = createTaskSchema.safeParse({ ...validTask, due_date: 'not-a-date' });
    expect(result.success).toBe(false);
  });
});

describe('updateTaskSchema', () => {
  afterEach(() => restoreDate());

  it('accepts a partial update with only status changed', () => {
    const result = updateTaskSchema.safeParse({ status: 'Completed' });
    expect(result.success).toBe(true);
  });

  it('accepts an empty object (no fields changed)', () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still enforces due-date rules when due_date is included', () => {
    mockToday('2026-07-22');
    const result = updateTaskSchema.safeParse({ due_date: '2020-01-01' });
    expect(result.success).toBe(false);
  });

  it('still rejects an invalid priority even in a partial update', () => {
    const result = updateTaskSchema.safeParse({ priority: 'Critical' });
    expect(result.success).toBe(false);
  });
});
