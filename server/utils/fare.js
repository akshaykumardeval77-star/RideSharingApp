const VEHICLES = {
  bike: { label: 'Bike', base: 20, perKm: 8, speed: 30, eta: 2 },
  auto: { label: 'Auto', base: 30, perKm: 12, speed: 25, eta: 3 },
  mini: { label: 'Mini Car', base: 50, perKm: 16, speed: 28, eta: 4 },
  suv: { label: 'SUV', base: 80, perKm: 24, speed: 28, eta: 6 },
};
function haversine(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
// road distance ~ 1.3x seedhi doori
function distanceKm(a, b) { return Math.max(1, +(haversine(a, b) * 1.3).toFixed(1)); }
function fareFor(type, km) {
  const v = VEHICLES[type];
  return Math.round(v.base + v.perKm * km);
}
function options(km) {
  return Object.entries(VEHICLES).map(([type, v]) => {
    const f = fareFor(type, km);
    return { type, label: v.label, etaAway: v.eta, min: f, max: Math.round(f * 1.3), durationMin: Math.max(5, Math.round((km / v.speed) * 60)) };
  });
}
module.exports = { VEHICLES, distanceKm, fareFor, options };
