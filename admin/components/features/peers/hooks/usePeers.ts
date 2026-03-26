import { useState, useEffect } from 'react';
import { peerAPI } from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import { Peer } from '../types';

export const usePeers = () => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchPeers = async () => {
    try {
      setLoading(true);
      const response = await peerAPI.getAll();
      setPeers(response.data);
    } catch (error) {
      console.error('Error fetching peers:', error);
      addToast('Peerlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeers();
  }, []);

  return { peers, loading, fetchPeers, setPeers };
};
