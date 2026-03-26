import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'danger';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md', variant = 'default' }: ModalProps) {
  if (!isOpen) return null;

  const headerBgClass = variant === 'danger' ? 'border-red-500' : 'border-gray-900';
  const titleClass = variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl ${sizeClasses[size]} w-full border-2 border-gray-900 shadow-3d-xl max-h-[90vh] sm:max-h-auto overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b-2 ${headerBgClass}`}>
          <h2 className={`text-lg font-semibold ${titleClass}`}>{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
