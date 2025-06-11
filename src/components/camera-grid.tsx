'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera as CameraIcon, 
  Wifi, 
  WifiOff, 
  Play, 
  Maximize,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { Camera } from '@/types/cctv';
import { formatDistanceToNow } from 'date-fns';

interface CameraGridProps {
  cameras: Camera[];
}

function CameraGrid({ cameras }: CameraGridProps) {
  const handlePlayStream = (camera: Camera) => {
    console.log(`Playing stream for ${camera.name}`);
    // In a real app, this would open the video stream
  };

  const handleFullscreen = (camera: Camera) => {
    console.log(`Fullscreen for ${camera.name}`);
    // In a real app, this would open fullscreen view
  };

  const handleRefresh = (camera: Camera) => {
    console.log(`Refreshing ${camera.name}`);
    // In a real app, this would refresh the camera feed
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Camera Feeds</h2>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <CameraIcon className="h-4 w-4" />
                  <span>{camera.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {camera.isOnline ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {camera.resolution}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{camera.location}</p>
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
                    {camera.recordingEnabled && (
                      <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>REC</span>
                      </div>
                    )}
                    
                    {/* Motion detection */}
                    {camera.lastMotionDetected && (
                      <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Motion
                      </div>
                    )}
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
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePlayStream(camera)}
                    disabled={!camera.isOnline}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleFullscreen(camera)}
                    disabled={!camera.isOnline}
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRefresh(camera)}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {camera.lastMotionDetected && (
                    <span>
                      Motion: {formatDistanceToNow(camera.lastMotionDetected, { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Camera Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Type: {camera.type}</span>
                <span>
                  Recording: {camera.recordingEnabled ? 'On' : 'Off'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {cameras.length === 0 && (
        <div className="text-center py-12">
          <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cameras configured</h3>
          <p className="text-gray-500 mb-4">Add your first camera to start monitoring</p>
          <Button>
            <CameraIcon className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>
      )}
    </div>
  );
}

export { CameraGrid };
