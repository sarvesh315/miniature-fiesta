import dotenv from 'dotenv';
dotenv.config();

export const mailConfig = {
  host: process.env.SMTP_HOST || 'smtp.api.createsend.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true', // false for port 587 (uses STARTTLS)
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  from: process.env.MAIL_FROM || '"Secure App" <security@yourdomain.com>',
  
  // Custom Campaign Monitor tracking headers helper
  getTrackingHeaders: (groupName) => ({
    'X-Cmail-GroupName': groupName,   // Groups analytics inside your Campaign Monitor dashboard
    'X-Cmail-TrackOpens': 'true',     // Tracks email opens
    'X-Cmail-TrackClicks': 'true'     // Tracks link clicks inside the emails
  }),

  sandboxMode: process.env.NODE_ENV === 'test'
};