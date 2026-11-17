const Driver = require('../models/Driver');
module.exports = async () => {
  if (await Driver.countDocuments()) return;
  await Driver.insertMany([
    { name: 'Rahul Kumar', phone: '+91 98111 22334', rating: 4.8, totalRides: 320, vehicleType: 'mini', vehicleName: 'White Swift', plate: 'UP32 AB 1234' },
    { name: 'Sunil Yadav', phone: '+91 98222 33445', rating: 4.7, totalRides: 210, vehicleType: 'mini', vehicleName: 'Grey WagonR', plate: 'UP32 CD 5678' },
    { name: 'Amit Singh', phone: '+91 98333 44556', rating: 4.9, totalRides: 540, vehicleType: 'bike', vehicleName: 'Black Splendor', plate: 'UP32 EF 4321' },
    { name: 'Deepak Verma', phone: '+91 98444 55667', rating: 4.6, totalRides: 150, vehicleType: 'bike', vehicleName: 'Red Pulsar', plate: 'UP32 GH 8765' },
    { name: 'Manoj Gupta', phone: '+91 98555 66778', rating: 4.5, totalRides: 410, vehicleType: 'auto', vehicleName: 'Yellow Bajaj Auto', plate: 'UP32 JK 1122' },
    { name: 'Vikas Pandey', phone: '+91 98666 77889', rating: 4.8, totalRides: 275, vehicleType: 'suv', vehicleName: 'Black Innova', plate: 'UP32 LM 3344' },
  ]);
  console.log('Demo drivers seed ho gaye');
};
