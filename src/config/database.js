import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import logger from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Database {
  constructor() {
    this.dbPath = './data/routines.db';
    this.ensureDataDirectory();
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        logger.error('Error connecting to database:', err);
      } else {
        logger.info('Connected to SQLite database');
      }
    });
    
    this.run = promisify(this.db.run.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir('./data', { recursive: true });
    } catch (error) {
      logger.error('Error creating data directory:', error);
    }
  }

  async init() {
    try {
      // Create tables if they don't exist
      await this.run(`
        CREATE TABLE IF NOT EXISTS routines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          time TEXT NOT NULL,
          task TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0
        )
      `);
      // CREATE TABLE IF NOT EXISTS routines 
    //   await this.run(`
    //     ( id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     time TEXT NOT NULL,
    //     task TEXT NOT NULL,
    //     duration TEXT,
    //     focus TEXT,
    //     details TEXT,
    //     completed BOOLEAN DEFAULT 0
    //   )
    // `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          active BOOLEAN DEFAULT 1
        )
      `);

      // Check if routines table is empty
      const routinesCount = await this.get('SELECT COUNT(*) as count FROM routines');
      
      if (routinesCount.count === 0) {
        // Insert default routines only if table is empty
        const defaultRoutines = [
          // { time: '06:00', task: 'Morning Exercise' },
          // { time: '07:00', task: 'Breakfast' },
          // { time: '09:00', task: 'Work/Study Block 1' },
          // { time: '12:00', task: 'Lunch Break' },
          // { time: '13:00', task: 'Work/Study Block 2' },
          // { time: '17:00', task: 'Evening Exercise' },
          // { time: '19:00', task: 'Dinner' },
          // { time: '22:00', task: 'Bedtime Routine' }
           // Weekday Morning Routine
          {
            time: '11:00 PM',
            task: 'Start Learning Block - DSA Problem Solving',
            duration: '45 mins',
            platform: 'LeetCode',
            focus: 'Arrays and Strings Problems'
        },
        {
            time: '11:45 PM',
            task: 'Technical Skill Development',
            duration: '45 mins',
            focus: 'Alternate between:',
            subtasks: [
                'Computer Fundamentals',
                'System Design',
                'Node.js Project Development'
            ]
        },
        {
            time: '12:30 AM',
            task: 'Daily Reflection and Next Day Planning',
            duration: '30 mins',
            activities: [
                'Review day\'s progress',
                'Document challenges',
                'Set specific goals for next day',
                'Practicing mindfulness/meditation'
            ]
        },
        // Weekend Deep Dive Routine
        {
            time: 'Saturday 8:00 AM',
            task: 'Intensive Learning Session',
            duration: '4 hours',
            focus: 'DSA Practice',
            details: '2-3 LeetCode Hard Problems, Analyze Solutions'
        },
        {
            time: 'Saturday 1:00 PM',
            task: 'Project Development',
            duration: '2 hours',
            focus: 'Node.js Distributed Task Management System',
            milestones: [
                'Microservice architecture',
                'Feature implementation',
                'Code refactoring'
            ]
        },
        {
            time: 'Sunday 10:00 AM',
            task: 'System Design Study',
            duration: '2 hours',
            resources: [
                'System Design Interview Book',
                'Draw system architectures',
                'Analyze real-world system designs'
            ]
        }
        ];

        for (const routine of defaultRoutines) {
          await this.run('INSERT INTO routines (time, task) VALUES (?, ?)', [routine.time, routine.task]);
        }
        logger.info('Default routines inserted successfully');
      }
    } catch (error) {
      logger.error('Database initialization error:', error);
      throw error;
    }
  }

  async getAllRoutines() {
    return this.all('SELECT * FROM routines ORDER BY time');
  }

  async addRoutine(time, task) {
    const result = await this.run('INSERT INTO routines (time, task) VALUES (?, ?)', [time, task]);
    return { id: this.db.lastID, time, task };
  }

  async updateRoutine(id, time, task) {
    await this.run('UPDATE routines SET time = ?, task = ? WHERE id = ?', [time, task, id]);
    return this.get('SELECT * FROM routines WHERE id = ?', [id]);
  }

  async deleteRoutine(id) {
    return this.run('DELETE FROM routines WHERE id = ?', [id]);
  }

  async getActiveSubscribers() {
    return this.all('SELECT email FROM subscribers WHERE active = 1');
  }

  async addSubscriber(email) {
    return this.run('INSERT INTO subscribers (email) VALUES (?)', [email]);
  }

  async unsubscribe(email) {
    return this.run('UPDATE subscribers SET active = 0 WHERE email = ?', [email]);
  }

  // Ensure proper cleanup on application shutdown
  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
          reject(err);
        } else {
          logger.info('Database connection closed');
          resolve();
        }
      });
    });
  }
}

const database = new Database();

// Handle cleanup on process termination
process.on('SIGINT', async () => {
  try {
    await database.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

export default database;