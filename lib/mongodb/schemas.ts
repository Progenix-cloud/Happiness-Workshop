/**
 * MongoDB Schemas and Types
 */

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role: 'admin' | 'trainer' | 'volunteer' | 'participant' | 'partner' | 'donor' | 'rwa' | 'phd-scholar' | 'director' | 'co-admin';
  avatar?: string;
  bio?: string;
  phone?: string;
  company?: string;
  location?: string;
  happinessScore: number;
  certificatesCount: number;
  workshopsAttended: number;
  workshopsBooked: number;
  joyCoins: number; // 💰 JoyCoin balance for gamification
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
  // 🔗 Zoom Integration
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomJoinUrl?: string;
  joyCoinsReward: number; // 💰 JoyCoins awarded upon completion
  isProcessed: boolean; // Track if post-meeting rewards have been awarded
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

// 📊 ZOOM TRACKING SYSTEM
export interface IWorkshopParticipant {
  _id?: string;
  userId: string;
  workshopId: string;
  role: 'volunteer' | 'trainer' | 'participant'; // User role in this specific workshop
  joinTime?: Date;
  leaveTime?: Date;
  totalDurationMinutes: number;
  attendancePercentage: number;
  status: 'registered' | 'attended' | 'completed';
  certificateUnlocked: boolean; // 🎓 True when 75%+ attendance achieved
  joyCoinsAwarded: boolean; // 💰 True when JoyCoins have been credited
  createdAt: Date;
  updatedAt: Date;
}

export interface IRawZoomLog {
  _id?: string;
  payload: any; // Raw JSON from Zoom webhook
  eventType: string; // participant_joined, participant_left, meeting_ended
  receivedAt: Date;
}

// 🎯 JoyCoin Transaction System
export interface IJoyCoinTransaction {
  _id?: string;
  userId: string;
  amount: number; // Can be positive (earned) or negative (spent)
  type: 'workshop_attendance' | 'certificate_earned' | 'reward' | 'deduction';
  description: string;
  workshopId?: string; // Reference if related to a workshop
  balanceAfter: number; // Balance after this transaction
  createdAt: Date;
}
