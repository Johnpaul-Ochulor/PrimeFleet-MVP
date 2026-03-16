import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  passengerName: { type: DataTypes.STRING, allowNull: false },
  passengerPhone: { type: DataTypes.STRING, allowNull: false },
  passengerEmail: { type: DataTypes.STRING, allowNull: false },
  numberOfPassengers: { type: DataTypes.INTEGER, defaultValue: 1 },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('PENDING_PAYMENT', 'AWAITING_VERIFICATION', 'ASSIGNED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING_PAYMENT'
  },
  pickupLocation: { type: DataTypes.STRING, allowNull: false },
  dropoffLocation: { type: DataTypes.STRING, allowNull: false },
  instructions: { type: DataTypes.TEXT },
  assignedAt: { type: DataTypes.DATE },
  confirmedAt: { type: DataTypes.DATE },
  inProgressAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE },
  cancelledAt: { type: DataTypes.DATE }
});

export default Booking;