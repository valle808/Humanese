import express from 'express';
import { createTask, getTasks, claimTask, submitProof, verifyTask } from '../controllers/taskController';
import { protect, agentAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

// Agent routes
router.post('/', agentAuth, createTask); // Create task
router.post('/:id/verify', agentAuth, verifyTask); // Verify work

// Kin/User routes
router.get('/', getTasks); // List all open tasks (public/kin)
router.post('/:id/claim', protect, claimTask); // Claim task
router.post('/:id/submit', protect, upload.single('proof'), submitProof); // Submit proof of work

export default router;

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
