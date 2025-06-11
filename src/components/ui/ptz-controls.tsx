'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Home,
  Loader2
} from 'lucide-react';
import { Camera } from '@/types/cctv';

interface PTZControlsProps {
  camera: Camera;
  className?: string;
}

type PTZDirection = 'up' | 'down' | 'left' | 'right' | 'zoom_in' | 'zoom_out' | 'stop';

export function PTZControls({ camera, className }: PTZControlsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeCommand, setActiveCommand] = useState<PTZDirection | null>(null);

  const handlePTZCommand = async (direction: PTZDirection) => {
    if (!camera.onvifEnabled || isLoading) {
      return;
    }

    setIsLoading(true);
    setActiveCommand(direction);

    try {
      const response = await fetch(`/api/cameras/${camera.id}/onvif/ptz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        throw new Error('PTZ command failed');
      }

      // For continuous movements, add a delay before stopping
      if (['up', 'down', 'left', 'right', 'zoom_in', 'zoom_out'].includes(direction)) {
        setTimeout(async () => {
          try {
            await fetch(`/api/cameras/${camera.id}/onvif/ptz`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ direction: 'stop' }),
            });
          } catch (error) {
            console.error('Failed to stop PTZ movement:', error);
          }
        }, 500); // Stop after 500ms
      }
    } catch (error) {
      console.error('PTZ command failed:', error);
      // TODO: Show error toast to user
    } finally {
      setIsLoading(false);
      setActiveCommand(null);
    }
  };

  const handlePresetGoto = async (presetToken: string) => {
    if (!camera.onvifEnabled || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/cameras/${camera.id}/onvif/ptz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          direction: 'preset',
          presetToken 
        }),
      });

      if (!response.ok) {
        throw new Error('Preset goto failed');
      }
    } catch (error) {
      console.error('Preset goto failed:', error);
      // TODO: Show error toast to user
    } finally {
      setIsLoading(false);
    }
  };

  if (!camera.onvifEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">PTZ Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ONVIF not enabled for this camera
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">PTZ Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Directional Controls */}
        <div className="grid grid-cols-3 gap-1">
          {/* Top Row */}
          <div />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('up')}
            disabled={isLoading}
            className="aspect-square p-0"
          >
            {isLoading && activeCommand === 'up' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
          <div />

          {/* Middle Row */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('left')}
            disabled={isLoading}
            className="aspect-square p-0"
          >
            {isLoading && activeCommand === 'left' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('stop')}
            disabled={isLoading}
            className="aspect-square p-0"
          >
            {isLoading && activeCommand === 'stop' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('right')}
            disabled={isLoading}
            className="aspect-square p-0"
          >
            {isLoading && activeCommand === 'right' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>

          {/* Bottom Row */}
          <div />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('down')}
            disabled={isLoading}
            className="aspect-square p-0"
          >
            {isLoading && activeCommand === 'down' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
          <div />
        </div>

        {/* Zoom Controls */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('zoom_in')}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading && activeCommand === 'zoom_in' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <ZoomIn className="h-4 w-4 mr-1" />
            )}
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePTZCommand('zoom_out')}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading && activeCommand === 'zoom_out' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <ZoomOut className="h-4 w-4 mr-1" />
            )}
            Zoom Out
          </Button>
        </div>

        {/* Home Position */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetGoto('1')}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Home className="h-4 w-4 mr-1" />
          )}
          Home Position
        </Button>
      </CardContent>
    </Card>
  );
}
