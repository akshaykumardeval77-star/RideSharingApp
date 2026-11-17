const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
  label: String, // Home, Work...
  name: String,
  lat: Number,
  lng: Number,
});
const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Rider' },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, default: '' },
    wallet: { type: Number, default: 200 },
    addresses: [addressSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);
