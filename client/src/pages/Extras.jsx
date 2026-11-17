import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import api, { errMsg } from '../api';
import { BottomNav, Header, inr } from '../components/ui.jsx';
import { useToast } from '../context/Toast.jsx';

export function Wallet() {
  const toast = useToast();
  const [bal, setBal] = useState(0);
  useEffect(() => { api.get('/user/wallet').then((r) => setBal(r.data.balance)); }, []);
  const add = async (amount) => {
    try { const { data } = await api.post('/user/wallet/add', { amount }); setBal(data.balance); toast(`${inr(amount)} wallet me add ho gaye`); }
    catch (e) { toast(errMsg(e)); }
  };
  return (
    <div className="page">
      <Header title="Wallet" back={false} />
      <div className="fare-box"><span className="mute">Wallet Balance</span><div className="fare">{inr(bal)}</div></div>
      <div className="pad grow">
        <h4 className="sec">Paise add karo</h4>
        <div className="amts">{[100, 200, 500, 1000].map((a) => <button key={a} onClick={() => add(a)}>+ {inr(a)}</button>)}</div>
        <p className="mute small">Demo app hai, isliye paise seedhe add ho jaate hain. Real payment gateway (Razorpay) baad me jod sakte ho.</p>
      </div>
      <BottomNav />
    </div>
  );
}

export function Addresses() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [label, setLabel] = useState('Home');
  const [name, setName] = useState('');
  useEffect(() => { api.get('/user/addresses').then((r) => setList(r.data.addresses)); }, []);
  const add = async () => {
    try { const { data } = await api.post('/user/addresses', { label, name }); setList(data.addresses); setName(''); }
    catch (e) { toast(errMsg(e)); }
  };
  const del = async (id) => { const { data } = await api.delete(`/user/addresses/${id}`); setList(data.addresses); };
  return (
    <div className="page">
      <Header title="Saved Addresses" />
      <div className="pad grow">
        {list.map((a) => (
          <div className="menu-row static" key={a._id}><b>{a.label}</b><span className="mute">{a.name}</span><button className="icon-btn" aria-label="Delete" onClick={() => del(a._id)}><Trash2 size={18} /></button></div>
        ))}
        {!list.length && <p className="empty">Koi address save nahi hai.</p>}
        <h4 className="sec">Naya address</h4>
        <div className="amts">{['Home', 'Work', 'Other'].map((l) => <button key={l} className={label === l ? 'on' : ''} onClick={() => setLabel(l)}>{l}</button>)}</div>
        <input className="search" placeholder="Address / area ka naam" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn" disabled={!name.trim()} onClick={add}>Save address</button>
      </div>
    </div>
  );
}

export function Offers() {
  const toast = useToast();
  const [offers, setOffers] = useState([]);
  useEffect(() => { api.get('/user/offers').then((r) => setOffers(r.data.offers)); }, []);
  return (
    <div className="page">
      <Header title="Offers" />
      <div className="pad grow">
        {offers.map((o) => (
          <div className="offer" key={o.code}>
            <div><b>{o.title}</b><div className="mute small">{o.desc}</div></div>
            <button onClick={() => { navigator.clipboard?.writeText(o.code); toast(`${o.code} copy ho gaya`); }}>{o.code}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Support() {
  const faqs = [
    ['Ride cancel kaise karu?', 'Driver Found screen par "Cancel Ride" dabao. Driver ke aane ke baad cancel nahi hoti.'],
    ['Fare kaise tay hota hai?', 'Base fare + per km charge. Final fare ride ke baad dikhta hai.'],
    ['Payment fail ho gaya?', 'Dusra payment method chuno ya Cash select karo.'],
  ];
  return (
    <div className="page">
      <Header title="Help & Support" />
      <div className="pad grow">
        {faqs.map(([q, a]) => <div className="faq" key={q}><b>{q}</b><p className="mute">{a}</p></div>)}
        <a className="btn ghost" href="tel:1800123456"><Phone size={18} /> Call support</a>
        <a className="btn ghost" href="mailto:support@ridekaro.app"><Mail size={18} /> Email support</a>
      </div>
    </div>
  );
}
