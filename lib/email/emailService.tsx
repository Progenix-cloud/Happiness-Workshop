/**
 * Email Service with SendGrid Integration
 * Supports mock mode for development
 */

import { config, isEmailEnabled } from '@/lib/config';

export type EmailTemplateType = 'registration' | 'confirmation' | 'certificate' | 'feedback' | 'testimonial' | 'workshop-request' | 'trainer-application';

export interface EmailPayload {
  to: string;
  templateType: EmailTemplateType;
  data: Record<string, any>;
}

/**
 * Generate HTML email templates
 */
export const emailTemplates = {
  registration: (data: Record<string, any>): string => {
    const { userName, workshopTitle, workshopDate, workshopTime } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0066cc 0%, #00d4ff 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .workshop-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc; margin: 20px 0; }
            .button { display: inline-block; background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Workshop Registration Confirmed! 😊</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Great news! You've successfully registered for our workshop.</p>
              
              <div class="workshop-card">
                <h2>${workshopTitle}</h2>
                <p><strong>Date:</strong> ${workshopDate}</p>
                <p><strong>Time:</strong> ${workshopTime}</p>
                <p>We're excited to see you there! This workshop will help you enhance your happiness and well-being through practical techniques and interactive sessions.</p>
              </div>

              <p>If you have any questions, feel free to reach out to us.</p>
              
              <a href="https://happiness-dashboard.com/my-workshops" class="button">View My Workshops</a>

              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  confirmation: (data: Record<string, any>): string => {
    const { userName, workshopTitle, attendanceStatus } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d084 0%, #00ff88 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; background: #00d084; color: white; padding: 8px 15px; border-radius: 20px; margin: 10px 0; }
            .button { display: inline-block; background: #00d084; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Workshop Status Updated! ✨</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your attendance status for ${workshopTitle} has been updated.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>New Status:</strong></p>
                <span class="status-badge">${attendanceStatus.toUpperCase()}</span>
              </div>

              <p>Thank you for participating in our well-being initiatives!</p>
              
              <a href="https://happiness-dashboard.com/my-certificates" class="button">View Your Certificates</a>

              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  certificate: (data: Record<string, any>): string => {
    const { userName, workshopTitle, trainerName, certificateNumber, issuedDate } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .cert-card { background: white; padding: 30px; border: 3px solid #7c3aed; border-radius: 8px; margin: 20px 0; text-align: center; }
            .cert-card h2 { color: #7c3aed; margin-bottom: 10px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Certificate Issued! 🎓</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Congratulations! You have successfully completed the workshop and earned a certificate.</p>
              
              <div class="cert-card">
                <h2>Certificate of Completion</h2>
                <p>This certifies that</p>
                <h3>${userName}</h3>
                <p>has successfully completed</p>
                <h3>${workshopTitle}</h3>
                <p><strong>Trainer:</strong> ${trainerName}</p>
                <p><strong>Certificate #:</strong> ${certificateNumber}</p>
                <p><strong>Issued:</strong> ${issuedDate}</p>
              </div>

              <p>You can now download and share your certificate on social media to showcase your achievement!</p>
              
              <a href="https://happiness-dashboard.com/my-certificates/${certificateNumber}" class="button">Download Certificate</a>

              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  feedback: (data: Record<string, any>): string => {
    const { userName, workshopTitle } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We'd Love Your Feedback! 📝</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for attending our workshop on ${workshopTitle}!</p>
              
              <p>Your feedback helps us improve and deliver better experiences. Please take 2 minutes to share your thoughts.</p>
              
              <a href="https://happiness-dashboard.com/feedback/${workshopTitle}" class="button">Provide Feedback</a>

              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  testimonial: (data: Record<string, any>): string => {
    const { userName, testimonialText, rating } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .testimonial-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ec4899; margin: 20px 0; }
            .button { display: inline-block; background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Testimonial! ⭐</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for sharing your experience and feedback!</p>
              
              <div class="testimonial-card">
                <p><strong>Your Rating:</strong> ${'⭐'.repeat(rating)}</p>
                <p>${testimonialText}</p>
              </div>

              <p>Your testimonial helps inspire others to join our well-being journey. We appreciate your support!</p>
              
              <a href="https://happiness-dashboard.com/testimonials" class="button">View All Testimonials</a>

              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'workshop-request': (data: Record<string, any>): string => {
    const { contactPerson, organizationName, preferredDate, preferredFormat, focusAreas } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f5576c; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Workshop Request Received</h1>
            </div>
            <div class="content">
              <p>Dear ${contactPerson},</p>
              <p>Thank you for requesting Ellipsis of Happiness Foundation to host a custom happiness and well-being workshop at your ${organizationName}.</p>
              
              <div class="info-box">
                <h3>Your Request Summary:</h3>
                <p><strong>Organization:</strong> ${organizationName}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                <p><strong>Format:</strong> ${preferredFormat}</p>
                <p><strong>Focus Areas:</strong> ${focusAreas}</p>
              </div>

              <p>We've received your request and will review the details to tailor the workshop to your needs. Our team will contact you shortly to finalize the arrangements.</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'trainer-application': (data: Record<string, any>): string => {
    const { fullName, expertise, experience, organization } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #333; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #fa709a; margin: 20px 0; }
            .benefits { background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Welcome to the Happiness Squad!</h1>
            </div>
            <div class="content">
              <p>Woohoo! 🎉</p>
              <p>Your interest in becoming a Happiness and Well-being Volunteer-Trainer has brightened our day! Thank you for wanting to spread joy, positivity, and well-being far and wide.</p>
              
              <div class="info-box">
                <h3>Your Application Summary:</h3>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Organization:</strong> ${organization}</p>
                <p><strong>Area of Expertise:</strong> ${expertise}</p>
                <p><strong>Experience:</strong> ${experience}</p>
              </div>

              <div class="benefits">
                <h3>What's Next?</h3>
                <ul>
                  <li>Our team will review your application</li>
                  <li>You'll be invited to attend an experiential orientation session</li>
                  <li>Upon approval, you'll lead workshops nationally</li>
                </ul>
              </div>

              <p>Keep an eye on your inbox for updates!</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },
};

/**
 * Send email via SendGrid or mock
 */
export const sendEmail = async (payload: EmailPayload): Promise<{ success: boolean; messageId?: string; preview?: string }> => {
  try {
    const template = emailTemplates[payload.templateType];
    const htmlContent = template(payload.data);

    if (!isEmailEnabled()) {
      // Mock mode - log to console and return preview
      console.log(`[MOCK EMAIL] To: ${payload.to}`);
      console.log(`[MOCK EMAIL] Template: ${payload.templateType}`);
      console.log(`[MOCK EMAIL] Data:`, payload.data);
      console.log(`[MOCK EMAIL] HTML Content:\n`, htmlContent);

      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        preview: htmlContent,
      };
    }

    // Real SendGrid integration
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.email.apiKey);

    const msg = {
      to: payload.to,
      from: config.email.fromEmail,
      subject: getEmailSubject(payload.templateType),
      html: htmlContent,
    };

    const response = await sgMail.send(msg);

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};

/**
 * Get email subject based on template type
 */
function getEmailSubject(templateType: EmailTemplateType): string {
  const subjects: Record<EmailTemplateType, string> = {
    registration: 'Workshop Registration Confirmed!',
    confirmation: 'Your Attendance Status Updated',
    certificate: 'Certificate Issued - Celebrate Your Achievement!',
    feedback: 'We\'d Love Your Feedback',
    testimonial: 'Thank You for Your Testimonial!',
    'workshop-request': 'Your Custom Happiness Workshop Request Details',
    'trainer-application': 'Welcome to the Happiness Squad! 🌟',
  };
  return subjects[templateType];
}

/**
 * Get email preview HTML (for displaying in UI)
 */
export const getEmailPreview = (templateType: EmailTemplateType, data: Record<string, any>): string => {
  const template = emailTemplates[templateType];
  return template(data);
};
