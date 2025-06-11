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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold flex items-center">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            System Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure your CCTV monitoring system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Recording Settings */}
        <Card>
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Recording Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">Recording Quality</Label>
                <Select 
                  value={watchedValues.recordingQuality}
                  onValueChange={(value) => setValue('recordingQuality', value as 'low' | 'medium' | 'high' | 'ultra')}
                >
                  <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
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
                  Higher quality uses more storage
                </p>
              </div>

              <div>
                <Label htmlFor="maxStreams" className="text-xs sm:text-sm">Max Concurrent Streams</Label>
                <Input
                  id="maxStreams"
                  type="number"
                  min="1"
                  max="16"
                  className="h-8 sm:h-10 text-xs sm:text-sm"
                  {...register('maxConcurrentStreams', { valueAsNumber: true })}
                />
                {errors.maxConcurrentStreams && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.maxConcurrentStreams.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="audioRecording"
                  {...register('audioRecordingEnabled')}
                  className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
                />
                <Label htmlFor="audioRecording" className="flex items-center text-xs sm:text-sm">
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Enable audio recording
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nightVision"
                  {...register('nightVisionEnabled')}
                  className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
                />
                <Label htmlFor="nightVision" className="flex items-center text-xs sm:text-sm">
                  <Moon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Enable night vision
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <HardDrive className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Storage Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="retention" className="text-xs sm:text-sm">Storage Retention (Days)</Label>
              <Input
                id="retention"
                type="number"
                min="1"
                max="365"
                className="h-8 sm:h-10 text-xs sm:text-sm"
                {...register('storageRetentionDays', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recordings older than this will be automatically deleted
              </p>
              {errors.storageRetentionDays && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.storageRetentionDays.message}</p>
              )}
            </div>

            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h4 className="text-xs sm:text-sm font-medium mb-2">Storage Usage</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>45.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span>454.8 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div className="bg-blue-600 h-1.5 sm:h-2 rounded-full" style={{ width: '9%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motion Detection Settings */}
        <Card>
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Motion Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="sensitivity" className="text-xs sm:text-sm">Motion Sensitivity</Label>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-2">
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Low</span>
                <input
                  id="sensitivity"
                  type="range"
                  min="1"
                  max="10"
                  {...register('motionSensitivity', { valueAsNumber: true })}
                  className="flex-1 h-1.5 sm:h-2"
                />
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">High</span>
                <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">{watchedValues.motionSensitivity}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 sm:hidden">
                <span>Low</span>
                <span>High</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Higher sensitivity detects smaller movements but may cause false alarms
              </p>
              {errors.motionSensitivity && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.motionSensitivity.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                {...register('notificationsEnabled')}
                className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
              />
              <Label htmlFor="notifications" className="flex items-center text-xs sm:text-sm">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Enable push notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailAlerts"
                {...register('emailAlerts')}
                className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
              />
              <Label htmlFor="emailAlerts" className="flex items-center text-xs sm:text-sm">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Enable email alerts
              </Label>
            </div>

            {watchedValues.emailAlerts && (
              <div className="ml-4 sm:ml-6">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue="user@example.com"
                  className="h-8 sm:h-10 text-xs sm:text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card>
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Network Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="text-xs sm:text-sm font-medium mb-2">Network Status</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span>Connection:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>IP Address:</span>
                  <span className="font-mono text-xs">192.168.1.100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Port:</span>
                  <span className="font-mono text-xs">8080</span>
                </div>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-8 sm:h-10 text-xs sm:text-sm">
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Test Network Connection
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t gap-3 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm">
            Reset to Defaults
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
            <Button type="submit" disabled={isSaving || !isDirty} className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm">
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export { SettingsPanel };
