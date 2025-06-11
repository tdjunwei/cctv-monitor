'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera as CameraIcon, WifiOff } from 'lucide-react';
import { Camera } from '@/types/cctv';
import { 
  CameraStatusBadge, 
  RecordingIndicator, 
  MotionDetectionBadge, 
  ResolutionBadge, 
  CameraTypeBadge 
} from '@/components/ui/status-badges';
import { CameraStreamControls, CameraManagementControls } from '@/components/ui/action-buttons';
import { formatTimeAgo } from '@/lib/utils/cctv-utils';

interface CameraCardProps {
  camera: Camera;
  variant?: 'grid' | 'management';
  onPlay?: (camera: Camera) => void;
  onStop?: (camera: Camera) => void;
  onFullscreen?: (camera: Camera) => void;
  onRefresh?: (camera: Camera) => void;
  onEdit?: (camera: Camera) => void;
  onDelete?: (cameraId: string) => void;
  onToggleRecording?: (camera: Camera) => void;
}

export function CameraCard({ 
  camera, 
  variant = 'grid',
  onPlay,
  onStop,
  onFullscreen,
  onRefresh,
  onEdit,
  onDelete,
  onToggleRecording
}: CameraCardProps) {
  if (variant === 'management') {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <CameraIcon className="h-5 w-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base truncate">{camera.name}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{camera.location}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <CameraStatusBadge isOnline={camera.isOnline} />
              <ResolutionBadge resolution={camera.resolution} />
              <CameraTypeBadge type={camera.type} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Stream Information</h4>
                <p className="text-xs text-muted-foreground break-all">{camera.streamUrl}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Added: {formatTimeAgo(camera.createdAt)}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Recording:</span>
                    <RecordingIndicator isRecording={camera.recordingEnabled} />
                  </div>
                  {camera.lastMotionDetected && (
                    <p className="text-xs text-muted-foreground">
                      Last motion: {formatTimeAgo(camera.lastMotionDetected)}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Actions</h4>
                <CameraManagementControls
                  camera={camera}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleRecording={onToggleRecording}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2 min-w-0 flex-1">
            <CameraIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{camera.name}</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0">
            <CameraStatusBadge isOnline={camera.isOnline} />
            <ResolutionBadge resolution={camera.resolution} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{camera.location}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Video Feed Placeholder */}
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {camera.isOnline ? (
            <>
              {/* Simulated video feed with overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
              <div className="text-white text-center z-10">
                <CameraIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Live Feed</p>
                <p className="text-xs opacity-50">{camera.name}</p>
              </div>
              
              {/* Recording indicator */}
              <RecordingIndicator isRecording={camera.recordingEnabled} variant="overlay" />
              
              {/* Motion detection */}
              <MotionDetectionBadge lastMotionDetected={camera.lastMotionDetected} variant="overlay" />
            </>
          ) : (
            <div className="text-center text-gray-400">
              <WifiOff className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Camera Offline</p>
              <p className="text-xs">Check connection</p>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CameraStreamControls
            camera={camera}
            onPlay={onPlay}
            onStop={onStop}
            onFullscreen={onFullscreen}
            onRefresh={onRefresh}
          />
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Resolution: {camera.resolution}</span>
            <span>•</span>
            <span className="capitalize">{camera.type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
