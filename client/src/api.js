import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem('rk_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export const errMsg = (e) => e?.response?.data?.message || 'Kuch gadbad ho gayi, dobara try karo';
export default api;
