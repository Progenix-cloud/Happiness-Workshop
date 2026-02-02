/**
 * Application Configuration
 * Centralized config for toggling mock data, storage, and services
 */

export const config = {
  // Database
  database: {
    useMock: true, // Set to false to use real MongoDB
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/happiness-dashboard',
  },

  // Email Service
  email: {
    provider: 'sendgrid', // 'sendgrid' or 'mock'
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'noreply@happiness-dashboard.com',
    sendEmails: process.env.SEND_EMAILS === 'true' ? true : false, // Toggle email sending
  },

  // Storage
  storage: {
    type: 'local', // 'local' or 'aws'
    local: {
      // Uses localStorage on client, sessionStorage backup
      enabled: true,
    },
    aws: {
      enabled: false,
      region: process.env.AWS_REGION || 'us-east-1',
      bucketName: process.env.AWS_S3_BUCKET || 'happiness-dashboard-files',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },

  // App Settings
  app: {
    siteName: 'Happiness & Well-Being Dashboard',
    logo: '😊',
    defaultRole: 'participant', // 'admin', 'trainer', 'volunteer', 'participant'
  },

  // Feature Flags
  features: {
    certificatesEnabled: true,
    feedbackEnabled: true,
    testimonialsEnabled: true,
    analyticsEnabled: true,
    customRequestsEnabled: true,
  },
};

export type Config = typeof config;

// Helper to check if using mock mode
export const isMockMode = (): boolean => config.database.useMock;

// Helper to check if email sending is enabled
export const isEmailEnabled = (): boolean => config.email.sendEmails;

// Helper to check storage type
export const isLocalStorage = (): boolean => config.storage.type === 'local';
