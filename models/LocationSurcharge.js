 import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
 
 export const LocationSurcharge = sequelize.define("LocationSurcharge", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING, // Lekki, Ajah
  surcharge: DataTypes.FLOAT
});

export const isLateNight = (date) => {
  const hour = new Date(date).getHours();
  return hour >= 22 || hour < 6;
};