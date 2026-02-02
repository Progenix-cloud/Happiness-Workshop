/**
 * MongoDB Schemas and Types
 */

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role: 'admin' | 'trainer' | 'volunteer' | 'participant';
  avatar?: string;
  bio?: string;
  phone?: string;
  company?: string;
  location?: string;
  happinessScore: number;
  certificatesCount: number;
  workshopsAttended: number;
  workshopsBooked: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkshop {
  _id?: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  location: string;
  maxCapacity: number;
  trainer: string; // user ID
  image?: string;
  materials?: string[]; // URLs to PDFs, videos, etc.
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  registrations: {
    userId: string;
    status: 'booked' | 'attended' | 'interested' | 'cancelled';
    registeredAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICertificate {
  _id?: string;
  userId: string;
  workshopId: string;
  workshopTitle: string;
  trainerName: string;
  issuedDate: Date;
  certificateNumber: string;
  downloadUrl?: string;
  status: 'pending' | 'issued' | 'shared';
  sharedOn?: string[]; // Social media platforms
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonial {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  workshopId: string;
  rating: number; // 1-5
  text: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeedback {
  _id?: string;
  userId: string;
  workshopId: string;
  rating: number; // 1-5
  comments: string;
  improvements?: string[];
  likelihood: number; // 1-10 (NPS)
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomRequest {
  _id?: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  workshopType: string;
  description: string;
  expectedParticipants: number;
  preferredDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalytics {
  _id?: string;
  date: Date;
  totalUsers: number;
  totalWorkshops: number;
  totalAttendances: number;
  averageHappiness: number;
  happinessTrend: {
    date: Date;
    score: number;
  }[];
  emotionBreakdown: {
    emoji: string;
    count: number;
    percentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailTemplate {
  to: string;
  subject: string;
  templateName: 'registration' | 'confirmation' | 'certificate' | 'feedback' | 'testimonial';
  data: Record<string, any>;
}
