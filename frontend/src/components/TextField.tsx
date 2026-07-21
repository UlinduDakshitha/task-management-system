import { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:ring-2 focus:ring-amber ${
          error ? 'border-red-400' : 'border-slate-300'
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
