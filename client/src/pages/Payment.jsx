import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Banknote, Check, ChevronDown, ChevronUp, CreditCard, Smartphone, Wallet } from 'lucide-react';
import api, { errMsg } from '../api';
import { Avatar, Header, Stars, fmtDate, inr } from '../components/ui.jsx';
import { useToast } from '../context/Toast.jsx';

export function Payment() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [ride, setRide] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [method, setMethod] = useState('upi');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/rides/${id}`).then((r) => {
      if (r.data.ride.paymentStatus === 'paid') nav(`/completed/${id}`, { replace: true });
      else setRide(r.data.ride);
    }).catch(() => nav('/home', { replace: true }));
    api.get('/user/wallet').then((r) => setWallet(r.data.balance));
  }, [id, nav]);

  const methods = [
    { key: 'upi', icon: Smartphone, label: 'UPI (GPay, PhonePe, etc.)' },
    { key: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
    { key: 'wallet', icon: Wallet, label: `Wallet (${inr(wallet)})` },
    { key: 'cash', icon: Banknote, label: 'Cash' },
  ];

  const pay = async () => {
    setBusy(true);
    try { await api.post(`/rides/${id}/pay`, { method }); nav(`/completed/${id}`, { replace: true }); }
    catch (e) { toast(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="page">
      <Header title="Payment" back={false} />
      <div className="fare-box">
        <span className="mute">Fare Amount</span>
        <div className="fare">{inr(ride?.fare)}</div>
      </div>
      <div className="pad-x grow">
        <h4 className="sec">Select Payment Method</h4>
        {methods.map(({ key, icon: I, label }) => (
          <button key={key} className={'pm' + (method === key ? ' on' : '')} onClick={() => setMethod(key)}>
            <span className="radio">{method === key && <i />}</span>
            <I size={20} color="#0B8F4D" /> <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="pad"><button className="btn" disabled={busy || !ride} onClick={pay}>Pay Now</button></div>
    </div>
  );
}

export function Completed() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [ride, setRide] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => { api.get(`/rides/${id}`).then((r) => setRide(r.data.ride)).catch(() => nav('/home', { replace: true })); }, [id, nav]);

  const submit = async () => {
    try { if (rating) await api.post(`/rides/${id}/rate`, { rating }); toast('Shukriya! Rating mil gayi'); nav('/home', { replace: true }); }
    catch (e) { toast(errMsg(e)); }
  };

  return (
    <div className="page pad done">
      <div className="check"><Check size={44} color="#fff" strokeWidth={3} /></div>
      <h2>Ride Completed!</h2>
      <p className="mute">Thank you for riding with RideKaro</p>
      <div className="total">
        <span>Total Fare</span>
        <div className="fare">{inr(ride?.fare)}</div>
        <button className="link" onClick={() => setOpen(!open)}>View Details {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        {open && ride && (
          <div className="details">
            <div><span>From</span><b>{ride.pickup.name}</b></div>
            <div><span>To</span><b>{ride.drop.name}</b></div>
            <div><span>Distance</span><b>{ride.distanceKm} km</b></div>
            <div><span>Date</span><b>{fmtDate(ride.createdAt)}</b></div>
            <div><span>Paid by</span><b style={{ textTransform: 'uppercase' }}>{ride.paymentMethod}</b></div>
          </div>
        )}
      </div>
      {ride?.driver && <div className="rate-driver"><Avatar name={ride.driver.name} size={44} /><b>{ride.driver.name}</b></div>}
      <h4 className="sec">Rate Your Driver</h4>
      <Stars value={rating} onChange={setRating} />
      <div className="grow" />
      <button className="btn" onClick={submit}>{rating ? 'Submit Rating' : 'Skip'}</button>
    </div>
  );
}
