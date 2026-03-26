export interface Peer {
  id: number;
  username: string;
  floor: number;
  isFrozen: boolean;
  frozenReason?: string;
  note?: string;
}

export interface PeerFormData {
  username: string;
  floor: number;
  note: string;
}

export type FloorFilter = number | 'all';
