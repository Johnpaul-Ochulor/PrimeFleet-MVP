import express from 'express';
import { getQuote } from '../controllers/quoteController.js';
import Zone from '../models/Zone.js'; // Ensure the path to your Zone model is correct

const router = express.Router();

/**
 * @route   GET /api/v1/quotes/locations
 * @desc    TEMPORARY: Get all valid zone names to verify spelling for quotes
 * @access  Public
 */
router.get('/locations', async (req, res) => {
  try {
    const zones = await Zone.findAll({ 
      attributes: ['name'],
      order: [['name', 'ASC']] 
    });
    res.status(200).json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching locations', error: error.message });
  }
});

/**
 * @route   POST /api/v1/quotes/calculate
 * @desc    Calculate the hybrid quote (Base Zone Rate + Vehicle Premium)
 * @access  Public
 */
router.post('/calculate', getQuote);

export default router;