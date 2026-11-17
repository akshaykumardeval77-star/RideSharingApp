const router = require('express').Router();
const auth = require('../middleware/auth');
router.use(auth);

router.get('/wallet', (req, res) => res.json({ balance: req.user.wallet }));
router.post('/wallet/add', async (req, res) => {
  const amt = Number(req.body.amount);
  if (!(amt > 0 && amt <= 10000)) return res.status(400).json({ message: '1 se 10000 ke beech amount daalo' });
  req.user.wallet += amt;
  await req.user.save();
  res.json({ balance: req.user.wallet });
});

router.get('/addresses', (req, res) => res.json({ addresses: req.user.addresses }));
router.post('/addresses', async (req, res) => {
  const { label, name, lat, lng } = req.body;
  if (!label || !name) return res.status(400).json({ message: 'Label aur address zaruri hai' });
  req.user.addresses.push({ label, name, lat: lat ?? 26.85, lng: lng ?? 80.94 });
  await req.user.save();
  res.json({ addresses: req.user.addresses });
});
router.delete('/addresses/:id', async (req, res) => {
  req.user.addresses = req.user.addresses.filter((a) => String(a._id) !== req.params.id);
  await req.user.save();
  res.json({ addresses: req.user.addresses });
});

router.get('/offers', (req, res) =>
  res.json({
    offers: [
      { code: 'FIRST50', title: 'Pehli ride par 50% off', desc: 'Max ₹75 tak. Naye users ke liye.' },
      { code: 'BIKE20', title: 'Bike rides par ₹20 off', desc: '₹50 se upar ki bike ride par.' },
      { code: 'AIRPORT100', title: 'Airport ride par ₹100 off', desc: 'Mini ya SUV book karo.' },
    ],
  })
);

module.exports = router;
