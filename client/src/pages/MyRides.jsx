import { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import api from '../api';
import { VEH } from '../constants';
import { BottomNav, Header, fmtDate, inr } from '../components/ui.jsx';

export default function MyRides() {
  const [tab, setTab] = useState('completed');
  const [rides, setRides] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setRides(null); setOpen(null);
    api.get('/rides', { params: { status: tab } }).then((r) => setRides(r.data.rides));
  }, [tab]);

  return (
    <div className="page">
      <Header title="My Rides" />
      <div className="tabs">
        {['completed', 'cancelled'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="grow list">
        {rides?.map((r) => (
          <div key={r._id}>
            <button className="ride-row" onClick={() => setOpen(open === r._id ? null : r._id)}>
              <div>
                <b>{r.pickup.name} <ArrowRight size={14} style={{ verticalAlign: -2 }} /> {r.drop.name}</b>
                <div className="mute small">{fmtDate(r.createdAt)}</div>
              </div>
              <b>{inr(r.fare)}</b>
              <ChevronRight size={18} className={open === r._id ? 'rot' : ''} />
            </button>
            {open === r._id && (
              <div className="details pad-x">
                <div><span>Vehicle</span><b>{VEH[r.vehicleType]?.label}</b></div>
                <div><span>Distance</span><b>{r.distanceKm} km</b></div>
                {r.driver && <div><span>Driver</span><b>{r.driver.name} ({r.driver.plate})</b></div>}
                {r.paymentMethod && <div><span>Paid by</span><b style={{ textTransform: 'uppercase' }}>{r.paymentMethod}</b></div>}
                {r.rating && <div><span>Your rating</span><b>{r.rating} / 5</b></div>}
              </div>
            )}
          </div>
        ))}
        {rides && !rides.length && <p className="empty">Abhi koi {tab} ride nahi hai. Home se pehli ride book karo.</p>}
      </div>
      <BottomNav />
    </div>
  );
}
