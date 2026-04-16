import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PeersModalProps {
  isOpen: boolean;
  title: string;
  username: string;
  floor: number;
  room?: string;
  fullName?: string;
  note?: string;
  onUsernameChange: (value: string) => void;
  onFloorChange: (value: number) => void;
  onRoomChange?: (value: string) => void;
  onFullNameChange?: (value: string) => void;
  onNoteChange?: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  usernameLabel?: string;
  floorLabel?: string;
  noteLabel?: string;
  fullNameLabel?: string;
  roomLabel?: string;
  usernamePlaceholder?: string;
  notePlaceholder?: string;
  fullNamePlaceholder?: string;
  roomPlaceholder?: string;
  cancelLabel?: string;
  saveLabel?: string;
  isFreezingMode?: boolean;
  isUnfreezingMode?: boolean;
}

export default function PeersModal({
  isOpen,
  title,
  username,
  floor,
  room = '',
  fullName = '',
  note = '',
  onUsernameChange,
  onFloorChange,
  onRoomChange,
  onFullNameChange,
  onNoteChange,
  onSubmit,
  onClose,
  usernameLabel = 'Username',
  floorLabel = 'Qavat',
  noteLabel = 'Izoh (ixtiyoriy)',
  fullNameLabel = 'To\'liq ism',
  roomLabel = 'Xona',
  usernamePlaceholder = 'Username kiriting',
  notePlaceholder = 'Izoh yozing',
  fullNamePlaceholder = 'To\'liq ismni kiriting',
  roomPlaceholder = 'Xona raqamini kiriting',
  cancelLabel = 'Bekor qilish',
  saveLabel = 'Saqlash',
  isFreezingMode = false,
  isUnfreezingMode = false,
}: PeersModalProps) {
  if (!isOpen) return null;

  const isReadOnlyMode = isFreezingMode || isUnfreezingMode;

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
              {usernameLabel}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              disabled={isReadOnlyMode}
              className={`w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg ${
                isReadOnlyMode ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              required
              autoFocus={!isReadOnlyMode}
              placeholder={usernamePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              {floorLabel}
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((floorNum) => (
                <button
                  key={floorNum}
                  type="button"
                  onClick={() => !isReadOnlyMode && onFloorChange(floorNum)}
                  disabled={isReadOnlyMode}
                  className={`flex-1 min-w-[80px] px-4 py-3 rounded-xl font-medium border-2 transition-all ${
                    floor === floorNum
                      ? 'bg-gradient-primary text-black dark:text-black border-gray-900 shadow-3d-md'
                      : 'bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/20'
                  } ${isReadOnlyMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {floorNum}-qavat
                </button>
              ))}
            </div>
          </div>

          {/* Freeze reason - only in freezing mode */}
          {isFreezingMode && (
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Muzlatish sababi
              </label>
              <textarea
                value={note || ''}
                onChange={(e) => onNoteChange?.(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg resize-none"
                rows={3}
                placeholder="Muzlatish sababini kiriting"
                autoFocus
                required
              />
            </div>
          )}

          {/* Show full name and room fields only in non-freezing mode */}
          {!isFreezingMode && !isUnfreezingMode && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {fullNameLabel}
                </label>
                <input
                  type="text"
                  value={fullName || ''}
                  onChange={(e) => onFullNameChange?.(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg"
                  placeholder={fullNamePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {roomLabel}
                </label>
                <input
                  type="text"
                  value={room || ''}
                  onChange={(e) => onRoomChange?.(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg"
                  placeholder={roomPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {noteLabel}
                </label>
                <textarea
                  value={note || ''}
                  onChange={(e) => onNoteChange?.(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 dark:border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium text-base shadow-lg resize-none"
                  rows={2}
                  placeholder={notePlaceholder}
                />
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="flex-1 w-full"
            >
              {cancelLabel}
            </Button>
            <Button type="submit" variant="primary" className="flex-1 w-full">
              {saveLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
