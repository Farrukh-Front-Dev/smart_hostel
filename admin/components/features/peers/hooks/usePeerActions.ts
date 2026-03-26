import { peerAPI } from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import { Peer, PeerFormData } from '../types';

export const usePeerActions = (onSuccess: () => void) => {
  const { addToast } = useToast();

  const createPeer = async (data: PeerFormData) => {
    try {
      await peerAPI.create(data);
      addToast('Peer muvaffaqiyatli qo\'shildi', 'success');
      onSuccess();
    } catch (error) {
      addToast('Saqlashda xatolik yuz berdi', 'error');
      throw error;
    }
  };

  const updatePeer = async (id: number, data: PeerFormData) => {
    try {
      await peerAPI.update(id, data);
      addToast('Peer muvaffaqiyatli yangilandi', 'success');
      onSuccess();
    } catch (error) {
      addToast('Saqlashda xatolik yuz berdi', 'error');
      throw error;
    }
  };

  const freezePeer = async (id: number, reason: string) => {
    try {
      await peerAPI.freeze(id, reason);
      addToast('Peer muvaffaqiyatli muzlatildi', 'success');
      onSuccess();
    } catch (error) {
      addToast('Muzlatishda xatolik yuz berdi', 'error');
      throw error;
    }
  };

  const unfreezePeer = async (id: number) => {
    try {
      await peerAPI.unfreeze(id);
      addToast('Peer muvaffaqiyatli faollashtirild', 'success');
      onSuccess();
    } catch (error) {
      addToast('Muzlatishni bekor qilishda xatolik yuz berdi', 'error');
      throw error;
    }
  };

  const deletePeer = async (id: number) => {
    try {
      await peerAPI.delete(id);
      addToast('Peer muvaffaqiyatli o\'chirildi', 'success');
      onSuccess();
    } catch (error) {
      addToast('O\'chirishda xatolik yuz berdi', 'error');
      throw error;
    }
  };

  return {
    createPeer,
    updatePeer,
    freezePeer,
    unfreezePeer,
    deletePeer,
  };
};
