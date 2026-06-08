import { api } from './api';

export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const exportService = {
  pdf: (id) => api.get(`/hackathons/${id}/export/pdf`, { responseType: 'blob' }),
  excel: (id) => api.get(`/hackathons/${id}/export/excel`, { responseType: 'blob' })
};
