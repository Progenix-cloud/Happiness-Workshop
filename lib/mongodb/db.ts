/**
 * Database Service Layer
 * Abstraction for both mock and real MongoDB operations
 */

import { isMockMode } from '@/lib/config';
import { mockDatabase } from './mockData';
import type {
  IUser,
  IWorkshop,
  ICertificate,
  ITestimonial,
  IFeedback,
  ICustomRequest,
  IAnalytics,
} from './schemas';

// Mock in-memory database
const memoryDb = JSON.parse(JSON.stringify(mockDatabase));

export const db = {
  // Users
  users: {
    findAll: async (): Promise<IUser[]> => {
      if (isMockMode()) {
        return memoryDb.users;
      }
      // Real MongoDB call would go here
      return memoryDb.users;
    },

    findById: async (id: string): Promise<IUser | null> => {
      if (isMockMode()) {
        return memoryDb.users.find((u: IUser) => u._id === id) || null;
      }
      return memoryDb.users.find((u: IUser) => u._id === id) || null;
    },

    findByEmail: async (email: string): Promise<IUser | null> => {
      if (isMockMode()) {
        return memoryDb.users.find((u: IUser) => u.email === email) || null;
      }
      return memoryDb.users.find((u: IUser) => u.email === email) || null;
    },

    findByRole: async (role: string): Promise<IUser[]> => {
      if (isMockMode()) {
        return memoryDb.users.filter((u: IUser) => u.role === role);
      }
      return memoryDb.users.filter((u: IUser) => u.role === role);
    },

    create: async (user: Omit<IUser, '_id'>): Promise<IUser> => {
      if (isMockMode()) {
        const newUser = { ...user, _id: String(memoryDb.users.length + 1) };
        memoryDb.users.push(newUser);
        return newUser;
      }
      return user as IUser;
    },

    update: async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
      if (isMockMode()) {
        const userIndex = memoryDb.users.findIndex((u: IUser) => u._id === id);
        if (userIndex > -1) {
          memoryDb.users[userIndex] = { ...memoryDb.users[userIndex], ...updates };
          return memoryDb.users[userIndex];
        }
      }
      return null;
    },
  },

  // Workshops
  workshops: {
    findAll: async (): Promise<IWorkshop[]> => {
      if (isMockMode()) {
        return memoryDb.workshops;
      }
      return memoryDb.workshops;
    },

    findById: async (id: string): Promise<IWorkshop | null> => {
      if (isMockMode()) {
        return memoryDb.workshops.find((w: IWorkshop) => w._id === id) || null;
      }
      return memoryDb.workshops.find((w: IWorkshop) => w._id === id) || null;
    },

    findByTrainer: async (trainerId: string): Promise<IWorkshop[]> => {
      if (isMockMode()) {
        return memoryDb.workshops.filter((w: IWorkshop) => w.trainer === trainerId);
      }
      return memoryDb.workshops.filter((w: IWorkshop) => w.trainer === trainerId);
    },

    findByCategory: async (category: string): Promise<IWorkshop[]> => {
      if (isMockMode()) {
        return memoryDb.workshops.filter((w: IWorkshop) => w.category === category);
      }
      return memoryDb.workshops.filter((w: IWorkshop) => w.category === category);
    },

    create: async (workshop: Omit<IWorkshop, '_id'>): Promise<IWorkshop> => {
      if (isMockMode()) {
        const newWorkshop = { ...workshop, _id: String(memoryDb.workshops.length + 1) };
        memoryDb.workshops.push(newWorkshop);
        return newWorkshop;
      }
      return workshop as IWorkshop;
    },

    update: async (id: string, updates: Partial<IWorkshop>): Promise<IWorkshop | null> => {
      if (isMockMode()) {
        const wsIndex = memoryDb.workshops.findIndex((w: IWorkshop) => w._id === id);
        if (wsIndex > -1) {
          memoryDb.workshops[wsIndex] = { ...memoryDb.workshops[wsIndex], ...updates };
          return memoryDb.workshops[wsIndex];
        }
      }
      return null;
    },
  },

  // Certificates
  certificates: {
    findAll: async (): Promise<ICertificate[]> => {
      if (isMockMode()) {
        return memoryDb.certificates;
      }
      return memoryDb.certificates;
    },

    findByUser: async (userId: string): Promise<ICertificate[]> => {
      if (isMockMode()) {
        return memoryDb.certificates.filter((c: ICertificate) => c.userId === userId);
      }
      return memoryDb.certificates.filter((c: ICertificate) => c.userId === userId);
    },

    create: async (cert: Omit<ICertificate, '_id'>): Promise<ICertificate> => {
      if (isMockMode()) {
        const newCert = { ...cert, _id: String(memoryDb.certificates.length + 1) };
        memoryDb.certificates.push(newCert);
        return newCert;
      }
      return cert as ICertificate;
    },
  },

  // Testimonials
  testimonials: {
    findAll: async (): Promise<ITestimonial[]> => {
      if (isMockMode()) {
        return memoryDb.testimonials.filter((t: ITestimonial) => t.isPublished);
      }
      return memoryDb.testimonials;
    },

    findByWorkshop: async (workshopId: string): Promise<ITestimonial[]> => {
      if (isMockMode()) {
        return memoryDb.testimonials.filter(
          (t: ITestimonial) => t.workshopId === workshopId && t.isPublished
        );
      }
      return memoryDb.testimonials;
    },

    create: async (testimonial: Omit<ITestimonial, '_id'>): Promise<ITestimonial> => {
      if (isMockMode()) {
        const newTestimonial = {
          ...testimonial,
          _id: String(memoryDb.testimonials.length + 1),
        };
        memoryDb.testimonials.push(newTestimonial);
        return newTestimonial;
      }
      return testimonial as ITestimonial;
    },
  },

  // Feedback
  feedback: {
    findAll: async (): Promise<IFeedback[]> => {
      if (isMockMode()) {
        return memoryDb.feedback;
      }
      return memoryDb.feedback;
    },

    findByWorkshop: async (workshopId: string): Promise<IFeedback[]> => {
      if (isMockMode()) {
        return memoryDb.feedback.filter((f: IFeedback) => f.workshopId === workshopId);
      }
      return memoryDb.feedback;
    },

    create: async (feedback: Omit<IFeedback, '_id'>): Promise<IFeedback> => {
      if (isMockMode()) {
        const newFeedback = { ...feedback, _id: String(memoryDb.feedback.length + 1) };
        memoryDb.feedback.push(newFeedback);
        return newFeedback;
      }
      return feedback as IFeedback;
    },
  },

  // Analytics
  analytics: {
    get: async (): Promise<IAnalytics> => {
      if (isMockMode()) {
        return memoryDb.analytics;
      }
      return memoryDb.analytics;
    },

    update: async (updates: Partial<IAnalytics>): Promise<IAnalytics> => {
      if (isMockMode()) {
        memoryDb.analytics = { ...memoryDb.analytics, ...updates };
        return memoryDb.analytics;
      }
      return memoryDb.analytics;
    },
  },
};
