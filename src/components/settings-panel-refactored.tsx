'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { InputField, SelectField, CheckboxField } from '@/components/ui/form-fields';

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

interface SettingsPanelProps {
  initialSettings?: SystemSettings;
  onSettingsUpdate?: (settings: SystemSettings) => void;
}

const defaultSettings: SystemSettings = {
  recordingQuality: 'high',
  storageRetentionDays: 30,
  motionSensitivity: 5,
  notificationsEnabled: true,
  emailAlerts: false,
  maxConcurrentStreams: 4,
  nightVisionEnabled: true,
  audioRecordingEnabled: false
};

function SettingsPanel({ initialSettings = defaultSettings, onSettingsUpdate }: SettingsPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'recording' | 'storage' | 'motion' | 'notifications' | 'network'>('recording');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings
  });

  const watchedValues = watch();

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings updated:', data);
      
      if (onSettingsUpdate) {
        onSettingsUpdate(data);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const qualityOptions = [
    { value: 'low', label: 'Low (480p)' },
    { value: 'medium', label: 'Medium (720p)' },
    { value: 'high', label: 'High (1080p)' },
    { value: 'ultra', label: 'Ultra (4K)' }
  ];

  const retentionOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' }
  ];

  const streamOptions = [
    { value: '1', label: '1 stream' },
    { value: '2', label: '2 streams' },
    { value: '4', label: '4 streams' },
    { value: '8', label: '8 streams' },
    { value: '16', label: '16 streams' }
  ];

  const sensitivityOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? '(Low)' : i === 9 ? '(High)' : ''}`
  }));

  const tabs = [
    { id: 'recording', label: 'Recording', icon: Camera },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'motion', label: 'Motion', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'network', label: 'Network', icon: Wifi }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">System Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your CCTV monitoring system preferences
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`w-full sm:w-auto ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            {activeTab === 'recording' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Recording Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SelectField
                    label="Recording Quality"
                    id="recordingQuality"
                    options={qualityOptions}
                    value={watchedValues.recordingQuality}
                    onValueChange={(value) => setValue('recordingQuality', value as any)}
                    error={errors.recordingQuality}
                  />

                  <SelectField
                    label="Maximum Concurrent Streams"
                    id="maxConcurrentStreams"
                    options={streamOptions}
                    value={watchedValues.maxConcurrentStreams?.toString()}
                    onValueChange={(value) => setValue('maxConcurrentStreams', parseInt(value))}
                    error={errors.maxConcurrentStreams}
                  />

                  <div className="space-y-4">
                    <CheckboxField
                      label="Enable night vision for supported cameras"
                      id="nightVisionEnabled"
                      checked={watchedValues.nightVisionEnabled}
                      onCheckedChange={(checked) => setValue('nightVisionEnabled', checked)}
                    />

                    <CheckboxField
                      label="Enable audio recording"
                      id="audioRecordingEnabled"
                      checked={watchedValues.audioRecordingEnabled}
                      onCheckedChange={(checked) => setValue('audioRecordingEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'storage' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-2" />
                    Storage Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SelectField
                    label="Storage Retention Period"
                    id="storageRetentionDays"
                    options={retentionOptions}
                    value={watchedValues.storageRetentionDays?.toString()}
                    onValueChange={(value) => setValue('storageRetentionDays', parseInt(value))}
                    error={errors.storageRetentionDays}
                  />

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Storage Information</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Current usage:</span>
                        <span className="font-medium">45.2 GB of 500 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated retention:</span>
                        <span className="font-medium">~{watchedValues.storageRetentionDays} days at current rate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'motion' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Motion Detection Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SelectField
                    label="Motion Sensitivity"
                    id="motionSensitivity"
                    options={sensitivityOptions}
                    value={watchedValues.motionSensitivity?.toString()}
                    onValueChange={(value) => setValue('motionSensitivity', parseInt(value))}
                    error={errors.motionSensitivity}
                  />

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Sensitivity Guide</h4>
                    <div className="space-y-1 text-sm text-yellow-800">
                      <p><strong>Low (1-3):</strong> Only detects significant movement</p>
                      <p><strong>Medium (4-6):</strong> Balanced sensitivity (recommended)</p>
                      <p><strong>High (7-10):</strong> Detects subtle movements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <CheckboxField
                      label="Enable push notifications"
                      id="notificationsEnabled"
                      checked={watchedValues.notificationsEnabled}
                      onCheckedChange={(checked) => setValue('notificationsEnabled', checked)}
                    />

                    <CheckboxField
                      label="Enable email alerts"
                      id="emailAlerts"
                      checked={watchedValues.emailAlerts}
                      onCheckedChange={(checked) => setValue('emailAlerts', checked)}
                    />
                  </div>

                  {watchedValues.emailAlerts && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Email Settings</h4>
                      <InputField
                        label="Email Address"
                        id="emailAddress"
                        type="email"
                        placeholder="alerts@example.com"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'network' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="h-5 w-5 mr-2" />
                    Network Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Network Status</h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex justify-between">
                        <span>API Server:</span>
                        <span className="font-medium text-green-600">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database:</span>
                        <span className="font-medium text-green-600">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last sync:</span>
                        <span className="font-medium">2 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="API Server URL"
                      id="apiServerUrl"
                      placeholder="http://localhost:3001/api"
                    />
                    
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" className="cursor-pointer">
                        Test Connection
                      </Button>
                      <Button type="button" variant="outline" className="cursor-pointer">
                        Reset to Default
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export { SettingsPanel };
