import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

// 1. CHANGE: Import Sequelize instead of Prisma
import sequelize from './config/db.js'; 
// 2. CHANGE: Import your models to make sure they are registered for syncing
import './models/index.js'; 

// Route Imports
import authRoutes from './routes/authRoutes.js';
import driverRoutes from "./routes/driverRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import { protect, restrictTo } from './middleware/authMiddleware.js';

const app = express();

// MIDDLEWARE
app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 

// ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('PrimeFleet-MVP API (Sequelize Edition) is Live');
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// 3. CHANGE: Use Sequelize Authenticate and Sync
async function startServer() {
  try {
    // Check if the connection works
    await sequelize.authenticate();
    console.log('✅ Database connected successfully (Sequelize)');

    // This creates/updates the tables in your Postgres DB automatically
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Endpoints available at http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Database connection/sync failed:', error);
    process.exit(1);
  }
}

startServer();