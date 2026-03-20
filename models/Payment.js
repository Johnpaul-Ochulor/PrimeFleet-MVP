import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  
  // CRITICAL: Link this payment to a specific booking
  bookingId: { 
    type: DataTypes.UUID, 
    allowNull: true
  },

  amount: { type: DataTypes.FLOAT, allowNull: false },
  depositAmount: { type: DataTypes.FLOAT, allowNull: false },
  balanceDue: { type: DataTypes.FLOAT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: "Bank Transfer" }, 
  status: { type: DataTypes.STRING, defaultValue: "PENDING_VERIFICATION" },
  transactionRef: { type: DataTypes.STRING }, // e.g., "PF-G8TEG-PAY"
  proofUrl: { type: DataTypes.STRING }        // This will be the Cloudinary link
});

export default Payment;