const mongoose = require('mongoose');
const place = { name: String, lat: Number, lng: Number };
const rideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    pickup: place,
    drop: place,
    vehicleType: String,
    distanceKm: Number,
    durationMin: Number,
    fare: Number,
    status: {
      type: String,
      enum: ['driver_found', 'on_the_way', 'completed', 'cancelled'],
      default: 'driver_found',
    },
    paymentMethod: { type: String, enum: ['upi', 'card', 'wallet', 'cash'] },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    rating: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model('Ride', rideSchema);
