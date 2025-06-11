export interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  isOnline: boolean;
  lastMotionDetected?: Date;
  recordingEnabled: boolean;
  resolution: string;
  type: 'indoor' | 'outdoor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Recording {
  id: string;
  cameraId: string;
  cameraName: string;
  filename: string;
  duration: number; // in seconds
  size: number; // in MB
  startTime: Date;
  endTime: Date;
  thumbnail?: string;
  type: 'scheduled' | 'motion' | 'manual';
}

export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  type: 'motion' | 'offline' | 'recording_failed' | 'storage_full';
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  timestamp: Date;
  thumbnail?: string;
}

export interface SystemSettings {
  recordingQuality: 'low' | 'medium' | 'high' | 'ultra';
  storageRetentionDays: number;
  motionSensitivity: number; // 1-10
  notificationsEnabled: boolean;
  emailAlerts: boolean;
  maxConcurrentStreams: number;
  nightVisionEnabled: boolean;
  audioRecordingEnabled: boolean;
}

export interface DashboardStats {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  totalRecordings: number;
  storageUsed: number; // in GB
  storageTotal: number; // in GB
  unreadAlerts: number;
  lastMotionDetected?: Date;
}
