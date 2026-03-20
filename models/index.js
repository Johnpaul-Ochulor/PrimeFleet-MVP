import User from './User.js';
import Vehicle from './Vehicle.js';
import Driver from './Driver.js';
import Booking from './Booking.js';
import Payment from './Payment.js';
import Zone from './Zone.js';
import ZoneRate from './ZoneRate.js';

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

Zone.hasMany(Booking);
Booking.belongsTo(Zone);

Booking.hasOne(Payment);
Payment.belongsTo(Booking);

// Vehicle to Driver relation
Driver.hasMany(Vehicle);
Vehicle.belongsTo(Driver);

// ZoneRate belongs to a "From" Zone and a "To" Zone
ZoneRate.belongsTo(Zone, { as: 'FromZone', foreignKey: 'fromZoneId' });
ZoneRate.belongsTo(Zone, { as: 'ToZone', foreignKey: 'toZoneId' });

export { User, Vehicle, Driver, Booking, Payment, Zone, ZoneRate };