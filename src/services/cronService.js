import cron from 'node-cron';
import db from '../config/database.js';
import emailService from './emailService.js';
import logger from '../utils/logger.js';

export const initializeCronJobs = () => {
  // Schedule a task to run daily at 5:00 AM and 10:00 PM
// cron.schedule('0 5,22 * * *', async () => {
//   try {
  // Schedule daily email at 5:00 AM
  // '0 5 * * *'
  cron.schedule('0 5,22 * * *', async () => {
    try {
      const routines = await db.getAllRoutines();
      const activeSubscribers = await db.getActiveSubscribers();
      
      for (const subscriber of activeSubscribers) {
        await emailService.sendDailyReminder(subscriber.email, routines);
      } 
    } catch (error) {
      logger.error('Failed to send daily reminders:', error);
    }
  });
};