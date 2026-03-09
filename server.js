import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
// const prisma = new PrismaClient();
const prisma = new PrismaClient({});

// --- BASIC MIDDLEWARE SETUP ---
app.use(helmet());        // Security headers
app.use(cors());          // Enable Cross-Origin Resource Sharing
app.use(morgan('dev'));   // Log requests to terminal
app.use(express.json());  // Parse JSON bodies

const protect = (req, res, next) => {
  // Logic to check JWT token will go here later
  next();
};

// Routes will go here...
app.get('/test', (req, res) => {
  res.json({ message: "Middleware is working!" });
});

// --- 3. Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// TESTING
app.post('/api/test-json', (req, res) =>{
console.log("Data recieved from Postman: ",
req.body);

if(!req.body  || Object.keys(req.body).length ===0){
  return res.status(400).json({error: "JSON middleware failed - no data recieved"});
}

  res.json({
    message: "Middleware is working!",
    receivedData: req.body
  });

});