import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Briefcase, Crosshair, Home as HomeIcon, Menu, MoreHorizontal, Plane, ChevronRight } from 'lucide-react';
import api from '../api';
import { MY_LOCATION } from '../constants';
import MapView from '../components/MapView.jsx';
import { useToast } from '../context/Toast.jsx';
import { Logo } from './Splash.jsx';

export function PlacePicker({ title, onPick, onClose, saved = [], withMyLocation }) {
  const [places, setPlaces] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => { api.get('/rides/places').then((r) => setPlaces(r.data.places)); }, []);
  const all = [...(withMyLocation ? [MY_LOCATION] : []), ...saved.map((a) => ({ ...a, name: a.name, tag: a.label })), ...places];
  const list = all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <input className="search" autoFocus placeholder="Jagah dhundo" value={q} onChange={(e) => setQ(e.target.value)} />
        {list.map((p, i) => (
          <button key={i} className="place" onClick={() => onPick(p)}>
            <span>{p.name}{p.tag && <em> ({p.tag})</em>}</span><ChevronRight size={18} />
          </button>
        ))}
        {!list.length && <p className="mute">Koi jagah nahi mili.</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const nav = useNavigate();
  const toast = useToast();
  const [pickup, setPickup] = useState(MY_LOCATION);
  const [picker, setPicker] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    api.get('/rides/active').then(({ data }) => {
      const r = data.ride;
      if (r) nav(r.status === 'on_the_way' ? `/on-the-way/${r._id}` : `/driver-found/${r._id}`, { replace: true });
    });
    api.get('/user/addresses').then((r) => setSaved(r.data.addresses));
  }, [nav]);

  const goDrop = (drop) => nav('/choose-ride', { state: { pickup, drop } });
  const quick = (label) => {
    const a = saved.find((s) => s.label === label);
    if (a) return goDrop(a);
    toast(`Pehle ${label} address save karo`);
    nav('/addresses');
  };
  const airport = () => goDrop({ name: 'Airport', lat: 26.7606, lng: 80.8893 });

  const chips = [
    { icon: HomeIcon, label: 'Home', fn: () => quick('Home') },
    { icon: Briefcase, label: 'Work', fn: () => quick('Work') },
    { icon: Plane, label: 'Airport', fn: airport },
    { icon: MoreHorizontal, label: 'More', fn: () => nav('/addresses') },
  ];

  return (
    <div className="page">
      <header className="hdr">
        <button className="icon-btn" aria-label="Menu" onClick={() => nav('/profile')}><Menu size={22} /></button>
        <Logo size={24} />
        <button className="icon-btn" aria-label="Notifications" onClick={() => toast('Koi nayi notification nahi')}><Bell size={22} /></button>
      </header>
      <MapView pickup height={300} cars={[{ x: 120, y: 70, r: 35 }, { x: 70, y: 175, r: -40 }, { x: 305, y: 150, r: 20 }, { x: 330, y: 215, r: 70 }]} />
      <div className="sheet up">
        <button className="loc-row" onClick={() => setPicker('pickup')}>
          <i className="dot g" />
          <div><small>Pickup Location</small><b>{pickup.name}</b></div>
          <span className="icon-btn" onClick={(e) => { e.stopPropagation(); setPickup(MY_LOCATION); toast('Location detect ho gayi'); }}><Crosshair size={20} /></span>
        </button>
        <button className="loc-row alt" onClick={() => setPicker('drop')}>
          <i className="dot r" />
          <div><small>Drop Location</small><b className="mute">Where to?</b></div>
          <ChevronRight size={18} color="#8a968f" />
        </button>
        <div className="chips">
          {chips.map(({ icon: I, label, fn }) => (
            <button key={label} onClick={fn}><I size={22} color="#0B8F4D" /><span>{label}</span></button>
          ))}
        </div>
      </div>
      {picker && (
        <PlacePicker
          title={picker === 'drop' ? 'Kahan jaana hai?' : 'Pickup location'}
          withMyLocation={picker === 'pickup'}
          saved={saved}
          onClose={() => setPicker(null)}
          onPick={(p) => { picker === 'drop' ? goDrop(p) : setPickup(p); setPicker(null); }}
        />
      )}
    </div>
  );
}
