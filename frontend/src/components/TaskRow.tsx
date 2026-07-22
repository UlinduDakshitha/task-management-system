import { Task } from '../types';
import { PriorityBadge, StatusBadge, OverdueBadge } from './Badges';
import { formatDate, formatDateTime, isOverdue } from '../utils/date';

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-medium text-ink dark:text-white">{task.title}</h3>
          {overdue && <OverdueBadge />}
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className="text-xs text-slate-400 dark:text-slate-500">Due {formatDate(task.due_date)}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-slate-400 dark:text-slate-500">
          <span>Created {formatDateTime(task.created_at)}</span>
          <span>Updated {formatDateTime(task.updated_at)}</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 self-start sm:self-center">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
