import { useState } from 'react';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { usePeers, usePeerForm, usePeerActions } from '../components/features/peers/hooks/index';
import { Peer, FloorFilter, StatusFilter } from '../components/features/peers/types/index';
import {
  PeersHeader,
  PeersFilters,
  PeersTable,
  PeersGrid,
  PeersModal,
  PeersEmpty,
  DeleteConfirmModal,
} from '../components/features/peers/components/index';

export default function Peers() {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  // State management
  const { peers, loading, fetchPeers, setPeers } = usePeers();
  const {
    formData,
    setFormData,
    editingPeer,
    shouldFreezeAfterSave,
    setShouldFreezeAfterSave,
    shouldUnfreezeAfterSave,
    setShouldUnfreezeAfterSave,
    resetForm,
    loadPeerForEdit,
    loadPeerForFreeze,
    loadPeerForUnfreeze,
  } = usePeerForm();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState<FloorFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [peerToDelete, setPeerToDelete] = useState<Peer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { createPeer, updatePeer, freezePeer, unfreezePeer, deletePeer } = usePeerActions(fetchPeers);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPeer) {
        await updatePeer(editingPeer.id, formData);

        if (shouldFreezeAfterSave) {
          await freezePeer(editingPeer.id, formData.note);
          setShouldFreezeAfterSave(false);
        }

        if (shouldUnfreezeAfterSave) {
          await unfreezePeer(editingPeer.id);
          setShouldUnfreezeAfterSave(false);
        }
      } else {
        await createPeer(formData);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = (peer: Peer) => {
    setPeerToDelete(peer);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!peerToDelete) return;
    try {
      setDeleting(true);
      await deletePeer(peerToDelete.id);
      setDeleteConfirmOpen(false);
      setPeerToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleFreeze = (peer: Peer) => {
    loadPeerForFreeze(peer);
    setShowModal(true);
  };

  const handleUnfreeze = (peer: Peer) => {
    loadPeerForUnfreeze(peer);
    setShowModal(true);
  };

  const handleEdit = (peer: Peer) => {
    loadPeerForEdit(peer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Filtering
  const filteredPeers = peers.filter((peer) => {
    const matchesSearch = peer.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = floorFilter === 'all' || peer.floor === floorFilter;
    const matchesStatus = 
      statusFilter === null || 
      (statusFilter === 'active' && !peer.isFrozen) ||
      (statusFilter === 'frozen' && peer.isFrozen);
    return matchesSearch && matchesFloor && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-cyan border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PeersHeader title={t('students' as any)} description={t('manageStudents' as any)} />

      {/* Filters */}
      <PeersFilters
        searchQuery={searchQuery}
        onSearchChange={(value: string) => setSearchQuery(value)}
        floorFilter={floorFilter}
        onFloorChange={(value: FloorFilter) => setFloorFilter(value)}
        statusFilter={statusFilter}
        onStatusChange={(value: StatusFilter) => setStatusFilter(value)}
        onAddClick={() => setShowModal(true)}
        language={language}
      />

      {/* Content */}
      {filteredPeers.length > 0 ? (
        <>
          <PeersTable
            peers={filteredPeers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFreeze={handleFreeze}
            onUnfreeze={handleUnfreeze}
          />

          <PeersGrid
            peers={filteredPeers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFreeze={handleFreeze}
            onUnfreeze={handleUnfreeze}
            language={language}
          />
        </>
      ) : (
        <PeersEmpty language={language} />
      )}

      {/* Modals */}
      <PeersModal
        isOpen={showModal}
        title={
          shouldFreezeAfterSave
            ? t('freeze' as any)
            : shouldUnfreezeAfterSave
            ? t('unfreeze' as any)
            : editingPeer
            ? t('updateStudent' as any)
            : t('newStudent' as any)
        }
        username={formData.username}
        floor={formData.floor}
        room={formData.room}
        fullName={formData.fullName}
        note={formData.note}
        onUsernameChange={(value: string) => setFormData({ ...formData, username: value })}
        onFloorChange={(value: number) => setFormData({ ...formData, floor: value })}
        onRoomChange={(value: string) => setFormData({ ...formData, room: value })}
        onFullNameChange={(value: string) => setFormData({ ...formData, fullName: value })}
        onNoteChange={(value: string) => setFormData({ ...formData, note: value })}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
        usernameLabel={t('usernameLabel' as any)}
        floorLabel={t('floor' as any)}
        noteLabel={t('note' as any)}
        fullNameLabel={t('fullName' as any)}
        roomLabel={t('room' as any)}
        usernamePlaceholder={t('usernamePlaceholder' as any)}
        notePlaceholder={t('notePlaceholder' as any)}
        fullNamePlaceholder={t('fullNamePlaceholder' as any)}
        roomPlaceholder={t('roomPlaceholder' as any)}
        cancelLabel={t('cancel' as any)}
        saveLabel={t('save' as any)}
        isFreezingMode={shouldFreezeAfterSave}
        isUnfreezingMode={shouldUnfreezeAfterSave}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        peerName={peerToDelete?.username}
        isDeleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setPeerToDelete(null);
        }}
        language={language}
      />
    </div>
  );
}
