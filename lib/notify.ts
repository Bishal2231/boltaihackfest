import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS ,
  },
});

/**
 * Sends an email to the user for verification or notifications
 */
export async function sendVerificationEmail(to: string, code: string) {
  const subject = 'Verify your FireGuard Account';
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to FireGuard 👋</h2>
      <p>Thank you for signing up. Please verify your account using the code below:</p>
      <div style="font-size: 20px; font-weight: bold; margin: 10px 0; color: #007bff;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p style="margin-top: 20px;">Stay safe,<br/>FireGuard Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER || 'animezoneamv@gmail.com',
    to,
    subject,
    html: htmlMessage,
  });
}
