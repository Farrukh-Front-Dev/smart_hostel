import { useState } from 'react';
import { Peer, PeerFormData } from '../types';

const initialFormData: PeerFormData = {
  username: '',
  floor: 1,
  room: '',
  fullName: '',
  note: '',
};

export const usePeerForm = () => {
  const [formData, setFormData] = useState<PeerFormData>(initialFormData);
  const [editingPeer, setEditingPeer] = useState<Peer | null>(null);
  const [shouldFreezeAfterSave, setShouldFreezeAfterSave] = useState(false);
  const [shouldUnfreezeAfterSave, setShouldUnfreezeAfterSave] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPeer(null);
    setShouldFreezeAfterSave(false);
    setShouldUnfreezeAfterSave(false);
  };

  const loadPeerForEdit = (peer: Peer) => {
    setEditingPeer(peer);
    setFormData({
      username: peer.username,
      floor: peer.floor,
      room: peer.room || '',
      fullName: peer.fullName || '',
      note: peer.note || '',
    });
  };

  const loadPeerForFreeze = (peer: Peer) => {
    setEditingPeer(peer);
    setShouldFreezeAfterSave(true);
    setFormData({
      username: peer.username,
      floor: peer.floor,
      room: peer.room || '',
      fullName: peer.fullName || '',
      note: peer.note || '',
    });
  };

  const loadPeerForUnfreeze = (peer: Peer) => {
    setEditingPeer(peer);
    setShouldUnfreezeAfterSave(true);
    setFormData({
      username: peer.username,
      floor: peer.floor,
      room: peer.room || '',
      fullName: peer.fullName || '',
      note: peer.note || '',
    });
  };

  return {
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
  };
};
