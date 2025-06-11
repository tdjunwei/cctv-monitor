'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  Download, 
  Settings, 
  Activity,
  Clock,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Camera } from '@/types/cctv';
import { RTSPPlayer } from './rtsp-player';

interface StreamManagerProps {
  cameras: Camera[];
  className?: string;
}

interface ActiveStream {
  id: string;
  rtspUrl: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  startTime: string;
  outputPath?: string;
  viewers: number;
}

interface RecordingSession {
  recordingId: string;
  camera: {
    id: string;
    name: string;
    location: string;
  };
  outputPath: string;
  duration?: number;
  format: string;
  quality: string;
  startedAt: string;
}

export function StreamManager({ cameras, className = '' }: StreamManagerProps) {
  const [activeStreams, setActiveStreams] = useState<ActiveStream[]>([]);
  const [activeRecordings, setActiveRecordings] = useState<RecordingSession[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Fetch active streams from the server
   */
  const fetchActiveStreams = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/streams`);
      if (response.ok) {
        const data = await response.json();
        setActiveStreams(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch active streams:', error);
    }
  };

  /**
   * Start recording for a specific camera
   */
  const startRecording = async (camera: Camera, duration?: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/v1/streams/recording/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraId: camera.id,
          duration,
          format: 'mp4',
          quality: 'medium'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start recording');
      }

      const data = await response.json();
      const recordingData: RecordingSession = data.data;
      
      setActiveRecordings(prev => [...prev, recordingData]);
      
      console.log(`🔴 Recording started for ${camera.name}:`, recordingData.recordingId);

      // Auto-stop recording after duration if specified
      if (duration) {
        setTimeout(() => {
          stopRecording(recordingData.recordingId);
        }, duration * 1000);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Failed to start recording:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Stop an active recording
   */
  const stopRecording = async (recordingId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/streams/recording/${recordingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setActiveRecordings(prev => prev.filter(r => r.recordingId !== recordingId));
        console.log(`⏹️ Recording stopped: ${recordingId}`);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  /**
   * Generate thumbnail for a camera
   */
  const generateThumbnail = async (camera: Camera) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE}/api/v1/streams/thumbnail/${camera.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate thumbnail');
      }

      const data = await response.json();
      console.log(`📸 Thumbnail generated for ${camera.name}:`, data.data.thumbnailUrl);
      
      // You could display the thumbnail or update the camera object here
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Failed to generate thumbnail:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Test RTSP stream connectivity
   */
  const testStream = async (camera: Camera) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/v1/streams/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rtspUrl: camera.streamUrl,
          timeout: 10000
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Stream test failed');
      }

      const data = await response.json();
      const testResult = data.data;
      
      if (testResult.accessible) {
        console.log(`✅ Stream test successful for ${camera.name} (${testResult.responseTime}ms)`);
        setError(null);
      } else {
        setError(`Stream test failed for ${camera.name}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Stream test failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active streams periodically
  useEffect(() => {
    fetchActiveStreams();
    const interval = setInterval(fetchActiveStreams, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStreamForCamera = (cameraId: string): ActiveStream | undefined => {
    return activeStreams.find(stream => stream.id === cameraId);
  };

  const getRecordingForCamera = (cameraId: string): RecordingSession | undefined => {
    return activeRecordings.find(recording => recording.camera.id === cameraId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Active Streams Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Stream Manager
            <Badge variant="secondary">{activeStreams.length} active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeStreams.filter(s => s.status === 'running').length}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeRecordings.length}</div>
              <div className="text-sm text-muted-foreground">Recording</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {activeStreams.reduce((total, stream) => total + stream.viewers, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{cameras.filter(c => c.isOnline).length}</div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Grid with Streaming */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cameras.map((camera) => {
          const activeStream = getStreamForCamera(camera.id);
          const activeRecording = getRecordingForCamera(camera.id);

          return (
            <Card key={camera.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{camera.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {activeStream && (
                      <Badge variant={activeStream.status === 'running' ? 'default' : 'secondary'}>
                        <Activity className="h-3 w-3 mr-1" />
                        {activeStream.status}
                      </Badge>
                    )}
                    {activeRecording && (
                      <Badge variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        REC
                      </Badge>
                    )}
                    <Badge variant={camera.isOnline ? 'default' : 'destructive'}>
                      {camera.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Video Player */}
                <RTSPPlayer 
                  camera={camera}
                  autoPlay={false}
                  controls={true}
                  className="w-full"
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testStream(camera)}
                    disabled={isLoading || !camera.isOnline}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Test
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateThumbnail(camera)}
                    disabled={isLoading || !camera.isOnline}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Thumb
                  </Button>

                  {!activeRecording ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startRecording(camera, 300)} // 5 minutes
                      disabled={isLoading || !camera.isOnline}
                    >
                      <div className="h-3 w-3 mr-1 bg-red-500 rounded-full"></div>
                      Record
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => stopRecording(activeRecording.recordingId)}
                    >
                      <Square className="h-3 w-3 mr-1" />
                      Stop Rec
                    </Button>
                  )}
                </div>

                {/* Stream Info */}
                {activeStream && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Viewers: {activeStream.viewers}</div>
                    <div>Started: {new Date(activeStream.startTime).toLocaleTimeString()}</div>
                  </div>
                )}

                {/* Recording Info */}
                {activeRecording && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Recording: {activeRecording.format.toUpperCase()} ({activeRecording.quality})</div>
                    <div>Started: {new Date(activeRecording.startedAt).toLocaleTimeString()}</div>
                    {activeRecording.duration && (
                      <div>Duration: {formatDuration(activeRecording.duration)}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Recordings Summary */}
      {activeRecordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              Active Recordings
              <Badge variant="destructive">{activeRecordings.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeRecordings.map((recording) => (
                <div key={recording.recordingId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{recording.camera.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {recording.format.toUpperCase()} • {recording.quality} quality
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(recording.startedAt).toLocaleTimeString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => stopRecording(recording.recordingId)}
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
