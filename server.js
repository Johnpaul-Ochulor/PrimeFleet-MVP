
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';
import { protect, restrictTo } from './middleware/authMiddleware.js';

const app = express();
const prisma = new PrismaClient();

// 1. MIDDLEWARE
app.use(helmet());  // Security headers
app.use(cors());    // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log requests to terminal
app.use(express.json()); // Parse JSON bodies

// app.get('/', (req, res) => {
//   res.status(200).send('PrimeFleet-MVP API is Live and Connected to Supabase!');
// });
app.get('/', (req, res) => {
  res.send('PrimeFleet-MVP API is Live');
});

// 2. ROUTES
app.use('/api/v1/auth', authRoutes);


app.get('/api/v1/admin-only-test', protect, restrictTo('SUPER_ADMIN'), (req, res) => {
  res.json({
    message: `Welcome ${req.user.fullName}, you have Admin access!`,
  });
});
// Routes will go here...
app.get('/test', (req, res) => {
  res.json({ message: "Middleware is working!" });
});

app.get('/api/v1/admin-only-test', protect, restrictTo('SUPER_ADMIN'), (req, res) => {
  res.json({
    message: `Welcome ${req.user.fullName}, you have Admin access!`,
  });
});
// 3. Testing
app.post('/api/test-json', (req, res) => {
  console.log("Data received from Postman:", req.body);
  res.json({ message: "Middleware is working!", receivedData: req.body });
});

// 4. GLOBAL ERROR HANDLER (Should be the last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 5. START SERVER (Always at the very bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));