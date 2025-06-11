'use client';

import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  Maximize, 
  RefreshCw, 
  Download,
  Trash2,
  Edit,
  PlayCircle,
  Settings
} from 'lucide-react';
import { Camera } from '@/types/cctv';

// Camera stream controls
interface CameraStreamControlsProps {
  camera: Camera;
  onPlay?: (camera: Camera) => void;
  onStop?: (camera: Camera) => void;
  onFullscreen?: (camera: Camera) => void;
  onRefresh?: (camera: Camera) => void;
  disabled?: boolean;
}

export function CameraStreamControls({ 
  camera, 
  onPlay, 
  onStop, 
  onFullscreen, 
  onRefresh, 
  disabled 
}: CameraStreamControlsProps) {
  return (
    <div className="flex space-x-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onPlay?.(camera)}
        disabled={!camera.isOnline || disabled}
        className={`${!camera.isOnline || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Play className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Play</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onStop?.(camera)}
        disabled={!camera.isOnline || disabled}
        className={`${!camera.isOnline || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Square className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Stop</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onFullscreen?.(camera)}
        disabled={!camera.isOnline || disabled}
        className={`${!camera.isOnline || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Maximize className="h-3 w-3" />
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onRefresh?.(camera)}
        className="cursor-pointer"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Camera management controls
interface CameraManagementControlsProps {
  camera: Camera;
  onEdit?: (camera: Camera) => void;
  onDelete?: (cameraId: string) => void;
  onToggleRecording?: (camera: Camera) => void;
  disabled?: boolean;
}

export function CameraManagementControls({ 
  camera, 
  onEdit, 
  onDelete, 
  onToggleRecording,
  disabled 
}: CameraManagementControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex space-x-2 flex-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(camera)}
          disabled={disabled}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleRecording?.(camera)}
          disabled={disabled}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Settings className="h-3 w-3 mr-1" />
          {camera.recordingEnabled ? 'Disable Rec' : 'Enable Rec'}
        </Button>
      </div>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete?.(camera.id)}
        disabled={disabled}
        className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  );
}

// Recording controls
interface RecordingControlsProps {
  recordingId: string;
  onPlay?: (recordingId: string) => void;
  onDownload?: (recordingId: string) => void;
  onDelete?: (recordingId: string) => void;
  disabled?: boolean;
}

export function RecordingControls({ 
  recordingId, 
  onPlay, 
  onDownload, 
  onDelete, 
  disabled 
}: RecordingControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPlay?.(recordingId)}
        disabled={disabled}
        className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <PlayCircle className="h-3 w-3 mr-1" />
        Play
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDownload?.(recordingId)}
        disabled={disabled}
        className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Download className="h-3 w-3 mr-1" />
        Download
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={`text-red-600 hover:text-red-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => onDelete?.(recordingId)}
        disabled={disabled}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Alert action controls
interface AlertActionControlsProps {
  alertId: string;
  isRead: boolean;
  onMarkAsRead?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  disabled?: boolean;
}

export function AlertActionControls({ 
  alertId, 
  isRead, 
  onMarkAsRead, 
  onDelete, 
  disabled 
}: AlertActionControlsProps) {
  return (
    <div className="flex space-x-2">
      {!isRead && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMarkAsRead?.(alertId)}
          disabled={disabled}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Mark as Read
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className={`text-red-600 hover:text-red-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => onDelete?.(alertId)}
        disabled={disabled}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
