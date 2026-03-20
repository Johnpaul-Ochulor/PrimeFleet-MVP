import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  reference: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false
  },

  passengerName: { type: DataTypes.STRING, allowNull: false },
  passengerPhone: { type: DataTypes.STRING, allowNull: false },
  passengerEmail: { type: DataTypes.STRING, allowNull: false },

  numberOfPassengers: { type: DataTypes.INTEGER, defaultValue: 1 },

  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },

  status: { 
    type: DataTypes.ENUM(
      "PENDING_PAYMENT",
      "AWAITING_VERIFICATION",
      "ASSIGNED",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED"
    ),
    defaultValue: "PENDING_PAYMENT"
  },

  pickupLocation: { type: DataTypes.STRING, allowNull: false },
  dropoffLocation: { type: DataTypes.STRING, allowNull: false },

  // CRITICAL: Added missing financial/relation fields
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  vehicleId: { type: DataTypes.UUID, allowNull: true },

  instructions: { type: DataTypes.TEXT },

  driverId: { 
    type: DataTypes.UUID,
    allowNull: true
  },

  backupDriverId: {
  type: DataTypes.UUID,
  allowNull: true
},

  assignedAt: { type: DataTypes.DATE },
  confirmedAt: { type: DataTypes.DATE },
  inProgressAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE },
  cancelledAt: { type: DataTypes.DATE }
});

export default Booking;