import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Home, Star, User, Wallet } from 'lucide-react';

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const fmtDate = (d) =>
  new Date(d)
    .toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\b(am|pm)\b/, (m) => m.toUpperCase());

export function Header({ title, back = true, right }) {
  const nav = useNavigate();
  return (
    <header className="hdr">
      {back ? <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={22} /></button> : <span style={{ width: 36 }} />}
      <h1>{title}</h1>
      <span style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{right}</span>
    </header>
  );
}

export function Avatar({ name = '?', size = 52 }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</div>;
}

export function Stars({ value, onChange, size = 38 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={`${n} star`} onClick={() => onChange(n)}>
          <Star size={size} fill={n <= value ? '#f5b301' : 'none'} color={n <= value ? '#f5b301' : '#c5ccc8'} />
        </button>
      ))}
    </div>
  );
}

export function BottomNav() {
  const items = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/rides', icon: Car, label: 'Rides' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];
  return (
    <nav className="bnav">
      {items.map(({ to, icon: I, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'on' : '')}>
          <I size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function DriverCard({ driver }) {
  if (!driver) return null;
  return (
    <div className="driver">
      <Avatar name={driver.name} size={56} />
      <div>
        <b>{driver.name}</b>
        <div className="mute"><Star size={14} fill="#f5b301" color="#f5b301" style={{ verticalAlign: -2 }} /> {driver.rating} ({driver.totalRides} rides)</div>
        <div className="mute small">{driver.vehicleName} - {driver.plate}</div>
      </div>
    </div>
  );
}
