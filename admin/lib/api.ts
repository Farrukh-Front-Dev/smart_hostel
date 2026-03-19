import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students
export const studentAPI = {
  getAll: (floor?: number) => api.get('/api/students', { params: { floor } }),
  getById: (id: number) => api.get(`/api/students/${id}`),
  create: (data: any) => api.post('/api/students', data),
  update: (id: number, data: any) => api.put(`/api/students/${id}`, data),
  freeze: (id: number, reason: string) => api.post(`/api/students/${id}/freeze`, { reason }),
  unfreeze: (id: number) => api.post(`/api/students/${id}/unfreeze`),
  delete: (id: number) => api.delete(`/api/students/${id}`),
};

// Duties
export const dutyAPI = {
  getToday: () => api.get('/api/duties/today'),
  getTomorrow: () => api.get('/api/duties/tomorrow'),
  getByDate: (date: string) => api.get(`/api/duties/date/${date}`),
  getRange: (startDate: string, endDate: string) =>
    api.get('/api/duties/range', { params: { startDate, endDate } }),
  generate: (date: string) => api.post(`/api/duties/generate/${date}`),
};

// Reports
export const reportAPI = {
  getToday: () => api.get('/api/reports/today'),
  getPending: () => api.get('/api/reports/pending'),
  getByDate: (date: string) => api.get(`/api/reports/date/${date}`),
  getByStudent: (studentId: number) => api.get(`/api/reports/student/${studentId}`),
  getById: (id: number) => api.get(`/api/reports/${id}`),
  create: (data: any) => api.post('/api/reports', data),
  approve: (id: number) => api.post(`/api/reports/${id}/approve`),
  reject: (id: number, notes?: string) => api.post(`/api/reports/${id}/reject`, { notes }),
};
