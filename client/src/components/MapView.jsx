import { useLayoutEffect, useRef, useState } from 'react';

const ROUTE = 'M90 235 C 140 205, 170 235, 215 175 S 290 125, 312 70';
const Pin = ({ x, y, color }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M0 0 C -10 -14 -12 -22 -12 -26 a12 12 0 1 1 24 0 C 12 -22 10 -14 0 0Z" fill={color} />
    <circle cy="-26" r="4.5" fill="#fff" />
  </g>
);
const CarIcon = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <rect x="-8" y="-15" width="16" height="30" rx="6" fill="#fff" stroke="#1d2a23" strokeWidth="2" />
    <rect x="-5" y="-8" width="10" height="8" rx="2" fill="#1d2a23" />
  </g>
);

// Simple stylised city map (koi API key ya internet nahi chahiye)
export default function MapView({ cars = [], pickup, drop, route, progress, height = 230 }) {
  const path = useRef(null);
  const [pt, setPt] = useState(null);

  useLayoutEffect(() => {
    if (!route || progress == null || !path.current) return;
    const len = path.current.getTotalLength();
    const p = path.current.getPointAtLength(len * Math.min(1, progress));
    const q = path.current.getPointAtLength(Math.min(len, len * Math.min(1, progress) + 2));
    setPt({ x: p.x, y: p.y, r: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90 });
  }, [route, progress]);

  return (
    <div className="map" style={{ height }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="400" height="300" fill="#eef1ee" />
        <ellipse cx="60" cy="60" rx="50" ry="34" fill="#d8ecd6" />
        <ellipse cx="340" cy="250" rx="60" ry="36" fill="#d8ecd6" />
        <rect x="250" y="130" width="70" height="40" rx="10" fill="#d8ecd6" />
        <path d="M-10 120 C 80 80, 140 170, 230 120 S 360 20, 420 60" stroke="#cfe3f1" strokeWidth="16" fill="none" />
        <g stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M0 200 L400 170" /><path d="M0 100 L400 120" /><path d="M120 0 L150 300" />
          <path d="M260 0 L240 300" /><path d="M0 280 L400 250" />
        </g>
        <g stroke="#f6e8ad" strokeWidth="5" fill="none"><path d="M0 40 L400 260" /></g>
        <g stroke="#fff" strokeWidth="3" fill="none"><path d="M50 0 L70 300" /><path d="M330 0 L350 300" /><path d="M0 150 L400 140" /></g>

        {route && (
          <>
            <path ref={path} d={ROUTE} stroke="#0B8F4D" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Pin x={312} y={70} color="#e5484d" />
            {progress == null && <Pin x={90} y={235} color="#0B8F4D" />}
            {progress != null && pt && <CarIcon x={pt.x} y={pt.y} r={pt.r} />}
          </>
        )}
        {!route && pickup && (
          <>
            <Pin x={200} y={150} color="#0B8F4D" />
            <circle cx="200" cy="162" r="7" fill="#2f7df6" stroke="#fff" strokeWidth="3" />
          </>
        )}
        {cars.map((c, i) => <CarIcon key={i} {...c} />)}
      </svg>
    </div>
  );
}
