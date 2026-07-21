import { api } from './client';
import { ApiListResponse, DashboardStats, Task, TaskFormValues } from '../types';

export interface TaskQuery {
  search?: string;
  status?: string;
  priority?: string;
  sort?: 'newest' | 'oldest' | 'due_date';
  page?: number;
  limit?: number;
}

export async function fetchTasks(query: TaskQuery): Promise<ApiListResponse<Task>> {
  const { data } = await api.get<ApiListResponse<Task>>('/tasks', { params: query });
  return data;
}

export async function fetchTaskStats(): Promise<DashboardStats> {
  const { data } = await api.get<{ success: boolean; data: DashboardStats }>(
    '/tasks/stats/summary'
  );
  return data.data;
}

export async function createTaskRequest(values: TaskFormValues): Promise<Task> {
  const { data } = await api.post<{ success: boolean; data: Task }>('/tasks', values);
  return data.data;
}

export async function updateTaskRequest(id: number, values: Partial<TaskFormValues>): Promise<Task> {
  const { data } = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, values);
  return data.data;
}

export async function deleteTaskRequest(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
