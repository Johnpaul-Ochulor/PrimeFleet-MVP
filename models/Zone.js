import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Zone = sequelize.define('Zone', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Zone;