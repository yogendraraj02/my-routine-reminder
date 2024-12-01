import db from '../config/database.js';
import logger from '../utils/logger.js';

export const getAllRoutines = async (req, res) => {
  try {
    const routines = await db.getAllRoutines();
    res.json(routines);
  } catch (error) {
    logger.error('Failed to get routines:', error);
    res.status(500).json({ error: 'Failed to get routines' });
  }
};

export const addRoutine = async (req, res) => {
  const { time, task } = req.body;
  try {
    const routine = await db.addRoutine(time, task);
    res.status(201).json(routine);
  } catch (error) {
    logger.error('Failed to create routine:', error);
    res.status(500).json({ error: 'Failed to create routine' });
  }
};