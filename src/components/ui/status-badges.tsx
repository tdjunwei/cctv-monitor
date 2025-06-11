'use client';

import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Camera as CameraIcon,
  HardDrive
} from 'lucide-react';
import { Alert } from '@/types/cctv';

// Camera status badge component
interface CameraStatusBadgeProps {
  isOnline: boolean;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export function CameraStatusBadge({ isOnline, showText = true, size = 'sm' }: CameraStatusBadgeProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return isOnline ? (
    <Badge variant="outline" className={`text-green-600 border-green-600 ${textSize}`}>
      <Wifi className={`${iconSize} mr-1`} />
      {showText && <span className="hidden sm:inline">Online</span>}
    </Badge>
  ) : (
    <Badge variant="destructive" className={textSize}>
      <WifiOff className={`${iconSize} mr-1`} />
      {showText && <span className="hidden sm:inline">Offline</span>}
    </Badge>
  );
}

// Recording status indicator component
interface RecordingIndicatorProps {
  isRecording: boolean;
  variant?: 'badge' | 'overlay';
  showText?: boolean;
}

export function RecordingIndicator({ isRecording, variant = 'badge', showText = true }: RecordingIndicatorProps) {
  if (!isRecording) return null;

  if (variant === 'overlay') {
    return (
      <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>REC</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-600">
      <Eye className="h-3 w-3 mr-1" />
      {showText && <span>On</span>}
    </div>
  );
}

// Recording status toggle component
interface RecordingStatusProps {
  isRecording: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function RecordingStatus({ isRecording, onClick, disabled }: RecordingStatusProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span>Recording:</span>
      <button
        className="flex items-center cursor-pointer disabled:cursor-not-allowed"
        onClick={onClick}
        disabled={disabled}
      >
        {isRecording ? (
          <>
            <Eye className="h-3 w-3 mr-1 text-green-600" />
            <span className="text-green-600">On</span>
          </>
        ) : (
          <>
            <EyeOff className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-gray-400">Off</span>
          </>
        )}
      </button>
    </div>
  );
}

// Motion detection badge component
interface MotionDetectionBadgeProps {
  lastMotionDetected?: Date;
  variant?: 'overlay' | 'text';
}

export function MotionDetectionBadge({ lastMotionDetected, variant = 'overlay' }: MotionDetectionBadgeProps) {
  if (!lastMotionDetected) return null;

  if (variant === 'overlay') {
    return (
      <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
        <AlertTriangle className="h-3 w-3 inline mr-1" />
        Motion
      </div>
    );
  }

  return (
    <span className="text-xs text-muted-foreground">
      Last motion: {new Date().toLocaleDateString()}
    </span>
  );
}

// Alert severity badge component
interface SeverityBadgeProps {
  severity: Alert['severity'];
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

// Alert type icon component
interface AlertTypeIconProps {
  type: Alert['type'];
  className?: string;
}

export function AlertTypeIcon({ type, className = "h-4 w-4" }: AlertTypeIconProps) {
  switch (type) {
    case 'motion':
      return <CameraIcon className={className} />;
    case 'offline':
      return <WifiOff className={className} />;
    case 'recording_failed':
      return <AlertTriangle className={className} />;
    case 'storage_full':
      return <HardDrive className={className} />;
    default:
      return <AlertTriangle className={className} />;
  }
}

// Resolution badge component
interface ResolutionBadgeProps {
  resolution: string;
}

export function ResolutionBadge({ resolution }: ResolutionBadgeProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      {resolution}
    </Badge>
  );
}

// Camera type badge component
interface CameraTypeBadgeProps {
  type: 'indoor' | 'outdoor';
}

export function CameraTypeBadge({ type }: CameraTypeBadgeProps) {
  return (
    <Badge variant="outline" className="text-xs">
      {type}
    </Badge>
  );
}
