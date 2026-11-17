import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ChooseRide from './pages/ChooseRide.jsx';
import { DriverFound, OnTheWay } from './pages/Trip.jsx';
import { Payment, Completed } from './pages/Payment.jsx';
import MyRides from './pages/MyRides.jsx';
import Profile from './pages/Profile.jsx';
import { Wallet, Addresses, Offers, Support } from './pages/Extras.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
const P = (el) => <Protected>{el}</Protected>;

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={P(<Home />)} />
        <Route path="/choose-ride" element={P(<ChooseRide />)} />
        <Route path="/driver-found/:id" element={P(<DriverFound />)} />
        <Route path="/on-the-way/:id" element={P(<OnTheWay />)} />
        <Route path="/payment/:id" element={P(<Payment />)} />
        <Route path="/completed/:id" element={P(<Completed />)} />
        <Route path="/rides" element={P(<MyRides />)} />
        <Route path="/profile" element={P(<Profile />)} />
        <Route path="/wallet" element={P(<Wallet />)} />
        <Route path="/addresses" element={P(<Addresses />)} />
        <Route path="/offers" element={P(<Offers />)} />
        <Route path="/support" element={P(<Support />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
