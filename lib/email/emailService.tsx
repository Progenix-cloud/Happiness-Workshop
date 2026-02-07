/**
 * Email Service with SendGrid Integration
 * Supports mock mode for development
 */

import { config, isEmailEnabled } from '@/lib/config';

export type EmailTemplateType = 'registration' | 'confirmation' | 'certificate' | 'feedback' | 'testimonial' | 'workshop-request' | 'trainer-application' | 'member-application-submitted' | 'member-application-approved' | 'member-application-rejected' | 'interview-scheduled' | 'workshop-zoom-reminder' | 'account-credentials';

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

  'member-application-submitted': (data: Record<string, any>): string => {
    const { fullName, applicationType } = data;
    const isTrainer = applicationType === 'trainer';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${isTrainer ? '#4f46e5' : '#10b981'} 0%, ${isTrainer ? '#7c3aed' : '#34d399'} 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .timeline { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Thank you for applying to become a ${isTrainer ? 'Trainer' : 'Volunteer'} with Ellipsis of Happiness Foundation!</p>
              
              <div class="timeline">
                <h3>What Happens Next?</h3>
                <ol>
                  <li><strong>Review:</strong> Our team will carefully review your application</li>
                  <li><strong>Approval:</strong> You'll be notified once your application is approved</li>
                  <li><strong>Interview:</strong> We'll schedule an orientation interview</li>
                  <li><strong>Onboarding:</strong> Get started with your journey!</li>
                </ol>
              </div>

              <p>You can track your application status anytime from your dashboard.</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'member-application-approved': (data: Record<string, any>): string => {
    const { fullName, applicationType } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .celebration { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎊 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              
              <div class="celebration">
                <h2>Your Application Has Been Approved! ✨</h2>
                <p>We're thrilled to welcome you as a ${applicationType === 'trainer' ? 'Trainer' : 'Volunteer'}!</p>
              </div>

              <p>Your passion and dedication to spreading happiness and well-being stood out to our team. We're excited to have you join our mission.</p>
              
              <p><strong>Next Steps:</strong></p>
              <p>We'll be scheduling an orientation interview soon to help you get started. Keep an eye on your email and dashboard for updates!</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'member-application-rejected': (data: Record<string, any>): string => {
    const { fullName, reason } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .reason-box { background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Thank you for your interest in joining Ellipsis of Happiness Foundation.</p>
              
              <div class="reason-box">
                <p><strong>Status:</strong> Unfortunately, we're unable to proceed with your application at this time.</p>
                ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ''}
              </div>

              <p>We truly appreciate your enthusiasm and encourage you to continue your journey in spreading happiness and well-being in your community.</p>
              
              <p>Feel free to reapply in the future or reach out to us if you have any questions.</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'interview-scheduled': (data: Record<string, any>): string => {
    const { fullName, interviewDate, interviewTime, interviewLink } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #8b5cf6; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Interview Scheduled!</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Great news! Your orientation interview has been scheduled.</p>
              
              <div class="details-box">
                <h3>Interview Details:</h3>
                <p><strong>📅 Date:</strong> ${interviewDate}</p>
                <p><strong>🕐 Time:</strong> ${interviewTime}</p>
                ${interviewLink ? `<p><strong>🔗 Meeting Link:</strong> <a href="${interviewLink}" style="color: #8b5cf6;">${interviewLink}</a></p>` : ''}
              </div>

              <p><strong>What to Expect:</strong></p>
              <ul>
                <li>An informal conversation about your interests and goals</li>
                <li>Overview of our programs and opportunities</li>
                <li>Q&A session to address any questions you may have</li>
                <li>Next steps in your onboarding journey</li>
              </ul>

              <p>Please mark your calendar and join us on time. We're excited to meet you!</p>
              
              ${interviewLink ? `<a href="${interviewLink}" class="button">Join Interview</a>` : ''}
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'workshop-zoom-reminder': (data: Record<string, any>): string => {
    const { participantName, workshopTitle, workshopDate, workshopTime, zoomJoinUrl, zoomMeetingId, zoomPassword } = data;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .zoom-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .credentials { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Workshop Starts in 30 Minutes!</h1>
            </div>
            <div class="content">
              <p>Hi ${participantName},</p>
              
              <div class="alert-box">
                <h2 style="margin: 0; color: #f59e0b;">⏰ Get Ready!</h2>
                <p style="font-size: 18px; margin: 10px 0;">Your workshop begins at <strong>${workshopTime}</strong></p>
              </div>

              <div class="zoom-box">
                <h3 style="color: #3b82f6; margin-top: 0;">📅 ${workshopTitle}</h3>
                <p><strong>Date:</strong> ${workshopDate}</p>
                <p><strong>Time:</strong> ${workshopTime}</p>
                
                <div style="margin: 20px 0; text-align: center;">
                  <a href="${zoomJoinUrl || '#'}" class="button">🎥 Join Zoom Meeting</a>
                </div>

                ${zoomMeetingId ? `
                  <div class="credentials">
                    <p><strong>Meeting ID:</strong> ${zoomMeetingId}</p>
                    ${zoomPassword ? `<p><strong>Password:</strong> ${zoomPassword}</p>` : ''}
                  </div>
                ` : ''}

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                  💡 <strong>Tip:</strong> Join a few minutes early to test your audio and video settings.
                </p>
              </div>

              <p><strong>Quick Checklist:</strong></p>
              <ul>
                <li>✅ Test your microphone and camera</li>
                <li>✅ Find a quiet, well-lit space</li>
                <li>✅ Have a pen and paper ready for notes</li>
                <li>✅ Come with an open mind and positive energy!</li>
              </ul>

              <p>We're excited to see you soon! If you have any technical issues, please reach out immediately.</p>
              
              <div class="footer">
                <p>Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
                <p>For support, contact: support@happiness-dashboard.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  'account-credentials': (data: Record<string, any>): string => {
    const { fullName, applicationType, email, temporaryPassword, loginUrl } = data;
    const roleColor = applicationType === 'trainer' ? '#0066cc' : '#00d084';
    const roleEmoji = applicationType === 'trainer' ? '👨‍🏫' : '🤝';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${roleColor} 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .credentials-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid ${roleColor}; }
            .credential-item { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; }
            .button { display: inline-block; background: ${roleColor}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${roleEmoji} Welcome to Your New Role!</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Congratulations! Your account has been created. You are now officially part of our team as a <strong>${applicationType.charAt(0).toUpperCase() + applicationType.slice(1)}</strong>!</p>
              
              <div class="credentials-box">
                <h3 style="color: ${roleColor}; margin-top: 0;">🔐 Your Login Credentials</h3>
                
                <div class="credential-item">
                  <p style="margin: 5px 0;"><strong>Email:</strong></p>
                  <p style="margin: 5px 0; font-size: 16px;">${email}</p>
                </div>

                <div class="credential-item">
                  <p style="margin: 5px 0;"><strong>Temporary Password:</strong></p>
                  <p style="margin: 5px 0; font-size: 16px;">${temporaryPassword}</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="${loginUrl || 'https://happiness-dashboard.com/login'}" class="button">Login Now</a>
                </div>
              </div>

              <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Important Security Note:</strong></p>
                <p style="margin: 5px 0;">Please change your password immediately after your first login. This temporary password should not be shared with anyone.</p>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Click the "Login Now" button above</li>
                <li>Use the provided credentials to sign in</li>
                <li>Change your password in Account Settings</li>
                <li>Complete your profile information</li>
                <li>Explore your${applicationType === 'trainer' ? ' trainer' : ' volunteer'} dashboard</li>
              </ol>

              <p><strong>What You Can Do Now:</strong></p>
              <ul>
                ${applicationType === 'trainer' ? `
                  <li>Create and manage workshops</li>
                  <li>Track participant engagement</li>
                  <li>Access training materials and resources</li>
                  <li>View feedback and testimonials</li>
                ` : `
                  <li>Browse volunteer opportunities</li>
                  <li>Sign up for events and activities</li>
                  <li>Track your volunteer hours</li>
                  <li>Connect with the community</li>
                `}
              </ul>

              <p>We're thrilled to have you on board! If you have any questions or need assistance, our team is here to help.</p>
              
              <div class="footer">
                <p>Mrs. Rumy Arora | Director | Ellipsis of Happiness Foundation | 989-171-2003</p>
                <p>For support: support@happiness-dashboard.com</p>
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
    'member-application-submitted': 'Application Received - Thank You!',
    'member-application-approved': 'Congratulations! Your Application is Approved',
    'member-application-rejected': 'Application Status Update',
    'interview-scheduled': 'Interview Scheduled - Next Steps',
    'workshop-zoom-reminder': '🔔 Workshop Starts in 30 Minutes - Zoom Link Inside',
    'account-credentials': '🎉 Your Account is Ready - Login Credentials',
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
