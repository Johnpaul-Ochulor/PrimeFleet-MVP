import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ZoneRate = sequelize.define('ZoneRate', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  
  fromZoneId: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  
  toZoneId: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  
  vehicleType: { 
    type: DataTypes.ENUM('SEDAN', 'SUV', 'VAN', 'BUS'), 
    allowNull: false 
  },
  
  basePrice: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  }
}, {
  tableName: 'ZoneRates',
  timestamps: true
});

export default ZoneRate;