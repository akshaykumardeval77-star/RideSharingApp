const mongoose = require('mongoose');
module.exports = mongoose.model(
  'Driver',
  new mongoose.Schema({
    name: String,
    phone: String,
    rating: Number,
    totalRides: Number,
    vehicleType: { type: String, enum: ['bike', 'auto', 'mini', 'suv'] },
    vehicleName: String,
    plate: String,
  })
);
