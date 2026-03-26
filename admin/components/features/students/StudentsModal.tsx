import { X } from 'lucide-react';
import Button from '../../ui/Button';

interface StudentsModalProps {
  isOpen: boolean;
  title: string;
  username: string;
  floor: number;
  onUsernameChange: (value: string) => void;
  onFloorChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function StudentsModal({
  isOpen,
  title,
  username,
  floor,
  onUsernameChange,
  onFloorChange,
  onSubmit,
  onClose,
}: StudentsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-gray-900 shadow-3d-xl max-h-[90vh] sm:max-h-auto overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Ism
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg"
              required
              autoFocus
              placeholder="Talaba ismini kiriting"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Qavat
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((floorNum) => (
                <button
                  key={floorNum}
                  type="button"
                  onClick={() => onFloorChange(floorNum)}
                  className={`flex-1 min-w-[80px] px-4 py-3 rounded-xl font-medium border-2 transition-all ${
                    floor === floorNum
                      ? 'bg-gradient-primary text-white border-gray-900 shadow-3d-md'
                      : 'bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/20'
                  }`}
                >
                  {floorNum}-qavat
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="flex-1 w-full"
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" className="flex-1 w-full">
              Saqlash
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
