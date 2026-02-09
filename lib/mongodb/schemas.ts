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
  mode: 'online' | 'offline' | 'hybrid';
  maxCapacity: number;
  currentEnrollment: number;
  trainer: string; // user ID
  trainerName?: string;
  trainerBio?: string;
  trainerPhoto?: string; // URL to trainer photo
  trainerIntroVideo?: string; // URL to 20-30 sec intro video
  trainerContact?: {
    email?: string;
    phone?: string;
  };
  image?: string;
  materials?: string[]; // URLs to PDFs, videos, etc.
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  // ✨ Workshop Features & Learning
  workshopFeatures?: string[]; // List of workshop features/benefits
  learningObjectives?: string[]; // What participants will learn
  workshopMetrics?: {
    attendeeSatisfaction?: string; // e.g., "98%"
    skillsGained?: string[]; // Skills participants gain
    careerImpact?: string; // Impact on career/life
  };
  recordingUrl?: string; // URL to workshop recording for attended workshops
  // 🗺️ Location Details
  locationDetails?: {
    address?: string;
    city?: string;
    state?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    mapUrl?: string;
  };
  // ⭐ Ratings & Feedback
  averageRating: number;
  totalRatings: number;
  feedbackComments?: {
    userId: string;
    userName: string;
    userAvatar?: string;
    comment: string;
    rating: number;
    createdAt: Date;
  }[];
  // 📱 Social Engagement
  likes: string[]; // Array of user IDs who liked
  shares: number;
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
    registrationDetails?: {
      fullName?: string;
      email?: string;
      phone?: string;
      organization?: string;
      expectations?: string;
    };
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

// 🌟 MEMBER APPLICATION SYSTEM (Trainer & Volunteer)
export interface IMemberApplication {
  _id?: string;
  userId: string;
  applicationType: 'trainer' | 'volunteer';
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'interview_scheduled';
  
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  
  // Professional Information
  organization?: string;
  designation?: string;
  currentOccupation: string;
  
  // Trainer Specific Fields
  expertise?: string[];
  experience?: string;
  certifications?: string;
  trainingExperience?: string;
  previousWorkshops?: string;
  
  // Volunteer Specific Fields
  availability?: string;
  preferredActivities?: string[];
  volunteringExperience?: string;
  skills?: string[];
  motivation?: string;
  
  // Common Fields
  cvUrl: string; // PDF upload
  reasonForApplying: string;
  expectedContribution: string;
  references?: {
    name: string;
    contact: string;
    relationship: string;
  }[];
  
  // Timeline & Status Tracking
  timeline: {
    submitted: {
      date: Date;
      completed: boolean;
    };
    underReview: {
      date?: Date;
      completed: boolean;
    };
    approved: {
      date?: Date;
      completed: boolean;
      approvedBy?: string; // Admin ID
    };
    interviewScheduled: {
      date?: Date;
      completed: boolean;
      interviewDate?: Date;
      interviewTime?: string;
      interviewLink?: string;
      scheduledBy?: string; // Admin ID
    };
  };
  
  // Admin Actions
  adminNotes?: string;
  rejectionReason?: string;
  
  // Edit Lock
  isEditable: boolean; // False after admin approval
  
  createdAt: Date;
  updatedAt: Date;
}

// 🔔 Notification System
export interface INotification {
  _id?: string;
  userId: string;
  type: 'application_submitted' | 'application_approved' | 'application_rejected' | 'interview_scheduled' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // Application ID or Workshop ID
  actionUrl?: string;
  createdAt: Date;
}
