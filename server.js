import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { prisma } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import driverRoutes from "./routes/driverRoutes.js";
import bookingsRoute from "./routes/bookingsRoute.js"
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { protect, restrictTo } from './middleware/authMiddleware.js';

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 

// 2. MOUNT API ROUTES (Version 1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/bookings', bookingsRoute);

// 3. SPECIAL & TEST ROUTES
app.get('/', (req, res) => {
  res.send('PrimeFleet-MVP API is Live and Operational');
});

// Security Test Route
app.get('/api/v1/admin-only-test', protect, restrictTo('SUPER_ADMIN'), (req, res) => {
  res.json({
    message: `Welcome ${req.user.fullName}, you have Admin access!`,
  });
});

// JSON Test Route
app.post('/api/test-json', (req, res) => {
  console.log("Data received:", req.body);
  res.json({ message: "JSON Body Parsing is working!", receivedData: req.body });
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 5. START SERVER
const PORT = process.env.PORT || 5000;

// Connect to Database before starting the listener
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Endpoints available at http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

startServer();