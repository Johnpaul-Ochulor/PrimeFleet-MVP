import express from 'express';
import { login, register } from '../controllers/authController.js';

// import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);

// REMOVE 'protect' and 'restrictTo' just for this test
router.post('/register', register); 

export default router;