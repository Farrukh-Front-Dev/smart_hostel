export interface Peer {
  id: number;
  username: string;
  floor: number;
  room?: string;
  fullName?: string;
  note?: string;
  isFrozen: boolean;
  frozenReason?: string;
}

export interface PeerFormData {
  username: string;
  floor: number;
  room: string;
  fullName: string;
  note: string;
}

export type FloorFilter = number | 'all';
export type StatusFilter = 'all' | 'active' | 'frozen' | null;
