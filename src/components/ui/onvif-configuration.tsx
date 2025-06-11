'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField, CheckboxField } from '@/components/ui/form-fields';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Search, 
  TestTube2, 
  Camera, 
  Settings,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { DatabaseAPI } from '@/lib/database-client';
import { ONVIFDevice, ONVIFProfile, ONVIFCapabilities } from '@/types/cctv';

interface ONVIFConfigurationProps {
  onvifEnabled: boolean;
  onvifHost?: string;
  onvifPort?: number;
  onvifUsername?: string;
  onvifPassword?: string;
  onConfigChange: (config: {
    onvifEnabled?: boolean;
    onvifHost?: string;
    onvifPort?: number;
    onvifUsername?: string;
    onvifPassword?: string;
    onvifProfileToken?: string;
  }) => void;
}

function ONVIFConfiguration({ 
  onvifEnabled, 
  onvifHost, 
  onvifPort = 80, 
  onvifUsername, 
  onvifPassword,
  onConfigChange 
}: ONVIFConfigurationProps) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<ONVIFDevice[]>([]);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    profiles?: ONVIFProfile[];
    capabilities?: ONVIFCapabilities;
    error?: string;
  } | null>(null);

  const handleDiscoverDevices = async () => {
    setIsDiscovering(true);
    try {
      const result = await DatabaseAPI.discoverONVIFDevices(5000);
      setDiscoveredDevices(result.devices);
      if (result.error) {
        console.error('Discovery error:', result.error);
      }
    } catch (error) {
      console.error('Failed to discover ONVIF devices:', error);
      setDiscoveredDevices([]);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleTestConnection = async () => {
    if (!onvifHost || !onvifUsername || !onvifPassword) {
      setTestResult({
        success: false,
        error: 'Please fill in host, username, and password'
      });
      return;
    }

    setIsTesting(true);
    try {
      const result = await DatabaseAPI.testONVIFConnection({
        host: onvifHost,
        port: onvifPort,
        username: onvifUsername,
        password: onvifPassword
      });
      
      setTestResult(result);
      
      if (result.success && result.profiles && result.profiles.length > 0) {
        // Auto-select first profile
        onConfigChange({
          onvifProfileToken: result.profiles[0].token
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const selectDevice = (device: ONVIFDevice) => {
    onConfigChange({
      onvifHost: device.host,
      onvifPort: device.port
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          ONVIF Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CheckboxField
          label="Enable ONVIF Support"
          id="onvifEnabled"
          checked={onvifEnabled}
          onCheckedChange={(checked) => onConfigChange({ onvifEnabled: checked })}
        />

        {onvifEnabled && (
          <>
            {/* Device Discovery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Device Discovery</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDiscoverDevices}
                  disabled={isDiscovering}
                  className="cursor-pointer"
                >
                  {isDiscovering ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {isDiscovering ? 'Discovering...' : 'Discover Devices'}
                </Button>
              </div>

              {discoveredDevices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Found {discoveredDevices.length} ONVIF device(s):
                  </p>
                  <div className="grid gap-2">
                    {discoveredDevices.map((device, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => selectDevice(device)}
                      >
                        <div>
                          <p className="font-medium">{device.name || 'Unknown Device'}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.host}:{device.port}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          <Wifi className="h-3 w-3 mr-1" />
                          ONVIF
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Manual Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Camera IP Address"
                    id="onvifHost"
                    placeholder="192.168.1.100"
                    value={onvifHost || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ onvifHost: e.target.value })}
                  />
                </div>
                <InputField
                  label="Port"
                  id="onvifPort"
                  type="number"
                  min="1"
                  max="65535"
                  placeholder="80"
                  value={onvifPort?.toString() || '80'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ onvifPort: parseInt(e.target.value) || 80 })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Username"
                  id="onvifUsername"
                  placeholder="admin"
                  value={onvifUsername || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ onvifUsername: e.target.value })}
                />
                <InputField
                  label="Password"
                  id="onvifPassword"
                  type="password"
                  placeholder="••••••••"
                  value={onvifPassword || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({ onvifPassword: e.target.value })}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !onvifHost || !onvifUsername || !onvifPassword}
                className="cursor-pointer"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <TestTube2 className="h-4 w-4 mr-2" />
                )}
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    testResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>
                
                {testResult.error && (
                  <p className="text-sm text-red-800 mb-2">{testResult.error}</p>
                )}
                
                {testResult.success && testResult.profiles && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-800">
                      Found {testResult.profiles.length} media profile(s):
                    </p>
                    <div className="space-y-1">
                      {testResult.profiles.map((profile, index) => (
                        <div key={index} className="flex items-center">
                          <Settings className="h-3 w-3 mr-2 text-green-600" />
                          <span className="text-sm text-green-800">{profile.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { ONVIFConfiguration };
