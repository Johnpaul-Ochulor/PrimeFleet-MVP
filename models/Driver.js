import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Driver = sequelize.define('Driver', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  licenseNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  licensePhotoUrl: { type: DataTypes.STRING },
  profilePhotoUrl: { type: DataTypes.STRING },
  approvalStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Driver;