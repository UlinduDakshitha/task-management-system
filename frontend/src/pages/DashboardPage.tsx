import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  ListChecks,
  CircleDashed,
  Loader2,
  CircleCheckBig,
  AlertTriangle,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Hexagon } from '../components/Hexagon';
import { StatCard } from '../components/StatCard';
import { TaskToolbar } from '../components/TaskToolbar';
import { TaskRow } from '../components/TaskRow';
import { PaginationBar } from '../components/PaginationBar';
import { TaskFormModal } from '../components/TaskFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTaskStats,
  fetchTasks,
  TaskQuery,
  updateTaskRequest,
} from '../api/tasks';
import { DashboardStats, Task, TaskFormValues, Pagination as PaginationType } from '../types';

const EMPTY_STATS: DashboardStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

export function DashboardPage() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [query, setQuery] = useState<TaskQuery>({ page: 1, limit: 10, sort: 'newest' });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const loadStats = useCallback(async () => {
    const data = await fetchTaskStats();
    setStats(data);
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTasks(query);
      setTasks(response.data);
      setPagination(response.pagination);
    } catch {
      toast.error('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function refreshAll(): Promise<void> {
    await Promise.all([loadTasks(), loadStats()]);
  }

  function openCreateForm(): void {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task: Task): void {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: TaskFormValues): Promise<void> {
    try {
      if (editingTask) {
        await updateTaskRequest(editingTask.id, values);
        toast.success('Task updated');
      } else {
        await createTaskRequest(values);
        toast.success('Task created');
      }
      setFormOpen(false);
      await refreshAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not save task');
    }
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!taskPendingDelete) return;
    try {
      await deleteTaskRequest(taskPendingDelete.id);
      toast.success('Task deleted');
      setTaskPendingDelete(null);
      await refreshAll();
    } catch {
      toast.error('Could not delete task');
    }
  }

  async function handleLogout(): Promise<void> {
    await logout();
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Hexagon className="h-8 w-8" />
            <div>
              <h1 className="font-display text-base font-semibold text-ink">Task Manager</h1>
              <p className="text-xs text-slate-400">Signed in as {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={<ListChecks className="h-5 w-5" />}
            accent="#10192E"
            active={!query.status && !query.priority && !query.overdue}
            onClick={() => setQuery({ page: 1, limit: 10, sort: query.sort ?? 'newest' })}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<CircleDashed className="h-5 w-5" />}
            accent="#64748B"
            active={query.status === 'Pending'}
            onClick={() =>
              setQuery({ ...query, status: 'Pending', priority: undefined, overdue: undefined, page: 1 })
            }
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<Loader2 className="h-5 w-5" />}
            accent="#2563EB"
            active={query.status === 'In Progress'}
            onClick={() =>
              setQuery({ ...query, status: 'In Progress', priority: undefined, overdue: undefined, page: 1 })
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<CircleCheckBig className="h-5 w-5" />}
            accent="#10B981"
            active={query.status === 'Completed'}
            onClick={() =>
              setQuery({ ...query, status: 'Completed', priority: undefined, overdue: undefined, page: 1 })
            }
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon={<AlertTriangle className="h-5 w-5" />}
            accent="#DC2626"
            active={!!query.overdue}
            onClick={() =>
              setQuery({ ...query, overdue: true, status: undefined, priority: undefined, page: 1 })
            }
          />
        </section>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Your Tasks</h2>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-sm font-medium text-ink hover:brightness-95"
            >
              <Plus className="h-4 w-4" /> New Task
            </button>
          </div>

          <TaskToolbar query={query} onChange={setQuery} />

          <div className="rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-8 text-center text-sm text-slate-400">Loading tasks…</p>
            ) : tasks.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-display text-sm font-medium text-ink">No tasks match right now</p>
                <p className="mt-1 text-sm text-slate-400">
                  Try clearing filters, or create a new task to get started.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={openEditForm}
                  onDelete={setTaskPendingDelete}
                />
              ))
            )}
            {pagination && (
              <PaginationBar
                pagination={pagination}
                onPageChange={(page) => setQuery({ ...query, page })}
              />
            )}
          </div>
        </div>
      </main>

      <TaskFormModal
        open={formOpen}
        initialTask={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!taskPendingDelete}
        title="Delete this task?"
        message={`"${taskPendingDelete?.title}" will be permanently removed. This cannot be undone.`}
        onCancel={() => setTaskPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
