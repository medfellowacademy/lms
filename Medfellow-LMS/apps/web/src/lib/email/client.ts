import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'MedFellow Academy <noreply@medfellow.academy>';

// Email templates
export const emailTemplates = {
  welcome: (firstName: string) => ({
    subject: 'Welcome to MedFellow Academy! 🎓',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MedFellow</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 16px;">Welcome, Dr. ${firstName}! 👋</h1>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                You've joined the future of medical education. Start your journey to excellence today.
              </p>
            </div>
            
            <div style="background: #ffffff; border-radius: 16px; padding: 32px; margin-top: 24px;">
              <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 24px;">Get Started 🚀</h2>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">📚 Explore Courses</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">World-class cardiology curriculum from leading experts.</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">🤖 Meet Dr. Nexus AI</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">Your 24/7 AI tutor powered by GPT-4.</p>
              </div>
              
              <div style="margin-bottom: 24px;">
                <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">🎮 VR Surgery Lab</h3>
                <p style="color: #64748b; font-size: 14px; margin: 0;">Practice procedures in immersive simulations.</p>
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Start Learning →
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
              © ${new Date().getFullYear()} MedFellow Academy. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  courseEnrollment: (firstName: string, courseName: string) => ({
    subject: `You're enrolled in ${courseName}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #ffffff; border-radius: 16px; padding: 32px;">
              <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 16px;">Great choice, Dr. ${firstName}! 🎯</h1>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                You've successfully enrolled in <strong>${courseName}</strong>. Your learning journey starts now.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin-top: 24px;">
                Start Course →
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  certificateEarned: (firstName: string, certName: string, verificationUrl: string) => ({
    subject: `🏆 Congratulations! You earned a certificate`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 16px; padding: 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
              <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 8px;">Congratulations!</h1>
              <p style="color: #d1fae5; font-size: 16px;">You've earned a new certificate</p>
            </div>
            
            <div style="background: #ffffff; border-radius: 16px; padding: 32px; margin-top: 24px; text-align: center;">
              <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 8px;">${certName}</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
                Dr. ${firstName}, you've demonstrated excellence in your field.
              </p>
              <a href="${verificationUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                View Certificate →
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: 'Reset your MedFellow password',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #ffffff; border-radius: 16px; padding: 32px; text-align: center;">
              <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 16px;">Reset Your Password</h1>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Click the button below to reset your password. This link expires in 1 hour.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Reset Password →
              </a>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  weeklyProgress: (firstName: string, stats: { xp: number; courses: number; streak: number }) => ({
    subject: `Your Weekly Progress Report 📊`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #ffffff; border-radius: 16px; padding: 32px;">
              <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 24px;">Weekly Progress 📊</h1>
              <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Great work this week, Dr. ${firstName}!</p>
              
              <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                <div style="flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.xp.toLocaleString()}</div>
                  <div style="color: #64748b; font-size: 12px;">XP Earned</div>
                </div>
                <div style="flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${stats.courses}</div>
                  <div style="color: #64748b; font-size: 12px;">Lessons</div>
                </div>
                <div style="flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #f97316;">${stats.streak} 🔥</div>
                  <div style="color: #64748b; font-size: 12px;">Day Streak</div>
                </div>
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Continue Learning →
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Send email helper
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log('Email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

// Convenience functions
export async function sendWelcomeEmail(to: string, firstName: string) {
  const template = emailTemplates.welcome(firstName);
  return sendEmail({ to, ...template });
}

export async function sendCourseEnrollmentEmail(to: string, firstName: string, courseName: string) {
  const template = emailTemplates.courseEnrollment(firstName, courseName);
  return sendEmail({ to, ...template });
}

export async function sendCertificateEmail(to: string, firstName: string, certName: string, verificationUrl: string) {
  const template = emailTemplates.certificateEarned(firstName, certName, verificationUrl);
  return sendEmail({ to, ...template });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const template = emailTemplates.passwordReset(resetUrl);
  return sendEmail({ to, ...template });
}

