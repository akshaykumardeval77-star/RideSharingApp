const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const otpStore = new Map(); // phone -> { otp, exp }
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const defaultAddresses = () => [
  { label: 'Home', name: 'Gomti Nagar', lat: 26.8523, lng: 81.0112 },
  { label: 'Work', name: 'IT City', lat: 26.7606, lng: 80.9722 },
];

router.post('/send-otp', (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '');
  if (phone.length !== 10) return res.status(400).json({ message: '10 digit ka mobile number daalo' });
  const otp = process.env.DEV_OTP || String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(phone, { otp, exp: Date.now() + 5 * 60 * 1000 });
  console.log(`OTP for ${phone}: ${otp}`);
  // Production me yahan SMS provider (Twilio/MSG91) lagao aur devOtp hata do
  res.json({ message: 'OTP bhej diya', devOtp: otp });
});

router.post('/verify-otp', async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '');
  const rec = otpStore.get(phone);
  if (!rec || rec.exp < Date.now() || rec.otp !== String(req.body.otp))
    return res.status(400).json({ message: 'OTP galat hai ya expire ho gaya' });
  otpStore.delete(phone);
  let user = await User.findOne({ phone });
  if (!user) user = await User.create({ phone, name: 'Rider', addresses: defaultAddresses() });
  res.json({ token: sign(user), user });
});

// Demo social login (Google/Apple) - real OAuth baad me lagana
router.post('/social', async (req, res) => {
  const provider = req.body.provider === 'apple' ? 'apple' : 'google';
  const email = `demo.${provider}@ridekaro.app`;
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ name: 'Akshay', email, addresses: defaultAddresses() });
  res.json({ token: sign(user), user });
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }));
router.put('/me', auth, async (req, res) => {
  const { name, email } = req.body;
  if (name) req.user.name = name;
  if (email !== undefined) req.user.email = email;
  await req.user.save();
  res.json({ user: req.user });
});

module.exports = router;
