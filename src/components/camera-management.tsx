'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Camera as CameraIcon } from 'lucide-react';
import { Camera } from '@/types/cctv';
import { DatabaseAPI } from '@/lib/database-client';
import { CameraCard } from '@/components/ui/camera-card';
import { InputField, SelectField, CheckboxField } from '@/components/ui/form-fields';
import { ONVIFConfiguration } from '@/components/ui/onvif-configuration';

const cameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().min(1, 'Location is required'),
  streamUrl: z.string().url('Invalid stream URL'),
  resolution: z.enum(['720p', '1080p', '4K']),
  type: z.enum(['indoor', 'outdoor']),
  recordingEnabled: z.boolean(),
  // ONVIF Support
  onvifEnabled: z.boolean(),
  onvifHost: z.string().optional(),
  onvifPort: z.number().min(1).max(65535).optional(),
  onvifUsername: z.string().optional(),
  onvifPassword: z.string().optional()
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      recordingEnabled: true,
      onvifEnabled: false,
      onvifPort: 80
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: CameraFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCamera) {
        // Update existing camera
        const updatedCamera: Camera = {
          ...editingCamera,
          ...data,
          updatedAt: new Date()
        };
        await DatabaseAPI.updateCamera(editingCamera.id, updatedCamera);
        onCameraUpdate(updatedCamera);
        setEditingCamera(null);
      } else {
        // Create new camera
        const newCamera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'> = {
          ...data,
          isOnline: false
        };
        const createdCamera = await DatabaseAPI.createCamera(newCamera);
        onCameraUpdate(createdCamera);
        setIsAddDialogOpen(false);
      }
      reset();
    } catch (error) {
      console.error('Error saving camera:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
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
    // ONVIF fields
    setValue('onvifEnabled', camera.onvifEnabled);
    setValue('onvifHost', camera.onvifHost || '');
    setValue('onvifPort', camera.onvifPort || 80);
    setValue('onvifUsername', camera.onvifUsername || '');
    setValue('onvifPassword', camera.onvifPassword || '');
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

  const resolutionOptions = [
    { value: '720p', label: '720p' },
    { value: '1080p', label: '1080p' },
    { value: '4K', label: '4K' }
  ];

  const typeOptions = [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Camera Management</h2>
          <p className="text-sm text-muted-foreground">
            Configure and manage your security cameras
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Camera</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Camera Name"
                  id="name"
                  placeholder="e.g., Front Door"
                  required
                  error={errors.name}
                  register={register}
                />
                <InputField
                  label="Location"
                  id="location"
                  placeholder="e.g., Main Entrance"
                  required
                  error={errors.location}
                  register={register}
                />
                <InputField
                  label="Stream URL"
                  id="streamUrl"
                  placeholder="rtsp://192.168.1.100:554/stream"
                  required
                  error={errors.streamUrl}
                  register={register}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Resolution"
                  id="resolution"
                  required
                  error={errors.resolution}
                  options={resolutionOptions}
                  onValueChange={(value) => setValue('resolution', value as '720p' | '1080p' | '4K')}
                />
                <SelectField
                  label="Camera Type"
                  id="type"
                  required
                  error={errors.type}
                  options={typeOptions}
                  onValueChange={(value) => setValue('type', value as 'indoor' | 'outdoor')}
                />
              </div>

              <CheckboxField
                label="Enable recording"
                id="recordingEnabled"
                register={register('recordingEnabled')}
              />

              {/* ONVIF Configuration */}
              <ONVIFConfiguration
                onvifEnabled={watchedValues.onvifEnabled}
                onvifHost={watchedValues.onvifHost}
                onvifPort={watchedValues.onvifPort}
                onvifUsername={watchedValues.onvifUsername}
                onvifPassword={watchedValues.onvifPassword}
                onConfigChange={(config) => {
                  Object.entries(config).forEach(([key, value]) => {
                    if (value !== undefined) {
                      setValue(key as keyof CameraFormData, value);
                    }
                  });
                }}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
          <CameraCard
            key={camera.id}
            camera={camera}
            variant="management"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleRecording={toggleRecording}
          />
        ))}
      </div>
      
      {cameras.length === 0 && (
        <div className="text-center py-12">
          <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cameras configured</h3>
          <p className="text-gray-500 mb-4">Add your first camera to start monitoring</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}

      {/* Edit Camera Dialog */}
      {editingCamera && (
        <Dialog open={!!editingCamera} onOpenChange={() => setEditingCamera(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Camera: {editingCamera.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Camera Name"
                  id="edit-name"
                  placeholder="e.g., Front Door"
                  required
                  error={errors.name}
                  register={register}
                />
                <InputField
                  label="Location"
                  id="edit-location"
                  placeholder="e.g., Main Entrance"
                  required
                  error={errors.location}
                  register={register}
                />
              </div>

              <InputField
                label="Stream URL"
                id="edit-streamUrl"
                placeholder="rtsp://192.168.1.100:554/stream"
                required
                error={errors.streamUrl}
                register={register}
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Resolution"
                  id="edit-resolution"
                  required
                  error={errors.resolution}
                  options={resolutionOptions}
                  onValueChange={(value) => setValue('resolution', value as '720p' | '1080p' | '4K')}
                />
                <SelectField
                  label="Camera Type"
                  id="edit-type"
                  required
                  error={errors.type}
                  options={typeOptions}
                  onValueChange={(value) => setValue('type', value as 'indoor' | 'outdoor')}
                />
              </div>

              <CheckboxField
                label="Enable recording"
                id="edit-recordingEnabled"
                register={register('recordingEnabled')}
              />

              {/* ONVIF Configuration for Edit */}
              <ONVIFConfiguration
                onvifEnabled={watchedValues.onvifEnabled}
                onvifHost={watchedValues.onvifHost}
                onvifPort={watchedValues.onvifPort}
                onvifUsername={watchedValues.onvifUsername}
                onvifPassword={watchedValues.onvifPassword}
                onConfigChange={(config) => {
                  Object.entries(config).forEach(([key, value]) => {
                    if (value !== undefined) {
                      setValue(key as keyof CameraFormData, value);
                    }
                  });
                }}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingCamera(null)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
