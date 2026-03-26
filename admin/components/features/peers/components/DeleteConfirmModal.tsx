import Modal from '@/components/common/Modal';
import Button from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  peerName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  cancelLabel?: string;
  deleteLabel?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  peerName,
  isDeleting,
  onConfirm,
  onCancel,
  title = "Peerni o'chirish",
  message = "Siz {name} peerni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.",
  cancelLabel = 'Bekor qilish',
  deleteLabel = "O'chirish",
}: DeleteConfirmModalProps) {
  const displayMessage = message.replace('{name}', peerName || '');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      variant="danger"
    >
      <div className="space-y-4">
        <p className="text-gray-900 dark:text-white">
          {displayMessage}
        </p>
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            className="flex-1"
            disabled={isDeleting}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant="danger"
            className="flex-1"
            loading={isDeleting}
          >
            {deleteLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
