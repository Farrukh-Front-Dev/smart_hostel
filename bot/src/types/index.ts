export interface PaymentData {
  school21Nick?: string;
  fullName?: string;
  room?: string;
  month?: string;
  studentId?: number;
  fileId?: string;
  fileType?: 'photo' | 'document';
  messageIds?: number[];
}

export interface UserState {
  step: string;
  data: PaymentData;
}

export interface Student {
  id: number;
  username: string;
  fullName?: string;
  room?: string;
  floor: number;
  isFrozen: boolean;
}

export interface DutyResponse {
  byFloor: {
    [floor: string]: Array<{
      username: string;
      name: string;
    }>;
  };
}
