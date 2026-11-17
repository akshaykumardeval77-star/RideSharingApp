import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, MessageCircle, Phone, Share2, ShieldCheck } from 'lucide-react';
import api, { errMsg } from '../api';
import { VEH } from '../constants';
import MapView from '../components/MapView.jsx';
import { DriverCard, Header } from '../components/ui.jsx';
import { useToast } from '../context/Toast.jsx';

function useRide(id) {
  const [ride, setRide] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    api.get(`/rides/${id}`).then((r) => setRide(r.data.ride)).catch(() => nav('/home', { replace: true }));
  }, [id, nav]);
  return ride;
}

function Actions({ ride, danger }) {
  const toast = useToast();
  const share = async () => {
    const text = `Meri RideKaro ride: ${ride.pickup.name} se ${ride.drop.name}. Driver ${ride.driver?.name}, ${ride.driver?.plate}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast('Ride details copy ho gayi'); }
    } catch { /* user ne cancel kiya */ }
  };
  const Btn = ({ icon: I, label, onClick, href, cls }) => {
    const inner = <><I size={20} /><span>{label}</span></>;
    return href ? <a className={'act ' + (cls || '')} href={href}>{inner}</a> : <button className={'act ' + (cls || '')} onClick={onClick}>{inner}</button>;
  };
  return (
    <div className="acts">
      <Btn icon={Phone} label="Call" href={`tel:${ride.driver?.phone}`} />
      <Btn icon={MessageCircle} label="Chat" onClick={() => toast('Chat feature jald aa raha hai')} />
      <Btn icon={Share2} label="Share" onClick={share} />
      {danger
        ? <Btn icon={AlertTriangle} label="Emergency" href="tel:112" cls="danger" />
        : <Btn icon={ShieldCheck} label="Safety" onClick={() => toast('Ride share karo ya 112 par call karo')} />}
    </div>
  );
}

export function DriverFound() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const ride = useRide(id);
  const [min, setMin] = useState(null);
  const started = useRef(false);

  // Demo simulation: driver har 2.5 sec me 1 min nazdeek aata hai
  useEffect(() => {
    if (!ride) return;
    if (ride.status === 'on_the_way') return nav(`/on-the-way/${id}`, { replace: true });
    if (ride.status !== 'driver_found') return nav('/home', { replace: true });
    setMin(VEH[ride.vehicleType].eta);
  }, [ride, id, nav]);

  useEffect(() => {
    if (min == null) return;
    if (min <= 0) {
      if (started.current) return;
      started.current = true;
      api.patch(`/rides/${id}/status`, { status: 'on_the_way' }).finally(() => nav(`/on-the-way/${id}`, { replace: true }));
      return;
    }
    const t = setTimeout(() => setMin((m) => m - 1), 2500);
    return () => clearTimeout(t);
  }, [min, id, nav]);

  const cancel = async () => {
    if (!window.confirm('Ride cancel karni hai?')) return;
    try { await api.post(`/rides/${id}/cancel`); toast('Ride cancel ho gayi'); nav('/home', { replace: true }); }
    catch (e) { toast(errMsg(e)); }
  };

  return (
    <div className="page">
      <Header title="Driver Found" />
      <div className="map-wrap">
        <MapView pickup height={230} cars={[{ x: 110, y: 90, r: 45 }, { x: 300, y: 215, r: -30 }]} />
        <div className="eta-tag">Arriving in<br /><b>{min ?? '-'} min</b></div>
      </div>
      {ride && (
        <div className="sheet up grow">
          <DriverCard driver={ride.driver} />
          <Actions ride={ride} />
          <button className="btn cancel" onClick={cancel}>Cancel Ride</button>
        </div>
      )}
    </div>
  );
}

const TRIP_MS = 14000;
export function OnTheWay() {
  const { id } = useParams();
  const nav = useNavigate();
  const ride = useRide(id);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!ride) return;
    if (ride.status === 'completed') return nav(`/payment/${id}`, { replace: true });
    if (ride.status !== 'on_the_way') return nav('/home', { replace: true });
    const start = Date.now();
    const iv = setInterval(() => {
      const v = Math.min(1, (Date.now() - start) / TRIP_MS);
      setP(v);
      if (v >= 1) {
        clearInterval(iv);
        api.patch(`/rides/${id}/status`, { status: 'completed' }).finally(() => nav(`/payment/${id}`, { replace: true }));
      }
    }, 100);
    return () => clearInterval(iv);
  }, [ride, id, nav]);

  const left = ride ? Math.max(0, Math.ceil(ride.durationMin * (1 - p))) : 0;
  const kmLeft = ride ? Math.max(0, +(ride.distanceKm * (1 - p)).toFixed(1)) : 0;

  return (
    <div className="page">
      <Header title="On the way" />
      <MapView route progress={p} height={260} />
      {ride && (
        <div className="sheet up grow">
          <DriverCard driver={ride.driver} />
          <div className="dest">
            <i className="dot g" />
            <div>
              <small className="mute">Your Destination</small>
              <b>{ride.drop.name}</b>
              <div className="g-text">{left} min ({kmLeft} km)</div>
            </div>
          </div>
          <Actions ride={ride} danger />
        </div>
      )}
    </div>
  );
}
