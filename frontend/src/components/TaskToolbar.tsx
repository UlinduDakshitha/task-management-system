import { ChangeEvent, FormEvent, useState } from 'react';
import { TaskQuery } from '../api/tasks';

interface TaskToolbarProps {
  query: TaskQuery;
  onChange: (next: TaskQuery) => void;
}

export function TaskToolbar({ query, onChange }: TaskToolbarProps) {
  const [searchInput, setSearchInput] = useState(query.search ?? '');

  function handleSearchSubmit(e: FormEvent): void {
    e.preventDefault();
    onChange({ ...query, search: searchInput, page: 1 });
  }

  function handleSelect(field: 'status' | 'priority' | 'sort') {
    return (e: ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...query, [field]: e.target.value || undefined, overdue: undefined, page: 1 });
    };
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
        <input
          type="search"
          placeholder="Search by task title…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          aria-label="Search tasks by title"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-light"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <select
          value={query.status ?? ''}
          onChange={handleSelect('status')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={query.priority ?? ''}
          onChange={handleSelect('priority')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={query.sort ?? 'newest'}
          onChange={handleSelect('sort')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          aria-label="Sort tasks"
        >
          <option value="newest">Newest created</option>
          <option value="oldest">Oldest created</option>
          <option value="due_date">Due date</option>
        </select>
      </div>
    </div>
  );
}
