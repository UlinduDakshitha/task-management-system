import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High'], {
  errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
});

const statusEnum = z.enum(['Pending', 'In Progress', 'Completed'], {
  errorMap: () => ({ message: 'Status must be Pending, In Progress, or Completed' }),
});

// Shared refinement: reject due dates before today (compared as plain dates,
// so "today" itself is always allowed regardless of time of day).
function isNotPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return due >= today;
}

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional().or(z.literal('')),
  priority: priorityEnum,
  status: statusEnum,
  due_date: z
    .string()
    .min(1, 'Due date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Due date must be a valid date')
    .refine(isNotPast, 'Due date cannot be earlier than today'),
});

// Same rules, but every field optional — a PATCH-style partial update.
export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
