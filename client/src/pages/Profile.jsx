import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ChevronRight, CircleHelp, CreditCard, LogOut, MapPin, Settings, Tag } from 'lucide-react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/Toast.jsx';
import { Avatar, BottomNav } from '../components/ui.jsx';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');

  const items = [
    { icon: Car, label: 'My Rides', to: '/rides' },
    { icon: CreditCard, label: 'Payment Methods', to: '/wallet' },
    { icon: MapPin, label: 'Saved Addresses', to: '/addresses' },
    { icon: Tag, label: 'Offers', to: '/offers' },
    { icon: CircleHelp, label: 'Help & Support', to: '/support' },
    { icon: LogOut, label: 'Logout', fn: () => { logout(); nav('/login', { replace: true }); } },
  ];

  const save = async () => {
    try { const { data } = await api.put('/auth/me', { name, email }); setUser(data.user); setEdit(false); toast('Profile update ho gayi'); }
    catch (e) { toast(errMsg(e)); }
  };

  return (
    <div className="page">
      <header className="hdr left"><h1>Profile</h1><button className="icon-btn" aria-label="Edit profile" onClick={() => setEdit(true)}><Settings size={22} /></button></header>
      <button className="prof-card" onClick={() => setEdit(true)}>
        <Avatar name={user.name} size={64} />
        <div>
          <b>{user.name}</b>
          {user.phone && <div className="mute small">+91 {user.phone}</div>}
          {user.email && <div className="mute small">{user.email}</div>}
        </div>
        <ChevronRight size={18} />
      </button>
      <div className="grow">
        {items.map(({ icon: I, label, to, fn }) => (
          <button key={label} className="menu-row" onClick={fn || (() => nav(to))}>
            <I size={20} /><span>{label}</span><ChevronRight size={18} />
          </button>
        ))}
      </div>
      <BottomNav />
      {edit && (
        <div className="modal" onClick={() => setEdit(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Profile edit karo</h3>
            <input className="search" placeholder="Naam" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="search" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn" onClick={save}>Save changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
