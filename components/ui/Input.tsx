'use client';

import * as React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full px-4 py-3 bg-bg-surface border border-white/10 rounded-lg',
          'text-white placeholder-gray-600 font-mono text-sm',
          'transition-all duration-200'
        )}
        {...props}
      />
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
});

