import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/Toast.jsx';

const Google = () => (
  <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
);
const Apple = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
);

export default function Login() {
  const nav = useNavigate();
  const toast = useToast();
  const { user, login } = useAuth();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/home" replace />;

  const run = async (fn) => {
    setBusy(true);
    try { await fn(); } catch (e) { toast(errMsg(e)); } finally { setBusy(false); }
  };
  const sendOtp = () => run(async () => {
    const { data } = await api.post('/auth/send-otp', { phone });
    setHint(data.devOtp); setStep('otp');
  });
  const verify = () => run(async () => {
    const { data } = await api.post('/auth/verify-otp', { phone, otp });
    login(data.token, data.user); nav('/home', { replace: true });
  });
  const social = (provider) => run(async () => {
    const { data } = await api.post('/auth/social', { provider });
    login(data.token, data.user); nav('/home', { replace: true });
  });

  return (
    <div className="page pad">
      {step === 'otp' && <button className="icon-btn" aria-label="Back" onClick={() => setStep('phone')}><ArrowLeft size={22} /></button>}
      <div style={{ marginTop: step === 'otp' ? 8 : 44 }}>
        <h2 className="welcome">Welcome to<br /><span className="logo-word big">Ride<span>Karo</span></span></h2>
        <p className="mute">{step === 'phone' ? 'Enter your mobile number to continue' : `OTP bheja gaya +91 ${phone}`}</p>
      </div>

      {step === 'phone' ? (
        <>
          <div className="phone-box">
            <div className="cc"><span className="flag" /> +91</div>
            <input inputMode="numeric" maxLength={10} placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
          </div>
          <button className="btn" disabled={phone.length !== 10 || busy} onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input className="otp" inputMode="numeric" maxLength={6} placeholder="------" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
          {hint && <p className="mute small" style={{ textAlign: 'center' }}>Dev mode OTP: <b>{hint}</b></p>}
          <button className="btn" disabled={otp.length !== 6 || busy} onClick={verify}>Verify and continue</button>
        </>
      )}

      <div className="or"><span>or continue with</span></div>
      <button className="btn ghost" onClick={() => social('google')} disabled={busy}><Google /> Continue with Google</button>
      <button className="btn ghost" onClick={() => social('apple')} disabled={busy}><Apple /> Continue with Apple</button>

      <p className="mute small terms">By continuing, you agree to our<br /><b>Terms of Service</b> and <b>Privacy Policy</b>.</p>
    </div>
  );
}
