import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Zone = sequelize.define('Zone', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true // Prevents duplicate zones like "Lekki" being added twice
  },
  
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  // This ensures Sequelize looks for 'Zones' (plural) in the database
  tableName: 'Zones',
  timestamps: true
});

export default Zone;