import { FormEvent, useEffect, useState } from 'react';
import { Task, TaskFormValues } from '../types';
import { TextField } from './TextField';
import { todayISO } from '../utils/date';

interface TaskFormModalProps {
  open: boolean;
  initialTask: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const EMPTY_FORM: TaskFormValues = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  due_date: '',
};

type FormErrors = Partial<Record<keyof TaskFormValues, string>>;

export function TaskFormModal({ open, initialTask, onClose, onSubmit }: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description ?? '',
        priority: initialTask.priority,
        status: initialTask.status,
        due_date: initialTask.due_date.split('T')[0],
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [initialTask, open]);

  if (!open) return null;

  function validate(): boolean {
    const next: FormErrors = {};
    if (!values.title.trim()) next.title = 'Title is required';
    if (!values.due_date) {
      next.due_date = 'Due date is required';
    } else if (values.due_date < todayISO()) {
      next.due_date = 'Due date cannot be earlier than today';
    }
    if (!values.priority) next.priority = 'Priority is required';
    if (!values.status) next.status = 'Status is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="font-display text-lg font-semibold text-ink dark:text-white">
          {initialTask ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <TextField
            id="title"
            label="Title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            error={errors.title}
            placeholder="e.g. Write API documentation"
          />

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              placeholder="Optional details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                id="priority"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={values.priority}
                onChange={(e) =>
                  setValues({ ...values, priority: e.target.value as TaskFormValues['priority'] })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-amber dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={values.status}
                onChange={(e) =>
                  setValues({ ...values, status: e.target.value as TaskFormValues['status'] })
                }
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <TextField
            id="due_date"
            label="Due Date"
            type="date"
            min={todayISO()}
            value={values.due_date}
            onChange={(e) => setValues({ ...values, due_date: e.target.value })}
            error={errors.due_date}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-light disabled:opacity-60"
            >
              {submitting ? 'Saving…' : initialTask ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
