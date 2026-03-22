import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-xl border-2 border-gray-900 transition-all inline-flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-primary text-white shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px]',
    secondary: 'bg-accent-pink hover:bg-accent-pink-hover text-white shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px]',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px]',
    ghost: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}
