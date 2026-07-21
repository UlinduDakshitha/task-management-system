import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { Task } from '../types';
import { CreateTaskInput, UpdateTaskInput } from '../validators/taskValidators';

const SORT_COLUMNS: Record<string, string> = {
  newest: 'created_at DESC',
  oldest: 'created_at ASC',
  due_date: 'due_date ASC',
};

/**
 * GET /api/tasks
 * Supports: ?search=&status=&priority=&sort=&page=&limit=
 * All filters are optional and can be combined.
 */
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { search, status, priority, sort } = req.query as Record<string, string | undefined>;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = ['user_id = $1'];
  const values: unknown[] = [userId];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  const whereClause = conditions.join(' AND ');
  const orderClause = SORT_COLUMNS[sort ?? 'newest'] ?? SORT_COLUMNS.newest;

  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*) FROM tasks WHERE ${whereClause}`,
    values
  );
  const total = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const dataResult = await pool.query<Task>(
    `SELECT * FROM tasks WHERE ${whereClause} ORDER BY ${orderClause} LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  res.status(200).json({
    success: true,
    data: dataResult.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query<Task>('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { title, description, priority, status, due_date } = req.body as CreateTaskInput;

  const result = await pool.query<Task>(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, title, description || null, priority, status, due_date]
  );

  res.status(201).json({ success: true, message: 'Task created', data: result.rows[0] });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const updates = req.body as UpdateTaskInput;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No fields provided to update');
  }

  // Build SET clause dynamically from whichever fields were sent, so a
  // partial update (e.g. just changing status) doesn't require every field.
  const fields = Object.keys(updates) as (keyof UpdateTaskInput)[];
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  const values = fields.map((field) => updates[field]);

  const result = await pool.query<Task>(
    `UPDATE tasks SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${
      fields.length + 2
    } RETURNING *`,
    [...values, id, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({ success: true, message: 'Task updated', data: result.rows[0] });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [
    id,
    userId,
  ]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({ success: true, message: 'Task deleted' });
});

/** GET /api/tasks/stats/summary — powers the dashboard cards. */
export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query<{
    total: string;
    pending: string;
    in_progress: string;
    completed: string;
    overdue: string;
  }>(
    `SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress,
      COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
      COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Completed') AS overdue
    FROM tasks WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  res.status(200).json({
    success: true,
    data: {
      total: Number(row.total),
      pending: Number(row.pending),
      inProgress: Number(row.in_progress),
      completed: Number(row.completed),
      overdue: Number(row.overdue),
    },
  });
});
