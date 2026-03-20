import bcrypt from 'bcryptjs';
import { User, Vehicle, LocationSurcharge, Driver } from './models/index.js';
import sequelize from './config/db.js';

const seedDatabase = async () => {
  try {
    // 1. Connect and Sync
    await sequelize.sync({ force: true }); // WARNING: 'force: true' drops tables and recreates them. Perfect for a fresh seed.
    console.log('✅ Database cleared and synced for seeding.');

    // 2. Create a Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      fullName: 'PrimeFleet Admin',
      email: 'admin@primefleet.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    });
    console.log('👤 Admin User created (admin@primefleet.com / admin123)');

    // 3. Create Zones
    const zones = await LocationSurcharge.bulkCreate([
      { name: 'Ikeja',            surcharge: 1500 },
      { name: 'Lekki',            surcharge: 2000 },
      { name: 'Victoria Island',  surcharge: 2500 },
      { name: 'Ajah',             surcharge: 3000 }
    ]);
    console.log('📍 Location surcharges created.');

    // 4. Create a Driver
    const driver = await Driver.create({
      name: 'Sunday Okafor',
      phone: '08012345678',
      licenseNumber: 'LASG-992233',
      approvalStatus: true
    });
    console.log('👨‍✈️ Driver created.');

    // 5. Create Vehicles
    await Vehicle.bulkCreate([
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        plateNumber: 'KJA-123AA',
        vehicleType: 'SEDAN',
        pricePerDay: 25000,
        basePrice: 5000,
        pricePerKm: 150,
        driverId: driver.id
      },
      {
        make: 'Lexus',
        model: 'GX460',
        year: 2021,
        plateNumber: 'APP-456BB',
        vehicleType: 'SUV',
        pricePerDay: 55000,
        driverId: driver.id
      }
    ]);
    console.log('🚗 Vehicles created.');

    console.log('✨ Seeding complete! Exiting...');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();