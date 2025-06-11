'use client';

import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, RotateCcw } from 'lucide-react';
import { Camera } from '@/types/cctv';
import { CameraCard } from '@/components/ui/camera-card';

interface CameraGridProps {
  cameras: Camera[];
}

function CameraGrid({ cameras }: CameraGridProps) {
  const handlePlayStream = (camera: Camera) => {
    console.log(`Playing stream for ${camera.name}`);
    // In a real app, this would open the video stream
  };

  const handleStopStream = (camera: Camera) => {
    console.log(`Stopping stream for ${camera.name}`);
    // In a real app, this would stop the video stream
  };

  const handleFullscreen = (camera: Camera) => {
    console.log(`Fullscreen for ${camera.name}`);
    // In a real app, this would open fullscreen view
  };

  const handleRefresh = (camera: Camera) => {
    console.log(`Refreshing ${camera.name}`);
    // In a real app, this would refresh the camera feed
  };

  const handleRefreshAll = () => {
    console.log('Refreshing all cameras');
    // In a real app, this would refresh all camera feeds
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Live Camera Feeds</h2>
        <Button variant="outline" size="sm" className="w-full sm:w-auto cursor-pointer" onClick={handleRefreshAll}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            variant="grid"
            onPlay={handlePlayStream}
            onStop={handleStopStream}
            onFullscreen={handleFullscreen}
            onRefresh={handleRefresh}
          />
        ))}
      </div>
      
      {cameras.length === 0 && (
        <div className="text-center py-12">
          <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cameras configured</h3>
          <p className="text-gray-500 mb-4">Add your first camera to start monitoring</p>
          <Button className="cursor-pointer">
            <CameraIcon className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>
      )}
    </div>
  );
}

export { CameraGrid };
