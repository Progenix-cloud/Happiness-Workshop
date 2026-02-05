# Happiness & Well-Being Dashboard - Setup Guide

## Overview

This is a complete end-to-end system for managing workshops, certifications, and well-being tracking with MongoDB, SendGrid, and configurable storage.

## Architecture

### Technology Stack
- **Frontend**: Next.js 16 with React 19
- **Backend**: Node.js with API Routes
- **Database**: MongoDB (with mock mode for development)
- **Email**: SendGrid (with mock mode for development)
- **Storage**: Local storage initially, AWS S3 ready via config toggle
- **Authentication**: Mock session-based auth with localStorage persistence
- **Charts**: Recharts for data visualization
- **UI**: shadcn/ui components with Tailwind CSS

## Configuration

### Config File: `/lib/config.ts`

All toggles are centralized in one configuration file:

```typescript
config = {
  database: {
    useMock: true,  // Toggle between mock and real MongoDB
    mongoUri: process.env.MONGODB_URI
  },
  email: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    sendEmails: false  // Toggle to true to actually send emails
  },
  storage: {
    type: 'local',  // 'local' or 'aws'
    aws: {
      enabled: false,
      // AWS credentials...
    }
  }
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# MongoDB (optional - only if useMock: false in config)
MONGODB_URI=mongodb://localhost:27017/happiness-dashboard

# SendGrid (optional - only if sendEmails: true in config)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@happiness-dashboard.com
SEND_EMAILS=false

# AWS S3 (optional - only if storage.type: 'aws' in config)
AWS_REGION=us-east-1
AWS_S3_BUCKET=happiness-dashboard-files
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 3. Configure Settings

Edit `/lib/config.ts` to toggle:

```typescript
// For development (mock everything)
database: { useMock: true }
email: { sendEmails: false }
storage: { type: 'local' }

// For production (real MongoDB + SendGrid + AWS)
database: { useMock: false }
email: { sendEmails: true }
storage: { type: 'aws' }
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Accounts

The system includes 4 pre-configured demo users with different roles:

| Email | Password | Role |
|-------|----------|------|
| admin@happiness.com | password123 | Admin |
| trainer@happiness.com | password123 | Trainer |
| volunteer@happiness.com | password123 | Volunteer |
| participant@happiness.com | password123 | Participant |

## Core Features

### 1. Authentication System (`/lib/auth/authService.ts`)

- Mock JWT-like token generation
- Session management with token verification
- Password validation (mock mode: always use "password123")
- User roles: Admin, Trainer, Volunteer, Participant

**Usage:**
```typescript
const session = await authService.login({ email, password });
const currentUser = await authService.getCurrentUser(token);
```

### 2. Database Service (`/lib/mongodb/db.ts`)

Abstracts operations for both mock and real MongoDB:

```typescript
// Works in both mock and real modes
const users = await db.users.findAll();
const workshop = await db.workshops.findById(id);
const certs = await db.certificates.findByUser(userId);
```

**Collections:**
- Users
- Workshops
- Certificates
- Testimonials
- Feedback
- Analytics

### 3. Email Service (`/lib/email/emailService.ts`)

Sends templated emails via SendGrid with 5 email templates:

- **registration**: Workshop signup confirmation
- **confirmation**: Attendance status update
- **certificate**: Certificate issuance
- **feedback**: Request for workshop feedback
- **testimonial**: Thank you for testimonial

**Usage:**
```typescript
await sendEmail({
  to: 'user@example.com',
  templateType: 'registration',
  data: {
    userName: 'John',
    workshopTitle: 'Mindfulness',
    workshopDate: '2024-02-15',
    workshopTime: '19:00'
  }
});
```

**Mock Mode Console Output:**
```
[MOCK EMAIL] To: user@example.com
[MOCK EMAIL] Template: registration
[MOCK EMAIL] Data: {...}
[MOCK EMAIL] HTML Content: <html>...</html>
```

### 4. Storage Service (`/lib/storage/storageService.ts`)

Handles file uploads for certificates and materials:

**Local Mode:**
- Uses sessionStorage for metadata
- Base64 encoding for file data
- Mock file URLs like `local://certificates/userId/filename.pdf`

**AWS Mode (ready to implement):**
- S3 bucket integration
- IAM authentication
- Presigned URLs for downloads

**Usage:**
```typescript
const file = await storageService.upload(blob, 'certificates/userId', 'cert.pdf');
await storageService.uploadCertificate(pdfBlob, userId, certificateNumber);
```

## Dashboard & Pages

### Role-Based Views

#### Admin Dashboard
- Overview with system analytics
- User management
- Workshop moderation
- Certificate management
- Email template previews

#### Trainer Dashboard
- My workshops
- Student list
- Attendance tracking
- Certificate generation
- Feedback analysis

#### Volunteer Dashboard
- Workshop assistance
- Activity log
- Testimonials viewing

#### Participant Dashboard
- Browse available workshops
- View my bookings
- Download certificates
- Submit feedback
- Write testimonials

### Key Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Login | Role selector + demo login |
| `/dashboard` | DashboardOverview | Main dashboard with analytics |
| `/dashboard/workshops` | WorkshopsPage | Browse and register for workshops |
| `/dashboard/certificates` | CertificatesPage | View, download, share certificates |
| `/dashboard/feedback` | FeedbackPage | Submit and view feedback |
| `/dashboard/testimonials` | TestimonialsPage | Write and read testimonials |
| `/dashboard/email-templates` | EmailTemplatesPreview | Preview all email templates |

## API Routes

All endpoints are in `/app/api/`:

```
POST   /auth/login              - User login
POST   /auth/signup             - User registration
GET    /workshops               - List workshops (with category filter)
POST   /workshops               - Create workshop
GET    /certificates            - User certificates
POST   /certificates            - Generate certificate
GET    /feedback                - Workshop feedback
POST   /feedback                - Submit feedback
GET    /testimonials            - Published testimonials
POST   /testimonials            - Submit testimonial
POST   /email/send              - Send email (preview or actual)
GET    /analytics               - System analytics
```

## Mock Data

Comes with pre-seeded data in `/lib/mongodb/mockData.ts`:

- **5 Users**: Admin, Trainer, Volunteer, 2 Participants
- **3 Workshops**: With various registrations and statuses
- **2 Certificates**: Issued to participants
- **2 Testimonials**: With ratings
- **1 Feedback**: With NPS score
- **Analytics Data**: Happiness trends and emotion breakdown

## Email Templates

### Email Preview System

Visit `/dashboard/email-templates` to preview all 5 email templates with:
- Live HTML preview
- Raw HTML source view
- Sample data reference
- Customizable template variables

### Template Customization

Edit templates in `/lib/email/emailService.ts`:

```typescript
registration: (data: Record<string, any>): string => {
  const { userName, workshopTitle, workshopDate, workshopTime } = data;
  return `
    <!DOCTYPE html>
    <html>
      {/* Your HTML here */}
    </html>
  `;
}
```

## Certificate Generation

### PDF Certificate Flow

1. User completes workshop
2. Admin/Trainer generates certificate
3. Certificate stored with storage service
4. PDF generated using HTML/CSS templates
5. User can download and share on social media

**Supported sharing:**
- Twitter (X)
- LinkedIn
- Facebook

## Switching Between Modes

### Development (All Mock)

```typescript
// config.ts
export const config = {
  database: { useMock: true },
  email: { sendEmails: false },
  storage: { type: 'local' },
};
```

- No external dependencies needed
- All data in memory
- Console logs for emails
- Local file storage

### Production (Real Services)

```typescript
// config.ts
export const config = {
  database: { useMock: false },
  email: { sendEmails: true },
  storage: { type: 'aws' },
};
```

Set environment variables:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/happiness
SENDGRID_API_KEY=SG.xxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
SEND_EMAILS=true
```

## Security Considerations

### Current Implementation (Mock Mode)
- Simple password storage (not hashed)
- Session tokens without expiration checks
- No rate limiting
- No CSRF protection

### Before Production

1. **Hash Passwords**: Use bcrypt
2. **Secure Sessions**: Implement proper JWT with expiration
3. **Rate Limiting**: Add rate limiting middleware
4. **CSRF Protection**: Add CSRF tokens
5. **Input Validation**: Validate all user inputs
6. **Environment Variables**: Never commit .env files
7. **HTTPS**: Enforce HTTPS in production
8. **Database**: Use MongoDB Atlas with authentication
9. **SendGrid**: Use API keys with restricted permissions
10. **AWS S3**: Use IAM roles with minimal permissions

## Troubleshooting

### "Module not found" errors

```bash
npm install
npm run dev
```

### Email not sending

1. Check if `SEND_EMAILS=true` in `.env.local`
2. Verify `SENDGRID_API_KEY` is set
3. Check console for `[MOCK EMAIL]` logs (mock mode)
4. Review SendGrid account for API key limits

### Database connection error

1. If `useMock: true`: No connection needed, check mock data
2. If `useMock: false`: Verify MongoDB URI in `.env.local`
3. Ensure MongoDB is running locally or connection string is correct

### Certificate download not working

1. Check `storage.type` in config
2. For AWS mode: Verify S3 bucket exists and credentials are correct
3. For local mode: Check browser console for storage errors

## Performance Tips

### Optimize Charts

Recharts components already included:
- Use `ResponsiveContainer` for responsive sizing
- Limit data points for large datasets
- Use `isAnimationActive={false}` for performance

### Database Optimization

When switching to real MongoDB:
- Add indexes on frequently queried fields
- Use pagination for large result sets
- Implement caching for analytics

### Storage Optimization

AWS S3:
- Use S3 lifecycle policies for old files
- Enable compression for PDFs
- Use CloudFront CDN for distribution

## Future Enhancements

1. Real-time notifications (Socket.io)
2. Advanced reporting and exports
3. Video playback for workshop materials
4. Social login (Google, GitHub)
5. Payment integration (Stripe)
6. Multi-language support
7. Dark mode theme
8. Mobile app (React Native)

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check console logs in mock mode
4. Verify configuration settings

## License

This project is for educational and demonstration purposes.
