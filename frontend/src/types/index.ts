export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface ApiFieldError {
  field: string;
  message: string;
}
