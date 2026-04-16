import Modal from '@/components/common/Modal';
import Button from '@/components/ui/Button';
import { Language, getTranslation } from '@/lib/i18n';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  peerName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}

export default function DeleteConfirmModal({
  isOpen,
  peerName,
  isDeleting,
  onConfirm,
  onCancel,
  language,
}: DeleteConfirmModalProps) {
  const t = (key: string) => getTranslation(language, key as any);
  const displayMessage = t('deleteConfirmMessage').replace('{name}', peerName || '');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={t('deleteConfirmTitle')}
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
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant="danger"
            className="flex-1"
            loading={isDeleting}
          >
            {t('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
