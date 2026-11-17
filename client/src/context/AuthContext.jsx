import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('rk_token'));

  useEffect(() => {
    if (!localStorage.getItem('rk_token')) return;
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem('rk_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, u) => { localStorage.setItem('rk_token', token); setUser(u); };
  const logout = () => { localStorage.removeItem('rk_token'); setUser(null); };

  return <Ctx.Provider value={{ user, setUser, login, logout, loading }}>{children}</Ctx.Provider>;
}
