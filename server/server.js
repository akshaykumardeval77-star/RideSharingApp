require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const seedDrivers = require('./utils/seed');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/user', require('./routes/user'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Production: build hua React client serve karo
const dist = path.join(__dirname, '../client/dist');
app.use(express.static(dist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(dist, 'index.html'), (err) => err && next());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDrivers();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('MongoDB connect nahi hua. MongoDB chalu hai? ->', e.message);
    process.exit(1);
  });
