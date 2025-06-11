'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCcw,
  Settings,
  Download,
  AlertCircle
} from 'lucide-react';
import { Camera } from '@/types/cctv';

interface RTSPPlayerProps {
  camera: Camera;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  className?: string;
  onStreamStart?: () => void;
  onStreamStop?: () => void;
  onStreamError?: (error: string) => void;
}

interface StreamInfo {
  streamId: string;
  streamUrl: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  startedAt: string;
}

export function RTSPPlayer({
  camera,
  autoPlay = false,
  controls = true,
  muted = false,
  className = '',
  onStreamStart,
  onStreamStop,
  onStreamError
}: RTSPPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Start streaming the camera's RTSP feed
   */
  const startStream = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🎬 Starting stream for camera ${camera.id}: ${camera.name}`);

      const response = await fetch(`${API_BASE}/api/v1/streams/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraId: camera.id,
          format: 'hls',
          preset: 'faster',
          resolution: camera.resolution === '4K' ? '3840x2160' : 
                     camera.resolution === '1080p' ? '1920x1080' : '1280x720'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start stream');
      }

      const data = await response.json();
      const streamData: StreamInfo = data.data;
      
      setStreamInfo(streamData);
      
      // Load the HLS stream
      if (videoRef.current && streamData.streamUrl) {
        const video = videoRef.current;
        
        // Check if HLS.js is supported
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = streamData.streamUrl;
        } else {
          // Use HLS.js for other browsers
          await loadHLSStream(streamData.streamUrl);
        }
        
        video.muted = isMuted;
        video.volume = volume;
        
        if (autoPlay) {
          await video.play();
          setIsPlaying(true);
        }
      }

      setRetryCount(0);
      onStreamStart?.();
      console.log(`✅ Stream started successfully for ${camera.name}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to start stream:', errorMessage);
      setError(errorMessage);
      onStreamError?.(errorMessage);
      
      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying stream start (${retryCount + 1}/${maxRetries}) in 3 seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          startStream();
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load HLS stream using HLS.js
   */
  const loadHLSStream = async (streamUrl: string) => {
    return new Promise<void>((resolve, reject) => {
      // Dynamically import HLS.js
      import('hls.js').then((HLS) => {
        const video = videoRef.current;
        if (!video) {
          reject(new Error('Video element not found'));
          return;
        }

        if (HLS.default.isSupported()) {
          const hls = new HLS.default({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          
          hls.on(HLS.default.Events.MANIFEST_PARSED, () => {
            console.log('✅ HLS manifest parsed successfully');
            resolve();
          });
          
          hls.on(HLS.default.Events.ERROR, (event, data) => {
            console.error('❌ HLS error:', data);
            if (data.fatal) {
              reject(new Error(`HLS fatal error: ${data.type}`));
            }
          });
          
          // Store HLS instance for cleanup
          (video as any).hls = hls;
        } else {
          reject(new Error('HLS.js not supported'));
        }
      }).catch(reject);
    });
  };

  /**
   * Stop the stream
   */
  const stopStream = async () => {
    try {
      setIsLoading(true);
      
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.src = '';
        
        // Cleanup HLS.js if used
        if ((video as any).hls) {
          (video as any).hls.destroy();
          (video as any).hls = null;
        }
      }

      if (streamInfo) {
        const response = await fetch(`${API_BASE}/api/v1/streams/${streamInfo.streamId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.warn('Failed to stop stream on server, but local playback stopped');
        }
      }

      setIsPlaying(false);
      setStreamInfo(null);
      setError(null);
      onStreamStop?.();
      console.log(`🛑 Stream stopped for ${camera.name}`);

    } catch (error) {
      console.error('❌ Error stopping stream:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle play/pause
   */
  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!streamInfo) {
        await startStream();
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  /**
   * Handle volume change
   */
  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  /**
   * Refresh/restart stream
   */
  const refreshStream = async () => {
    await stopStream();
    setTimeout(() => {
      startStream();
    }, 1000);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoPlay && camera.streamUrl) {
      startStream();
    }

    // Cleanup on unmount
    return () => {
      if (streamInfo) {
        stopStream();
      }
    };
  }, [camera.id]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => console.log('📡 Video load started');
    const handleCanPlay = () => console.log('✅ Video can play');
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      const error = (e.target as HTMLVideoElement).error;
      const errorMessage = `Video error: ${error?.message || 'Unknown error'}`;
      console.error('❌', errorMessage);
      setError(errorMessage);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {camera.name}
            {streamInfo && (
              <Badge variant={streamInfo.status === 'running' ? 'default' : 'secondary'}>
                {streamInfo.status}
              </Badge>
            )}
          </CardTitle>
          <Badge variant={camera.isOnline ? 'default' : 'destructive'}>
            {camera.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Video Container */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls={false}
            playsInline
            preload="none"
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Starting stream...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center max-w-xs p-4">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                <p className="text-sm">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={refreshStream}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* No Stream Overlay */}
          {!streamInfo && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Click play to start stream</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {controls && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={togglePlayPause}
                disabled={isLoading || !camera.isOnline}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={stopStream}
                disabled={!streamInfo || isLoading}
              >
                <Square className="h-3 w-3" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={toggleMute}
                disabled={!streamInfo}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshStream}
                disabled={isLoading}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={toggleFullscreen}
                disabled={!streamInfo}
              >
                {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        )}

        {/* Stream Info */}
        {streamInfo && (
          <Alert>
            <AlertDescription className="text-xs">
              <strong>Stream URL:</strong> {streamInfo.streamUrl}<br />
              <strong>Started:</strong> {new Date(streamInfo.startedAt).toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
