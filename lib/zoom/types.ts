/**
 * Zoom Webhook and API Types
 */

// 🎯 Zoom Webhook Event Types
export type ZoomWebhookEvent = 
  | 'meeting.ended'
  | 'meeting.participant_joined'
  | 'meeting.participant_left';

// 📥 Webhook Payload Structures
export interface ZoomWebhookPayload {
  event: ZoomWebhookEvent;
  payload: {
    account_id: string;
    object: ZoomMeetingObject | ZoomParticipantObject;
  };
  event_ts: number;
}

export interface ZoomMeetingObject {
  uuid: string;
  id: string; // Meeting ID
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
}

export interface ZoomParticipantObject extends ZoomMeetingObject {
  participant: {
    user_id: string;
    user_name: string; // Format: "Real Name__UID_123"
    id: string;
    join_time: string;
    leave_time?: string;
  };
}

// 📊 Zoom Reports API Response
export interface ZoomMeetingReport {
  uuid: string;
  id: number;
  topic: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_minutes: number;
  participants_count: number;
}

export interface ZoomParticipantReport {
  id: string;
  user_id: string;
  name: string; // Format: "Real Name__UID_123"
  user_email: string;
  join_time: string;
  leave_time: string;
  duration: number; // in seconds
  attentiveness_score?: string;
}

// 🔐 Zoom OAuth Token Response
export interface ZoomOAuthToken {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  scope: string;
}

// 🎯 Parsed User Data from Zoom
export interface ParsedZoomUser {
  displayName: string;
  ellipsisUserId: string | null; // Extracted from "__UID_123"
}
