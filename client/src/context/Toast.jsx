import { createContext, useCallback, useContext, useState } from 'react';
const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const show = useCallback((m) => { setMsg(m); setTimeout(() => setMsg(''), 2400); }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      {msg && <div className="toast" role="status">{msg}</div>}
    </Ctx.Provider>
  );
}
