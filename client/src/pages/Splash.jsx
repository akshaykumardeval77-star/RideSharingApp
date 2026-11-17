import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Logo({ size = 44 }) {
  return (
    <div className="logo-word" style={{ fontSize: size }}>
      Ride<span>Karo</span>
    </div>
  );
}

export default function Splash() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => nav(user ? '/home' : '/login', { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [loading, user, nav]);

  return (
    <div className="splash">
      <div className="splash-top">
        <div className="logo-badge"><Car size={44} color="#fff" strokeWidth={2.2} /></div>
        <Logo />
        <p className="mute">Your Ride, Your City</p>
      </div>
      <svg viewBox="0 0 360 220" className="skyline" aria-hidden="true">
        <g fill="#cfe8d8">
          <rect x="90" y="70" width="36" height="110" /><rect x="132" y="40" width="30" height="140" />
          <rect x="168" y="85" width="40" height="95" /><rect x="214" y="55" width="30" height="125" />
          <rect x="250" y="95" width="36" height="85" />
        </g>
        <g fill="#2e9e5b">
          <rect x="28" y="120" width="8" height="60" /><ellipse cx="32" cy="105" rx="26" ry="38" />
          <rect x="326" y="130" width="8" height="50" /><ellipse cx="330" cy="118" rx="22" ry="32" />
        </g>
        <rect y="178" width="360" height="42" fill="#e7f5ed" />
        <g>
          <path d="M70 190 Q72 170 98 166 L122 148 Q132 142 148 142 L200 142 Q214 142 224 152 L244 166 Q272 170 276 190 L276 198 Q276 204 270 204 L76 204 Q70 204 70 198Z" fill="#2e9e5b" />
          <path d="M128 152 L150 148 L150 166 L112 166Z M158 148 L198 148 Q206 150 212 158 L222 166 L158 166Z" fill="#dff3e6" />
          <circle cx="112" cy="204" r="17" fill="#1d2a23" /><circle cx="112" cy="204" r="7" fill="#cfd8d3" />
          <circle cx="236" cy="204" r="17" fill="#1d2a23" /><circle cx="236" cy="204" r="7" fill="#cfd8d3" />
        </g>
      </svg>
    </div>
  );
}
