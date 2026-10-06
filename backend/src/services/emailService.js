const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send an OTP email to the user
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'IntellMeet <noreply@intellmeet.io>',
    to: toEmail,
    subject: '🔐 Your IntellMeet One-Time Password',
    html: `
      <div style="font-family: Arial, sans-serif; background: #0f172a; padding: 40px; border-radius: 16px; max-width: 480px; margin: auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #6366f1; font-size: 28px; margin: 0;">IntellMeet</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">AI-Powered Meeting Platform</p>
        </div>

        <div style="background: #1e293b; border-radius: 12px; padding: 32px; text-align: center; border: 1px solid #334155;">
          <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 8px;">Your One-Time Password is:</p>
          <div style="background: #0f172a; border: 2px solid #6366f1; border-radius: 12px; padding: 18px 24px; display: inline-block; margin: 16px 0;">
            <span style="color: #fff; font-size: 36px; font-weight: bold; letter-spacing: 12px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
            ⏱ This OTP expires in <strong style="color: #f59e0b;">10 minutes</strong>.<br/>
            Do not share this code with anyone.
          </p>
        </div>

        <div style="margin-top: 28px; text-align: center;">
          <p style="color: #475569; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.<br/>
            — The IntellMeet Team
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
