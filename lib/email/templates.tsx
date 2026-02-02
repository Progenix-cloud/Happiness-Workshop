export const emailTemplates = {
  'workshop-registration': {
    subject: 'Confirmation of Your Workshop Registration',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 20px; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; color: #666; }
            .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
            .info-box { background: #e8eef7; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>😊 Workshop Registration Confirmed</h1>
            </div>
            <div class="content">
              <h2>Dear Joyful Participant,</h2>
              <p>Thank you for registering for the happiness workshop! We're excited to have you join us on your journey to well-being.</p>
              
              <div class="info-box">
                <h3>Workshop Details:</h3>
                <p><strong>Workshop:</strong> ${data.workshopName}</p>
                <p><strong>Date & Time:</strong> ${data.date}</p>
                <p><strong>Location:</strong> ${data.venue}</p>
                <p><strong>Confirmation ID:</strong> ${data.confirmationId || 'CONF-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              <p>Please note that some venues may require Aadhaar card verification for security. We look forward to seeing you there!</p>
              
              <p>For any inquiries, feel free to contact us.</p>
              
              <p>Warm regards,<br/>
              <strong>Mrs. Rumy Arora</strong><br/>
              Director<br/>
              Ellipsis of Happiness Foundation<br/>
              📞 989-171-2003<br/>
              📧 info@ehappinessfoundation.in</p>
            </div>
            <div class="footer">
              <p>© 2024 Ellipsis of Happiness Foundation. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  'workshop-request': {
    subject: 'Your Custom Happiness Workshop Request Details',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 20px; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; color: #666; }
            .info-box { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Workshop Request Received</h1>
            </div>
            <div class="content">
              <h2>Dear ${data.contactPerson},</h2>
              <p>Thank you for requesting Ellipsis of Happiness Foundation to host a custom happiness and well-being workshop at your ${data.organizationName}.</p>
              
              <div class="info-box">
                <h3>Your Request Summary:</h3>
                <p><strong>Organization:</strong> ${data.organizationName}</p>
                <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
                <p><strong>Format:</strong> ${data.preferredFormat}</p>
                <p><strong>Expected Participants:</strong> ${data.numberOfParticipants}</p>
                <p><strong>Focus Areas:</strong> ${data.focusAreas}</p>
              </div>

              <p>We've received your request and will review the details to tailor the workshop to your needs. Our team will contact you shortly to finalize the arrangements.</p>
              
              <p>We will reach out soon to finalize arrangements. Looking forward to spreading happiness together!</p>
              
              <p>Warm regards,<br/>
              <strong>Mrs. Rumy Arora</strong><br/>
              Director<br/>
              Ellipsis of Happiness Foundation<br/>
              📞 989-171-2003</p>
            </div>
            <div class="footer">
              <p>© 2024 Ellipsis of Happiness Foundation. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  'trainer-application': {
    subject: 'Welcome to the Happiness Squad! 🌟',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 20px; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; color: #666; }
            .info-box { background: #f0f7ff; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
            .benefits { background: #e8f5e9; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Welcome to the Happiness Squad!</h1>
            </div>
            <div class="content">
              <h2>Woohoo! 🎉</h2>
              <p>Your interest in becoming a Happiness and Well-being Volunteer-Trainer at Ellipsis of Happiness Foundation has officially brightened our day! Thank you for wanting to spread joy, positivity, and well-being far and wide. The world needs more people like you!</p>
              
              <div class="info-box">
                <h3>Your Application Summary:</h3>
                <p><strong>Full Name:</strong> ${data.fullName}</p>
                <p><strong>Organization:</strong> ${data.organization}</p>
                <p><strong>Area of Expertise:</strong> ${data.expertise}</p>
                <p><strong>Experience:</strong> ${data.experience}</p>
              </div>

              <div class="benefits">
                <h3>What's Next?</h3>
                <ul>
                  <li>Our team of happiness enthusiasts is reviewing your application</li>
                  <li>You'll be invited to attend an experiential orientation session</li>
                  <li>Upon approval, you'll lead workshops nationally as a trainer</li>
                  <li>Join a growing community of like-minded happiness advocates</li>
                </ul>
              </div>

              <p>Sit tight! We're already doing a little happy dance 💃🕺 and we can't wait to see the impact you'll make!</p>
              
              <p>If you have any questions, feel free to reach out at 989-171-2003.</p>
              
              <p>With lots of smiles,<br/>
              <strong>Mrs. Rumy Arora</strong><br/>
              Director<br/>
              Ellipsis of Happiness Foundation<br/>
              📞 989-171-2003</p>
            </div>
            <div class="footer">
              <p>© 2024 Ellipsis of Happiness Foundation. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  'certificate-awarded': {
    subject: '🎖️ You\'ve Earned Your Certificate of Happiness!',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px; text-align: center; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; color: #666; }
            .cert-box { border: 3px solid #667eea; padding: 30px; margin: 20px 0; background: #fafafa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <h2>Certificate of Achievement</h2>
              <div class="cert-box">
                <p style="font-size: 18px; margin: 20px 0;"><strong>${data.participantName}</strong></p>
                <p>has successfully completed the workshop</p>
                <p style="font-size: 20px; font-style: italic; margin: 20px 0; color: #667eea;"><strong>${data.workshopName}</strong></p>
                <p>Completed on: ${data.completionDate}</p>
                <p style="margin-top: 30px; font-size: 12px; color: #999;">Certificate ID: ${data.certificateId}</p>
              </div>
              
              <p>Your dedication to your happiness and well-being journey is truly inspiring! We hope this certificate serves as a reminder of your commitment to personal growth and celebration of your milestone.</p>
              
              <p>Feel free to share your achievement on social media and inspire others!</p>
            </div>
            <div class="footer">
              <p>© 2024 Ellipsis of Happiness Foundation. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },
};

export function getEmailTemplate(templateName: string, data: any) {
  const template = emailTemplates[templateName as keyof typeof emailTemplates];
  if (!template) {
    console.warn(`Template '${templateName}' not found`);
    return { subject: 'Message', html: '<p>Message</p>' };
  }
  return {
    subject: template.subject,
    html: template.getHtml(data),
  };
}
