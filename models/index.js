import User from './User.js';
import Vehicle from './Vehicle.js';
import Driver from './Driver.js';
import Booking from './Booking.js';
import Payment from './Payment.js';
import { LocationSurcharge, isLateNight } from './LocationSurcharge.js';

// Relationships
User.hasMany(Booking);
Booking.belongsTo(User);

Vehicle.hasMany(Booking);
Booking.belongsTo(Vehicle);

// Primary and Backup Driver relations
Driver.hasMany(Booking, { as: 'PrimaryBookings', foreignKey: 'driverId' });
Driver.hasMany(Booking, { as: 'BackupBookings', foreignKey: 'backupDriverId' });
Booking.belongsTo(Driver, { as: 'PrimaryDriver', foreignKey: 'driverId' });
Booking.belongsTo(Driver, { as: 'BackupDriver', foreignKey: 'backupDriverId' });

Booking.hasOne(Payment);
Payment.belongsTo(Booking);

// Vehicle to Driver relation
Driver.hasMany(Vehicle);
Vehicle.belongsTo(Driver);

export { User, Vehicle, Driver, Booking, Payment, LocationSurcharge, isLateNight };