import express from 'express';
import { getQuote, createBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/quote', getQuote);
router.post('/', createBooking);

export default router;