interface BadgeProps {
  variant: 'success' | 'danger' | 'warning' | 'info' | 'default';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantClasses = {
  success: 'bg-green-100 text-green-700 border border-green-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs font-medium rounded',
  md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
};

export default function Badge({ variant, children, size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-block ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}
