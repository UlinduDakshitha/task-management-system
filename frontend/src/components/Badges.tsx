import { TaskPriority, TaskStatus } from '../types';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-soft text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-white">
      Overdue
    </span>
  );
}
