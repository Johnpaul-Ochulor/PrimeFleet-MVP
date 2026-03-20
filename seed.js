import bcrypt from 'bcryptjs';
import { User, Vehicle, Zone, Driver, ZoneRate } from './models/index.js';
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
    const zones = await Zone.bulkCreate([
      { name: 'Ikeja' },
      { name: 'Lekki' },
      { name: 'Victoria Island' },
      { name: 'Ajah' }
    ]);
    console.log('📍 Locations (Zones) created.');

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
        driverId: driver.id,
        status: 'active'
      },
      {
        make: 'Lexus',
        model: 'GX460',
        year: 2021,
        plateNumber: 'APP-456BB',
        vehicleType: 'SUV',
        pricePerDay: 55000,
        driverId: driver.id,
        status: 'active'
      }
    ]);
    // 6. Create Pricing (ZoneRates)
    // We need to link the IDs from the zones we just created
    const ikeja = zones.find(z => z.name === 'Ikeja');
    const vi = zones.find(z => z.name === 'Victoria Island');

    await ZoneRate.bulkCreate([
      {
        fromZoneId: vi.id,
        toZoneId: ikeja.id,
        vehicleType: 'SUV',
        basePrice: 45000.00
      },
      {
        fromZoneId: vi.id,
        toZoneId: ikeja.id,
        vehicleType: 'SEDAN',
        basePrice: 30000.00
      }
    ]);
    console.log('💰 Zone Rates (Pricing) created.');
    console.log('🚗 Vehicles created.');

    console.log('✨ Seeding complete! Exiting...');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();