import nodemailer from 'nodemailer';
import { mailConfig } from '../config/mailConfig.js';

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: mailConfig.auth
});

export const sendTransactionalEmail = async (to, subject, text, groupName = 'System_Alerts') => {
  if (mailConfig.sandboxMode) {
    console.log(`✉️ Sandbox Email to [${to}] Suppressed. Topic: ${subject}`);
    return;
  }

  const trackingHeaders = mailConfig.getTrackingHeaders(groupName);

  await transporter.sendMail({
    from: mailConfig.from,
    to,
    subject,
    text,
    headers: trackingHeaders
  });
};