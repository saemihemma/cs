'use client';

import * as React from 'react';
import { clsx } from 'clsx';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, id, children, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full h-10 px-3 bg-bg-surface border border-white/10 rounded-lg text-sm text-white',
          'focus:border-orange-500 focus:outline-none cursor-pointer'
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});

