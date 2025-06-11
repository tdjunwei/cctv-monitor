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
  // ONVIF Support
  onvifEnabled: boolean;
  onvifHost?: string;
  onvifPort?: number;
  onvifUsername?: string;
  onvifPassword?: string;
  onvifProfileToken?: string;
  onvifCapabilities?: unknown;
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

// ONVIF-specific types
export interface ONVIFDevice {
  urn: string;
  name?: string;
  host: string;
  port: number;
  xaddrs: string[];
  scopes?: string[];
  types?: string[];
}

export interface ONVIFProfile {
  token: string;
  name: string;
  videoSourceConfiguration: unknown;
  videoEncoderConfiguration: unknown;
  ptzConfiguration?: unknown;
}

export interface ONVIFCapabilities {
  device?: unknown;
  media?: unknown;
  ptz?: unknown;
  imaging?: unknown;
  analytics?: unknown;
  events?: unknown;
}

export interface ONVIFCredentials {
  username: string;
  password: string;
}

export interface ONVIFDiscoveryResult {
  devices: ONVIFDevice[];
  error?: string;
}
