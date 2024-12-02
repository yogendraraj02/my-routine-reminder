import nodemailer from 'nodemailer';
import { getEmailTemplate } from '../templates/emailTemplate.js';
import logger from '../utils/logger.js';
import 'dotenv/config';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendDailyReminder(recipient, routines) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: 'Your Daily Routine Reminder',
      html: getEmailTemplate(routines)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async confirmEmail(recipient) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: 'Your Daily Routine Reminder',
      html: `Welcome To Our App, Now onwards you will receive your daily routine reminders!`
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }
}

export default new EmailService();