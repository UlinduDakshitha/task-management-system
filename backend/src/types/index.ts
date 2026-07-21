export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  id: number;
  email: string;
}

// Augment Express's Request type so `req.user` is available after the
// auth middleware runs, without needing `any` casts everywhere.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
