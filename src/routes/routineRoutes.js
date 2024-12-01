import express from 'express';
import { getAllRoutines, addRoutine } from '../controllers/routineController.js';

const router = express.Router();

router.get('/', getAllRoutines);
router.post('/', addRoutine);

export default router;