import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  depositAmount: { type: DataTypes.FLOAT, allowNull: false },
  balanceDue: { type: DataTypes.FLOAT, allowNull: false },
  type: { type: DataTypes.STRING }, // e.g., "Bank Transfer"
  status: { type: DataTypes.STRING, defaultValue: "PENDING_VERIFICATION" },
  transactionRef: { type: DataTypes.STRING },
  proofUrl: { type: DataTypes.STRING }
});

export default Payment;