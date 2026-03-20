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
  // Match this to what your controller uses
  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'), 
    defaultValue: 'active' 
  },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  photoUrl: { type: DataTypes.STRING },
  inspectionRecordUrl: { type: DataTypes.STRING } // Ensure this matches the controller
});


export default Vehicle;