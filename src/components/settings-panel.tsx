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
import { 
  Settings,
  Save,
  HardDrive,
  Bell,
  Camera,
  Shield,
  Mail,
  Moon,
  Volume2,
  Wifi
} from 'lucide-react';
import { SystemSettings } from '@/types/cctv';

const settingsSchema = z.object({
  recordingQuality: z.enum(['low', 'medium', 'high', 'ultra']),
  storageRetentionDays: z.number().min(1).max(365),
  motionSensitivity: z.number().min(1).max(10),
  maxConcurrentStreams: z.number().min(1).max(16),
  notificationsEnabled: z.boolean(),
  emailAlerts: z.boolean(),
  nightVisionEnabled: z.boolean(),
  audioRecordingEnabled: z.boolean()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// Mock current settings
const mockSettings: SystemSettings = {
  recordingQuality: 'high',
  storageRetentionDays: 30,
  motionSensitivity: 7,
  notificationsEnabled: true,
  emailAlerts: true,
  maxConcurrentStreams: 4,
  nightVisionEnabled: true,
  audioRecordingEnabled: false
};

function SettingsPanel() {
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      recordingQuality: settings.recordingQuality,
      storageRetentionDays: settings.storageRetentionDays,
      motionSensitivity: settings.motionSensitivity,
      maxConcurrentStreams: settings.maxConcurrentStreams,
      notificationsEnabled: settings.notificationsEnabled,
      emailAlerts: settings.emailAlerts,
      nightVisionEnabled: settings.nightVisionEnabled,
      audioRecordingEnabled: settings.audioRecordingEnabled
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSettings: SystemSettings = {
        ...settings,
        ...data
      };
      
      setSettings(updatedSettings);
      console.log('Settings saved:', updatedSettings);
      
      // Show success message (in a real app, you'd use a toast notification)
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      setValue('recordingQuality', 'medium');
      setValue('storageRetentionDays', 30);
      setValue('motionSensitivity', 5);
      setValue('maxConcurrentStreams', 4);
      setValue('notificationsEnabled', true);
      setValue('emailAlerts', false);
      setValue('nightVisionEnabled', true);
      setValue('audioRecordingEnabled', false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            System Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your CCTV monitoring system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recording Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Recording Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Recording Quality</Label>
                <Select 
                  value={watchedValues.recordingQuality}
                  onValueChange={(value) => setValue('recordingQuality', value as 'low' | 'medium' | 'high' | 'ultra')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (480p)</SelectItem>
                    <SelectItem value="medium">Medium (720p)</SelectItem>
                    <SelectItem value="high">High (1080p)</SelectItem>
                    <SelectItem value="ultra">Ultra (4K)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher quality uses more storage space
                </p>
              </div>

              <div>
                <Label htmlFor="maxStreams">Max Concurrent Streams</Label>
                <Input
                  id="maxStreams"
                  type="number"
                  min="1"
                  max="16"
                  {...register('maxConcurrentStreams', { valueAsNumber: true })}
                />
                {errors.maxConcurrentStreams && (
                  <p className="text-sm text-red-600 mt-1">{errors.maxConcurrentStreams.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="audioRecording"
                {...register('audioRecordingEnabled')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="audioRecording" className="flex items-center">
                <Volume2 className="h-4 w-4 mr-1" />
                Enable audio recording
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nightVision"
                {...register('nightVisionEnabled')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="nightVision" className="flex items-center">
                <Moon className="h-4 w-4 mr-1" />
                Enable night vision
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="retention">Storage Retention (Days)</Label>
              <Input
                id="retention"
                type="number"
                min="1"
                max="365"
                {...register('storageRetentionDays', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recordings older than this will be automatically deleted
              </p>
              {errors.storageRetentionDays && (
                <p className="text-sm text-red-600 mt-1">{errors.storageRetentionDays.message}</p>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Storage Usage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>45.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span>454.8 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '9%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motion Detection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Motion Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sensitivity">Motion Sensitivity</Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Low</span>
                <input
                  id="sensitivity"
                  type="range"
                  min="1"
                  max="10"
                  {...register('motionSensitivity', { valueAsNumber: true })}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">High</span>
                <span className="text-sm font-medium w-8">{watchedValues.motionSensitivity}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Higher sensitivity detects smaller movements but may cause false alarms
              </p>
              {errors.motionSensitivity && (
                <p className="text-sm text-red-600 mt-1">{errors.motionSensitivity.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                {...register('notificationsEnabled')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-1" />
                Enable push notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailAlerts"
                {...register('emailAlerts')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="emailAlerts" className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Enable email alerts
              </Label>
            </div>

            {watchedValues.emailAlerts && (
              <div className="ml-6">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue="user@example.com"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Wifi className="h-4 w-4 mr-2" />
              Network Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Network Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Connection:</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span>192.168.1.100</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span>8080</span>
                </div>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full">
              <Wifi className="h-4 w-4 mr-2" />
              Test Network Connection
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isSaving || !isDirty}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export { SettingsPanel };
