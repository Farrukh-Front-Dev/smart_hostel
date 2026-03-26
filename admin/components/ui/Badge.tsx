import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const variantClasses = {
  success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  error: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
};

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border-2 border-gray-900 ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
