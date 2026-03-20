const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Job Portal" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error('Email send error:', error.message);
        // Don't throw — email failure shouldn't block the request
    }
};

const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({
        to: email,
        subject: 'Verify Your Email — Job Portal',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Welcome to Job Portal!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #64748b; font-size: 14px;">If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
    });
};

const sendPasswordResetEmail = async (email, otp) => {
    await sendEmail({
        to: email,
        subject: 'Password Reset OTP — Job Portal',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Password Reset</h2>
        <p>Your OTP for password reset is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; padding: 16px; background: #f1f5f9; border-radius: 8px; text-align: center; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 14px;">This OTP expires in 10 minutes. If you didn't request this, please ignore.</p>
      </div>
    `,
    });
};

const sendApplicationStatusEmail = async (email, applicantName, jobTitle, newStatus) => {
    const statusMessages = {
        shortlisted: 'You have been shortlisted!',
        interview: 'You have been selected for an interview!',
        offered: 'Congratulations! You have received a job offer!',
        rejected: 'We regret to inform you that your application was not selected.',
    };

    await sendEmail({
        to: email,
        subject: `Application Update: ${jobTitle} — Job Portal`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Application Update</h2>
        <p>Hi ${applicantName},</p>
        <p>${statusMessages[newStatus] || `Your application status has been updated to: ${newStatus}`}</p>
        <p><strong>Job:</strong> ${jobTitle}</p>
        <p><strong>New Status:</strong> <span style="text-transform: capitalize;">${newStatus}</span></p>
        <a href="${process.env.CLIENT_URL}/student/applications" style="display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          View Application
        </a>
      </div>
    `,
    });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendApplicationStatusEmail,
};
