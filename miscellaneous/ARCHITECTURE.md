# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16 + React 19)            │
├─────────────────────────────────────────────────────────────────┤
│  Login Page → Auth Context → Dashboard (Sidebar + Main Content) │
│              ├── DashboardOverview (Analytics)                  │
│              ├── WorkshopsPage (Browse & Register)              │
│              ├── CertificatesPage (Download & Share)            │
│              ├── FeedbackPage (Submit & View)                   │
│              ├── TestimonialsPage (Write & Read)                │
│              └── EmailTemplatesPreview (Template Viewer)        │
└─────────────────────────────────────────────────────────────────┘
                            │
                   (API Calls via fetch)
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    API Layer (Route Handlers)                    │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/login       → AuthService.login()                   │
│  /api/auth/signup      → AuthService.signup()                  │
│  /api/workshops        → DB.workshops.findAll/create()         │
│  /api/certificates    → DB.certificates.find/create()         │
│  /api/feedback        → DB.feedback.find/create()             │
│  /api/testimonials    → DB.testimonials.find/create()         │
│  /api/email/send      → EmailService.sendEmail()              │
│  /api/analytics       → DB.analytics.get()                    │
└─────────────────────────────────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼──────────┐  ┌────────▼────────┐  ┌──────────▼──────┐
│ Database     │  │ Email Service   │  │ Storage Service │
│ Layer        │  │                 │  │                 │
└───┬──────────┘  └────────┬────────┘  └──────────┬──────┘
    │ Mock/Real   │ SendGrid/Mock │ Local/AWS S3 │
    │ MongoDB     │ Templates     │ Persistence  │
    └─────────────┴──────────────┘──────────────┘
```

## Data Flow Architecture

### Authentication Flow

```
User Login
   │
   ▼
[POST /api/auth/login]
   │
   ▼
[AuthService.login()]
   │
   ├─► Verify email in database
   ├─► Validate password (mock: always password123)
   ├─► Generate mock JWT token
   └─► Return user + token
   │
   ▼
[Browser localStorage]
   │
   ├─► auth_token (JWT)
   ├─► auth_user (JSON stringified user object)
   │
   ▼
[AuthContext updates]
   │
   ├─► Sets user state
   ├─► Sets token state
   └─► Redirects to /dashboard
```

### Workshop Registration Flow

```
User Clicks "Register"
   │
   ▼
[WorkshopsPage component]
   │
   ▼
[POST /api/workshops/{id}/register]
   │
   ▼
[Database update]
   │
   ├─► Add registration record
   ├─► Update workshop.registrations array
   │
   ▼
[Email Service]
   │
   ├─► Generate registration email HTML
   ├─► Mock mode: console.log("[MOCK EMAIL]...")
   ├─► Production: SendGrid API call
   │
   ▼
[UI updates with success message]
   │
   ├─► Registration confirmed
   ├─► Show certificate button
   └─► Update dashboard stats
```

### Certificate Generation & Download Flow

```
User Clicks "Download PDF"
   │
   ▼
[CertificatesPage.generatePDF()]
   │
   ▼
[Generate Certificate HTML]
   │
   ├─► Template with user data
   ├─► Certificate number
   ├─► Trainer name
   ├─► Issue date
   │
   ▼
[StorageService.uploadCertificate()]
   │
   ├─► Local mode:
   │   ├─► Base64 encode
   │   ├─► Store in sessionStorage
   │   └─► Return local:// URL
   │
   ├─► AWS mode:
   │   ├─► Upload to S3
   │   ├─► Generate presigned URL
   │   └─► Return S3 URL
   │
   ▼
[Browser print dialog / Download]
   │
   └─► User gets PDF
```

### Email Notification Flow

```
User Action (Register, Submit Feedback, etc.)
   │
   ▼
[Trigger Email Logic]
   │
   ▼
[POST /api/email/send]
   │
   ├─► Template Type: 'registration' | 'confirmation' | etc.
   ├─► Email Data: userName, workshopTitle, etc.
   │
   ▼
[emailService.sendEmail()]
   │
   ├─► Get template from emailTemplates object
   ├─► Generate HTML with provided data
   │
   ├─► Mock Mode (default):
   │   ├─► console.log("[MOCK EMAIL] To: ...", data)
   │   ├─► console.log("[MOCK EMAIL] HTML: ...", html)
   │   └─► Return { success: true, messageId: "mock_..." }
   │
   ├─► Production Mode:
   │   ├─► Initialize SendGrid client
   │   ├─► Create message object
   │   └─► sgMail.send(msg)
   │
   ▼
[Optional: preview endpoint]
   └─► Return HTML for in-app preview
```

## Configuration System

```
┌─────────────────────────────────────────┐
│      /lib/config.ts (Master Config)     │
├─────────────────────────────────────────┤
│                                         │
│  DATABASE                              │
│  ├── useMock: boolean                  │
│  │   ├─ true  → Memory-based           │
│  │   └─ false → MongoDB via URI        │
│  ├── mongoUri: string                  │
│  │   └─ process.env.MONGODB_URI        │
│  │                                     │
│  EMAIL                                 │
│  ├── provider: 'sendgrid' | 'mock'    │
│  ├── apiKey: from env                  │
│  ├── sendEmails: boolean               │
│  │   ├─ true  → Actually send via API  │
│  │   └─ false → Log to console         │
│  │                                     │
│  STORAGE                               │
│  ├── type: 'local' | 'aws'             │
│  │   ├─ 'local' → sessionStorage       │
│  │   └─ 'aws'   → S3 bucket            │
│  ├── aws:                              │
│  │   ├── region                        │
│  │   ├── bucketName                    │
│  │   ├── accessKeyId                   │
│  │   └── secretAccessKey               │
│  │                                     │
│  APP                                   │
│  ├── siteName                          │
│  ├── defaultRole                       │
│  │                                     │
│  FEATURES                              │
│  ├── certificatesEnabled               │
│  ├── feedbackEnabled                   │
│  ├── testimonialsEnabled               │
│  └── analyticsEnabled                  │
│                                         │
└─────────────────────────────────────────┘
          │
          ├──► Used by: AuthService
          ├──► Used by: Database Layer
          ├──► Used by: EmailService
          ├──► Used by: StorageService
          └──► Used by: Feature Flags
```

## Database Schema

### Collections

```
USERS
├─ _id: ObjectId
├─ email: string (unique)
├─ name: string
├─ password: string (hashed in production)
├─ role: 'admin' | 'trainer' | 'volunteer' | 'participant'
├─ avatar: string (URL)
├─ happinessScore: number (0-10)
├─ certificatesCount: number
├─ workshopsAttended: number
├─ workshopsBooked: number
└─ timestamps: createdAt, updatedAt

WORKSHOPS
├─ _id: ObjectId
├─ title: string
├─ description: string
├─ category: string
├─ date: Date
├─ time: string (HH:MM)
├─ duration: number (minutes)
├─ location: string
├─ maxCapacity: number
├─ trainer: ObjectId (reference to User)
├─ status: 'draft' | 'published' | 'completed' | 'cancelled'
├─ registrations: [{
│   ├─ userId: ObjectId
│   ├─ status: 'booked' | 'attended' | 'interested'
│   └─ registeredAt: Date
│ }]
└─ timestamps: createdAt, updatedAt

CERTIFICATES
├─ _id: ObjectId
├─ userId: ObjectId (reference to User)
├─ workshopId: ObjectId (reference to Workshop)
├─ workshopTitle: string
├─ trainerName: string
├─ issuedDate: Date
├─ certificateNumber: string (unique)
├─ downloadUrl: string (local or S3 URL)
├─ status: 'pending' | 'issued' | 'shared'
├─ sharedOn: ['twitter', 'linkedin', ...] (platforms)
└─ timestamps: createdAt, updatedAt

TESTIMONIALS
├─ _id: ObjectId
├─ userId: ObjectId (reference to User)
├─ userName: string
├─ userAvatar: string (URL)
├─ workshopId: ObjectId (reference to Workshop)
├─ rating: number (1-5)
├─ text: string
├─ isPublished: boolean
└─ timestamps: createdAt, updatedAt

FEEDBACK
├─ _id: ObjectId
├─ userId: ObjectId (reference to User)
├─ workshopId: ObjectId (reference to Workshop)
├─ rating: number (1-5)
├─ comments: string
├─ improvements: [string]
├─ likelihood: number (1-10, NPS score)
└─ timestamps: createdAt, updatedAt

ANALYTICS
├─ _id: ObjectId
├─ date: Date
├─ totalUsers: number
├─ totalWorkshops: number
├─ totalAttendances: number
├─ averageHappiness: number
├─ happinessTrend: [{
│   ├─ date: Date
│   └─ score: number
│ }]
├─ emotionBreakdown: [{
│   ├─ emoji: string
│   ├─ count: number
│   └─ percentage: number
│ }]
└─ timestamps: createdAt, updatedAt
```

## Role-Based Access Control (RBAC)

```
┌────────────────────────────────────────────────────────────────┐
│                    USER ROLES & PERMISSIONS                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ADMIN                                                          │
│ ├─ View all users                                             │
│ ├─ Manage all workshops                                       │
│ ├─ Approve/reject workshops                                   │
│ ├─ View analytics & reports                                   │
│ ├─ Generate certificates                                      │
│ ├─ Preview email templates                                    │
│ └─ System settings                                            │
│                                                                │
│ TRAINER                                                        │
│ ├─ Create my own workshops                                    │
│ ├─ View my workshop attendees                                 │
│ ├─ Mark attendance                                            │
│ ├─ Generate certificates for completed workshops             │
│ ├─ View feedback from my workshops                            │
│ └─ Manage training materials                                  │
│                                                                │
│ VOLUNTEER                                                      │
│ ├─ View workshops                                             │
│ ├─ Assist trainers with logistics                            │
│ ├─ Track activities                                           │
│ ├─ View participant testimonials                              │
│ └─ Report issues                                              │
│                                                                │
│ PARTICIPANT                                                    │
│ ├─ Browse workshops                                           │
│ ├─ Register for workshops                                     │
│ ├─ View my bookings                                           │
│ ├─ Download my certificates                                   │
│ ├─ Share certificates                                         │
│ ├─ Submit feedback                                            │
│ ├─ Write testimonials                                         │
│ └─ Update profile                                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout
├─ AuthProvider (Context)
└─ {children}
   ├─ page.tsx (Login)
   │  └─ LoginPage
   │     ├─ Demo User List
   │     └─ Manual Login Form
   │
   └─ dashboard/layout.tsx
      ├─ SidebarNav
      │  ├─ User Profile Card
      │  ├─ Navigation Items (role-based)
      │  └─ Logout Button
      │
      └─ {children}
         ├─ page.tsx (Dashboard)
         │  └─ DashboardOverview
         │     ├─ Header Stats
         │     ├─ Mental Health Chart
         │     ├─ Emotion Distribution
         │     └─ Workshop Status Cards
         │
         ├─ workshops/page.tsx
         │  └─ WorkshopsPage
         │     ├─ Category Filter
         │     └─ Workshop Grid
         │        └─ Workshop Card (Register)
         │
         ├─ certificates/page.tsx
         │  └─ CertificatesPage
         │     └─ Certificate List
         │        ├─ Download Button
         │        └─ Social Share Buttons
         │
         ├─ feedback/page.tsx
         │  └─ FeedbackPage
         │     ├─ Stats Cards
         │     ├─ Feedback Form
         │     └─ Feedback List
         │
         ├─ testimonials/page.tsx
         │  └─ TestimonialsPage
         │     ├─ Stats Cards
         │     ├─ Testimonial Form
         │     └─ Testimonials Grid
         │
         └─ email-templates/page.tsx
            └─ EmailTemplatesPreview
               ├─ Template List (Sidebar)
               ├─ Preview Button
               └─ HTML Preview + Source
```

## Data Abstraction Layer

```
┌──────────────────────────────────────────┐
│           Database Abstraction            │
│         (/lib/mongodb/db.ts)              │
├──────────────────────────────────────────┤
│                                          │
│  db.users                                │
│  ├─ findAll()                            │
│  ├─ findById(id)                         │
│  ├─ findByEmail(email)                   │
│  ├─ findByRole(role)                     │
│  ├─ create(user)                         │
│  └─ update(id, updates)                  │
│                                          │
│  db.workshops                            │
│  ├─ findAll()                            │
│  ├─ findById(id)                         │
│  ├─ findByTrainer(trainerId)             │
│  ├─ findByCategory(category)             │
│  ├─ create(workshop)                     │
│  └─ update(id, updates)                  │
│                                          │
│  db.certificates                         │
│  ├─ findAll()                            │
│  ├─ findByUser(userId)                   │
│  └─ create(certificate)                  │
│                                          │
│  db.testimonials                         │
│  ├─ findAll()                            │
│  ├─ findByWorkshop(workshopId)           │
│  └─ create(testimonial)                  │
│                                          │
│  db.feedback                             │
│  ├─ findAll()                            │
│  ├─ findByWorkshop(workshopId)           │
│  └─ create(feedback)                     │
│                                          │
│  db.analytics                            │
│  ├─ get()                                │
│  └─ update(updates)                      │
│                                          │
└──────────────────────────────────────────┘
         │
         ├─► Mock Mode: In-memory arrays
         │
         └─► Real Mode: MongoDB queries
             (MongoDB Atlas, local, etc.)
```

## API Response Format

```
Success Response:
{
  "status": 200,
  "data": { ... actual data ... },
  "message": "Operation successful"
}

Error Response:
{
  "status": 400/401/404/500,
  "error": "Descriptive error message"
}

Authentication Response:
{
  "user": {
    "_id": "...",
    "email": "...",
    "name": "...",
    "role": "...",
    ...
  },
  "token": "eyJhbGc...",
  "expiresAt": 1707283200000
}

Email Response (Mock):
{
  "success": true,
  "messageId": "mock_1707219600000",
  "preview": false
}

Email Response (Preview):
{
  "success": true,
  "html": "<html>...</html>",
  "preview": true
}

Analytics Response:
{
  "date": "2024-02-02",
  "totalUsers": 5,
  "totalWorkshops": 3,
  "totalAttendances": 6,
  "averageHappiness": 8.38,
  "happinessTrend": [...],
  "emotionBreakdown": [...]
}
```

## Performance Considerations

### Current Optimizations
- Mock data: O(1) lookups for small datasets
- No database queries in mock mode
- Email templates: Pre-defined HTML strings
- Charts: Recharts with reasonable data limits
- Storage: sessionStorage for metadata only

### Scalability Path
1. Add database indexing for frequently queried fields
2. Implement pagination for large result sets
3. Add caching layer (Redis)
4. Use CDN for static assets
5. Add GraphQL for efficient data fetching
6. Implement rate limiting for APIs
7. Add request queuing for email service
8. Use compression for PDF transfers

## Security Layers

```
Client Side:
├─ LocalStorage: Stores auth token
├─ Session: Token validation before API calls
└─ Validation: Form input validation

API Layer:
├─ Token Verification: Check token validity
├─ Rate Limiting: Prevent abuse (to implement)
├─ Input Sanitization: Validate all inputs
└─ Error Handling: No sensitive data in responses

Database Layer:
├─ Parameterized Queries: Prevent SQL injection
├─ Authentication: Database user credentials
├─ Authorization: Role-based access
└─ Encryption: Passwords hashed (bcrypt in prod)

Production Considerations:
├─ HTTPS: Enforce SSL/TLS
├─ CORS: Restrict cross-origin requests
├─ CSRF: Token-based protection
├─ XSS: Content Security Policy headers
└─ Data Privacy: GDPR compliance
```

This architecture allows for seamless transitions from development (mock) to production (real services) with minimal code changes through the centralized configuration system.
