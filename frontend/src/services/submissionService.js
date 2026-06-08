import { api } from './api';

const toFormData = (payload, file) => {
  const data = new FormData();
  data.append('metadata', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (file) data.append('file', file);
  return data;
};

export const submissionService = {
  save: (id, payload, file) => api.post(`/teams/${id}/submission`, toFormData(payload, file), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, payload, file) => api.put(`/teams/${id}/submission`, toFormData(payload, file), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/teams/${id}/submission`),
  get: (id) => api.get(`/teams/${id}/submission`),
  download: (id) => api.get(`/teams/${id}/submission/download`, { responseType: 'blob' })
};
