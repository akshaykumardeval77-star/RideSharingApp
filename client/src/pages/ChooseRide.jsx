import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { VEH } from '../constants';
import MapView from '../components/MapView.jsx';
import { Header, inr } from '../components/ui.jsx';
import { useToast } from '../context/Toast.jsx';

export default function ChooseRide() {
  const { state } = useLocation();
  const nav = useNavigate();
  const toast = useToast();
  const [opts, setOpts] = useState([]);
  const [km, setKm] = useState(0);
  const [sel, setSel] = useState('bike');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!state) return;
    api.post('/rides/estimate', { pickup: state.pickup, drop: state.drop })
      .then(({ data }) => { setOpts(data.options); setKm(data.distanceKm); })
      .catch((e) => toast(errMsg(e)));
  }, [state, toast]);

  if (!state) return <Navigate to="/home" replace />;

  const book = async () => {
    setBusy(true);
    try {
      const { data } = await api.post('/rides', { pickup: state.pickup, drop: state.drop, vehicleType: sel });
      nav(`/driver-found/${data.ride._id}`, { replace: true });
    } catch (e) {
      toast(errMsg(e));
      if (e.response?.data?.rideId) nav(`/driver-found/${e.response.data.rideId}`);
    } finally { setBusy(false); }
  };

  return (
    <div className="page">
      <Header title="Choose a Ride" />
      <MapView route height={170} />
      <div className="route-info mute small">{state.pickup.name} to {state.drop.name} - {km} km</div>
      <div className="pad-x grow">
        {opts.map((o) => (
          <button key={o.type} className={'opt' + (sel === o.type ? ' on' : '')} onClick={() => setSel(o.type)}>
            <span className="vicon">{VEH[o.type].icon}</span>
            <div><b>{o.label}</b><div className="mute small">{o.etaAway} min away</div></div>
            <b className="price">{inr(o.min)} - {o.max}</b>
          </button>
        ))}
      </div>
      <div className="pad"><button className="btn" onClick={book} disabled={busy || !opts.length}>Book Ride</button></div>
    </div>
  );
}
