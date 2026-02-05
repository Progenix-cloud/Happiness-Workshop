/**
 * Zoom API Service Layer
 * Handles all Zoom API interactions: OAuth, Reports, Signature Verification
 */

import crypto from 'crypto';
import { ZoomOAuthToken, ZoomMeetingReport, ZoomParticipantReport, ParsedZoomUser } from './types';

export class ZoomService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private readonly ZOOM_API_BASE = 'https://api.zoom.us/v2';
  private readonly ZOOM_OAUTH_URL = 'https://zoom.us/oauth/token';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly accountId: string,
    private readonly webhookSecretToken: string
  ) {}

  /**
   * 🔐 Get OAuth Access Token (Server-to-Server)
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(
      `${this.ZOOM_OAUTH_URL}?grant_type=account_credentials&account_id=${this.accountId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Zoom OAuth failed: ${response.statusText}`);
    }

    const data: ZoomOAuthToken = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early

    return this.accessToken;
  }

  /**
   * 🔍 Verify Zoom Webhook Signature
   * Prevents unauthorized webhook calls
   */
  verifyWebhookSignature(
    payload: string,
    timestamp: string,
    signature: string
  ): boolean {
    const message = `v0:${timestamp}:${payload}`;
    const hash = crypto
      .createHmac('sha256', this.webhookSecretToken)
      .update(message)
      .digest('hex');
    
    const expectedSignature = `v0=${hash}`;
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * 📊 Get Meeting Report (Post-Meeting)
   * This is the SOURCE OF TRUTH for attendance calculation
   */
  async getMeetingReport(meetingId: string): Promise<ZoomMeetingReport> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.ZOOM_API_BASE}/report/meetings/${meetingId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch meeting report: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 👥 Get Meeting Participants Report
   * Returns detailed attendance data for each participant
   */
  async getParticipantsReport(meetingId: string): Promise<ZoomParticipantReport[]> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.ZOOM_API_BASE}/report/meetings/${meetingId}/participants?page_size=300`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch participants report: ${response.statusText}`);
    }

    const data = await response.json();
    return data.participants || [];
  }

  /**
   * 🎯 Parse User ID from Zoom Display Name
   * Format: "John Doe__UID_123" → { displayName: "John Doe", ellipsisUserId: "123" }
   */
  parseZoomUserName(zoomName: string): ParsedZoomUser {
    const parts = zoomName.split('__UID_');
    
    if (parts.length === 2) {
      return {
        displayName: parts[0],
        ellipsisUserId: parts[1],
      };
    }

    // No UID tag found (user joined without going through our system)
    return {
      displayName: zoomName,
      ellipsisUserId: null,
    };
  }

  /**
   * 💰 Calculate Attendance Percentage
   */
  calculateAttendancePercentage(
    attendedMinutes: number,
    totalWorkshopMinutes: number
  ): number {
    if (totalWorkshopMinutes === 0) return 0;
    return Math.round((attendedMinutes / totalWorkshopMinutes) * 100);
  }

  /**
   * 🎓 Check if User Qualifies for Certificate
   * Rule: 75% or more attendance
   */
  qualifiesForCertificate(attendancePercentage: number): boolean {
    return attendancePercentage >= 75;
  }
}

// 🌐 Export singleton instance
export const zoomService = new ZoomService(
  process.env.ZOOM_CLIENT_ID || '',
  process.env.ZOOM_CLIENT_SECRET || '',
  process.env.ZOOM_ACCOUNT_ID || '',
  process.env.ZOOM_WEBHOOK_SECRET || ''
);
