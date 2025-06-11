import { formatDistanceToNow, format } from 'date-fns';
import { Alert, Camera, Recording } from '@/types/cctv';

// Time and date utilities
export const formatTimeAgo = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

// Duration formatting utilities
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

export const formatDurationString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// File size utilities
export const formatFileSize = (sizeInMB: number): string => {
  if (sizeInMB >= 1024) {
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  }
  return `${sizeInMB.toFixed(1)} MB`;
};

// Storage utilities
export const calculateStoragePercentage = (used: number, total: number): number => {
  return Math.round((used / total) * 100);
};

export const getStorageStatus = (percentage: number): 'low' | 'medium' | 'high' => {
  if (percentage >= 90) return 'high';
  if (percentage >= 70) return 'medium';
  return 'low';
};

// Camera utilities
export const getOnlineCameraCount = (cameras: Camera[]): number => {
  return cameras.filter(camera => camera.isOnline).length;
};

export const getOfflineCameraCount = (cameras: Camera[]): number => {
  return cameras.filter(camera => !camera.isOnline).length;
};

export const getRecordingEnabledCount = (cameras: Camera[]): number => {
  return cameras.filter(camera => camera.recordingEnabled).length;
};

export const getCamerasByType = (cameras: Camera[], type: 'indoor' | 'outdoor'): Camera[] => {
  return cameras.filter(camera => camera.type === type);
};

export const getLastMotionDetected = (cameras: Camera[]): Date | undefined => {
  const camerasWithMotion = cameras
    .filter(cam => cam.lastMotionDetected)
    .sort((a, b) => (b.lastMotionDetected?.getTime() || 0) - (a.lastMotionDetected?.getTime() || 0));
  
  return camerasWithMotion[0]?.lastMotionDetected;
};

// Alert utilities
export const getUnreadAlertCount = (alerts: Alert[]): number => {
  return alerts.filter(alert => !alert.isRead).length;
};

export const getAlertsByType = (alerts: Alert[], type: Alert['type']): Alert[] => {
  return alerts.filter(alert => alert.type === type);
};

export const getAlertsBySeverity = (alerts: Alert[], severity: Alert['severity']): Alert[] => {
  return alerts.filter(alert => alert.severity === severity);
};

export const getUnreadAlerts = (alerts: Alert[]): Alert[] => {
  return alerts.filter(alert => !alert.isRead);
};

export const sortAlertsByDate = (alerts: Alert[], order: 'asc' | 'desc' = 'desc'): Alert[] => {
  return [...alerts].sort((a, b) => {
    const timeA = a.timestamp.getTime();
    const timeB = b.timestamp.getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
};

// Recording utilities
export const getRecordingsByCamera = (recordings: Recording[], cameraId: string): Recording[] => {
  return recordings.filter(recording => recording.cameraId === cameraId);
};

export const getRecordingsByType = (recordings: Recording[], type: Recording['type']): Recording[] => {
  return recordings.filter(recording => recording.type === type);
};

export const getTotalRecordingSize = (recordings: Recording[]): number => {
  return recordings.reduce((total, recording) => total + recording.size, 0);
};

export const getTotalRecordingDuration = (recordings: Recording[]): number => {
  return recordings.reduce((total, recording) => total + recording.duration, 0);
};

export const sortRecordingsByDate = (recordings: Recording[], order: 'asc' | 'desc' = 'desc'): Recording[] => {
  return [...recordings].sort((a, b) => {
    const timeA = a.startTime.getTime();
    const timeB = b.startTime.getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
};

// Filter utilities
export const filterRecordingsByDateRange = (
  recordings: Recording[], 
  startDate: Date, 
  endDate: Date
): Recording[] => {
  return recordings.filter(recording => 
    recording.startTime >= startDate && recording.startTime <= endDate
  );
};

export const filterRecordingsBySearch = (recordings: Recording[], searchTerm: string): Recording[] => {
  const term = searchTerm.toLowerCase();
  return recordings.filter(recording =>
    recording.cameraName.toLowerCase().includes(term) ||
    recording.filename.toLowerCase().includes(term) ||
    recording.type.toLowerCase().includes(term)
  );
};

export const filterAlertsByDateRange = (
  alerts: Alert[], 
  startDate: Date, 
  endDate: Date
): Alert[] => {
  return alerts.filter(alert => 
    alert.timestamp >= startDate && alert.timestamp <= endDate
  );
};

// Validation utilities
export const isValidStreamUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

export const isValidCameraName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const isValidLocation = (location: string): boolean => {
  return location.trim().length >= 2 && location.trim().length <= 100;
};

// Dashboard stats utilities
export const calculateDashboardStats = (
  cameras: Camera[], 
  recordings: Recording[], 
  alerts: Alert[]
) => {
  return {
    totalCameras: cameras.length,
    onlineCameras: getOnlineCameraCount(cameras),
    offlineCameras: getOfflineCameraCount(cameras),
    totalRecordings: recordings.length,
    storageUsed: getTotalRecordingSize(recordings) / 1024, // Convert MB to GB
    storageTotal: 500, // Default 500GB - should come from settings
    unreadAlerts: getUnreadAlertCount(alerts),
    lastMotionDetected: getLastMotionDetected(cameras)
  };
};
