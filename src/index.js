import express from 'express';
import 'dotenv/config';
import db from './config/database.js';
import routineRoutes from './routes/routineRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import { initializeCronJobs } from './services/cronService.js';
import logger from './utils/logger.js';

const app = express();
app.use(express.json());

// Initialize database
db.init()
  .then(() => {
    logger.info('Database initialized successfully');
    
    // Routes
    app.use('/routines', routineRoutes);
    app.use('/', subscriberRoutes);

    // Initialize cron jobs
    initializeCronJobs();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Handle cleanup on process termination
process.on('SIGTERM', async () => {
  try {
    await db.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});