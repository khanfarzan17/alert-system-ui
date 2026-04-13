import api from './api';

export const getEmailConfig = () => api.get('/email-config/get');
export const saveEmailConfig = (data) => api.post('/email-config/save', data);