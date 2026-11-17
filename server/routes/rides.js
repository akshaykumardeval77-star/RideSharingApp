const router = require('express').Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const { distanceKm, options, fareFor, VEHICLES } = require('../utils/fare');

router.use(auth);
const populate = (q) => q.populate('driver');
const LIVE = ['driver_found', 'on_the_way'];

// Popular jagah (Lucknow)
router.get('/places', (req, res) =>
  res.json({
    places: [
      { name: 'Hazratganj', lat: 26.8467, lng: 80.9462 },
      { name: 'Phoenix Palassio', lat: 26.8206, lng: 81.0071 },
      { name: 'Charbagh Station', lat: 26.8316, lng: 80.9231 },
      { name: 'Gomti Nagar', lat: 26.8523, lng: 81.0112 },
      { name: 'IT City', lat: 26.7606, lng: 80.9722 },
      { name: 'Airport', lat: 26.7606, lng: 80.8893 },
    ],
  })
);

router.post('/estimate', (req, res) => {
  const { pickup, drop } = req.body;
  if (!pickup || !drop) return res.status(400).json({ message: 'Pickup aur drop dono chahiye' });
  const km = distanceKm(pickup, drop);
  res.json({ distanceKm: km, options: options(km) });
});

router.post('/', async (req, res) => {
  const { pickup, drop, vehicleType } = req.body;
  if (!pickup || !drop || !VEHICLES[vehicleType]) return res.status(400).json({ message: 'Ride details adhoori hain' });
  const active = await Ride.findOne({ user: req.user._id, status: { $in: LIVE } });
  if (active) return res.status(400).json({ message: 'Ek ride pehle se chal rahi hai', rideId: active._id });

  const drivers = await Driver.find({ vehicleType });
  const driver = drivers[Math.floor(Math.random() * drivers.length)];
  const km = distanceKm(pickup, drop);
  const ride = await Ride.create({
    user: req.user._id, driver: driver?._id, pickup, drop, vehicleType,
    distanceKm: km, durationMin: options(km).find((o) => o.type === vehicleType).durationMin,
    fare: fareFor(vehicleType, km),
  });
  res.status(201).json({ ride: await populate(Ride.findById(ride._id)) });
});

router.get('/active', async (req, res) => {
  const ride = await populate(Ride.findOne({ user: req.user._id, status: { $in: LIVE } }));
  res.json({ ride });
});

router.get('/', async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const rides = await populate(Ride.find(filter).sort({ createdAt: -1 }));
  res.json({ rides });
});

router.get('/:id', async (req, res) => {
  const ride = await populate(Ride.findOne({ _id: req.params.id, user: req.user._id }));
  if (!ride) return res.status(404).json({ message: 'Ride nahi mili' });
  res.json({ ride });
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['on_the_way', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
  if (!ride || !LIVE.includes(ride.status)) return res.status(400).json({ message: 'Status badal nahi sakte' });
  ride.status = status;
  await ride.save();
  res.json({ ride: await populate(Ride.findById(ride._id)) });
});

router.post('/:id/cancel', async (req, res) => {
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
  if (!ride || ride.status !== 'driver_found') return res.status(400).json({ message: 'Ye ride cancel nahi ho sakti' });
  ride.status = 'cancelled';
  await ride.save();
  res.json({ ride });
});

router.post('/:id/pay', async (req, res) => {
  const { method } = req.body;
  if (!['upi', 'card', 'wallet', 'cash'].includes(method)) return res.status(400).json({ message: 'Payment method chuno' });
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
  if (!ride || ride.status !== 'completed') return res.status(400).json({ message: 'Ride abhi complete nahi hui' });
  if (ride.paymentStatus === 'paid') return res.status(400).json({ message: 'Payment ho chuka hai' });
  if (method === 'wallet') {
    if (req.user.wallet < ride.fare) return res.status(400).json({ message: 'Wallet me paise kam hain' });
    req.user.wallet -= ride.fare;
    await req.user.save();
  }
  ride.paymentMethod = method;
  ride.paymentStatus = 'paid';
  await ride.save();
  res.json({ ride });
});

router.post('/:id/rate', async (req, res) => {
  const rating = Number(req.body.rating);
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: '1 se 5 star do' });
  const ride = await Ride.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { rating }, { new: true });
  res.json({ ride });
});

module.exports = router;
