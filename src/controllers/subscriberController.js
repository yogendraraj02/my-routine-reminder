import db from '../config/database.js';
import emailService from '../services/emailService.js';
import logger from '../utils/logger.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    await db.addSubscriber(email);
    await emailService.confirmEmail(email);
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    logger.error('Failed to subscribe:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};

export const unsubscribe = async (req, res) => {
  const { email } = req.body;
  try {
    await db.unsubscribe(email);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    logger.error('Failed to unsubscribe:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};