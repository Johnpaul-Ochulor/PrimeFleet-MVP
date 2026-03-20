import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vehicle = sequelize.define('Vehicle', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  make: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER },
  plateNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  vehicleType: { 
    type: DataTypes.ENUM('SEDAN', 'SUV', 'VAN', 'BUS', 'LUXURY'),
    allowNull: false
  },
  pricePerDay: { type: DataTypes.FLOAT, allowNull: false },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  photoUrl: { type: DataTypes.STRING },
  inspectionRecordUrl: { type: DataTypes.STRING },
  basePrice: {
  type: DataTypes.FLOAT,
  allowNull: false,
  defaultValue: 0
},

pricePerKm: {
  type: DataTypes.FLOAT,
  allowNull: false,
  defaultValue: 0
}
});

export default Vehicle;