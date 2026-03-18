import express from 'express';
import { signup, login, registerAgent, getMe } from '../controllers/authController';
import { protect, agentAuth } from '../middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Requires login
router.post('/register-agent', protect, registerAgent); // Only Developers can call this

// Get current user or agent info
router.get('/me', protect, getMe); // For User/Dev
// router.get('/agent/me', agentAuth, getMe); // For Agent (if needed separately)

export default router;

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
