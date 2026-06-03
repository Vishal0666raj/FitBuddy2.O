const nodemailer = require('nodemailer');
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    connectionTimeout: 5000,
    socketTimeout: 5000,
  });
  return transporter;
}
exports.sendMail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_HOST) { console.log('[mailer:no-smtp]', to, subject); return; }
  try {
    await getTransporter().sendMail({ from: process.env.EMAIL_FROM || 'fitBuddy <no-reply@fitBuddy.app>', to, subject, html, text });
  } catch (err) {
    console.error('[mailer:error]', err.message);
    // Don't crash - just log and continue
  }
};
