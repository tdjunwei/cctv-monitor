'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Camera as CameraIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Wifi, 
  WifiOff,
  Eye,
  EyeOff
} from 'lucide-react';
import { Camera } from '@/types/cctv';
import { formatDistanceToNow } from 'date-fns';
import { DatabaseAPI } from '@/lib/database-client';

const cameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().min(1, 'Location is required'),
  streamUrl: z.string().url('Invalid stream URL'),
  resolution: z.enum(['720p', '1080p', '4K']),
  type: z.enum(['indoor', 'outdoor']),
  recordingEnabled: z.boolean()
});

type CameraFormData = z.infer<typeof cameraSchema>;

interface CameraManagementProps {
  cameras: Camera[];
  onCameraUpdate: (camera: Camera) => void;
  onCameraDelete: (cameraId: string) => void;
}

function CameraManagement({ cameras, onCameraUpdate, onCameraDelete }: CameraManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema)
  });

  const watchedValues = watch();

  const onSubmit = async (data: CameraFormData) => {
    try {
      if (editingCamera) {
        // Update existing camera via API
        const updatedCamera = await DatabaseAPI.updateCamera(editingCamera.id, {
          ...data,
          updatedAt: new Date()
        });
        onCameraUpdate(updatedCamera);
        setEditingCamera(null);
      } else {
        // Create new camera via API
        const newCamera = await DatabaseAPI.createCamera({
          ...data
        });
        onCameraUpdate(newCamera);
        setIsAddDialogOpen(false);
      }
      reset();
    } catch (error) {
      console.error('Error saving camera:', error);
      // TODO: Show error message to user
    }
  };

  const handleEdit = (camera: Camera) => {
    setEditingCamera(camera);
    setValue('name', camera.name);
    setValue('location', camera.location);
    setValue('streamUrl', camera.streamUrl);
    setValue('resolution', camera.resolution as '720p' | '1080p' | '4K');
    setValue('type', camera.type);
    setValue('recordingEnabled', camera.recordingEnabled);
  };

  const handleDelete = (cameraId: string) => {
    if (confirm('Are you sure you want to delete this camera?')) {
      onCameraDelete(cameraId);
    }
  };

  const toggleRecording = (camera: Camera) => {
    const updatedCamera: Camera = {
      ...camera,
      recordingEnabled: !camera.recordingEnabled,
      updatedAt: new Date()
    };
    onCameraUpdate(updatedCamera);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Camera Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Camera</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Camera Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Front Door"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="e.g., Main Entrance"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  {...register('streamUrl')}
                  placeholder="rtsp://192.168.1.100:554/stream"
                />
                {errors.streamUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.streamUrl.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Resolution</Label>
                  <Select onValueChange={(value) => setValue('resolution', value as '720p' | '1080p' | '4K')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="4K">4K</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.resolution && (
                    <p className="text-sm text-red-600 mt-1">{errors.resolution.message}</p>
                  )}
                </div>
                <div>
                  <Label>Camera Type</Label>
                  <Select onValueChange={(value) => setValue('type', value as 'indoor' | 'outdoor')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recordingEnabled"
                  {...register('recordingEnabled')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="recordingEnabled">Enable recording</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Camera'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Camera List */}
      <div className="grid gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id}>
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
                  {camera.isOnline ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      <Wifi className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Online</span>
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <WifiOff className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Offline</span>
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">{camera.resolution}</Badge>
                  <Badge variant="outline" className="text-xs">{camera.type}</Badge>
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
                      Added: {formatDistanceToNow(camera.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Recording:</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => toggleRecording(camera)}
                        >
                          {camera.recordingEnabled ? (
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
                        </Button>
                      </div>
                      {camera.lastMotionDetected && (
                        <p className="text-xs text-muted-foreground">
                          Last motion: {formatDistanceToNow(camera.lastMotionDetected, { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-1">
                    <h4 className="text-sm font-medium mb-2">Actions</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(camera)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        onClick={() => handleDelete(camera.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
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
        </div>
      )}

      {/* Edit Dialog */}
      {editingCamera && (
        <Dialog open={!!editingCamera} onOpenChange={() => setEditingCamera(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Camera: {editingCamera.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Camera Name</Label>
                  <Input
                    id="edit-name"
                    {...register('name')}
                    placeholder="e.g., Front Door"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    {...register('location')}
                    placeholder="e.g., Main Entrance"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-streamUrl">Stream URL</Label>
                <Input
                  id="edit-streamUrl"
                  {...register('streamUrl')}
                  placeholder="rtsp://192.168.1.100:554/stream"
                />
                {errors.streamUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.streamUrl.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Resolution</Label>
                  <Select 
                    value={watchedValues.resolution}
                    onValueChange={(value) => setValue('resolution', value as '720p' | '1080p' | '4K')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="4K">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Camera Type</Label>
                  <Select 
                    value={watchedValues.type}
                    onValueChange={(value) => setValue('type', value as 'indoor' | 'outdoor')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-recordingEnabled"
                  {...register('recordingEnabled')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-recordingEnabled">Enable recording</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingCamera(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Camera'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export { CameraManagement };
