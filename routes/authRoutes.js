import express from 'express';
import {login, register} from '../controllers/authController.js';

const router = express.Router();
router.post('/login', login);
router.post('/register', register);
export default router;

// To create staff accounts, open your database directly (via pgAdmin, TablePlus, or the Render dashboard's query tool) and run:
// sqlINSERT INTO "Users" ("id", "fullName", "email", "password", "role", "createdAt", "updatedAt")
// VALUES (
//   gen_random_uuid(),
//   'Staff Name',
//   'staff@primefleet.com',
//   '$2a$10$....',  -- a bcrypt hash of their password
//   'ADMIN',
//   NOW(),
//   NOW()
// );
// The tricky part is the password needs to be pre-hashed. The easiest way is to run this one-time in your terminal to get the hash:
// javascript// run with: node -e "..."
// node -e "import('bcryptjs').then(m => m.default.hash('theirpassword', 10).then(console.log))"
// Copy the output hash and paste it into the SQL above.