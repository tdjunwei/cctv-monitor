'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Settings, 
  AlertTriangle, 
  PlayCircle,
  Eye,
  Wifi,
  HardDrive
} from 'lucide-react';
import { Camera as CameraType, Alert, DashboardStats } from '@/types/cctv';
import { CameraGrid } from '@/components/camera-grid';
import { CameraManagement } from '@/components/camera-management';
import { RecordingManagement } from '@/components/recording-management';
import { AlertsPanel } from '@/components/alerts-panel';
import { SettingsPanel } from '@/components/settings-panel';

// Mock data for demonstration  
const mockCameras: CameraType[] = [
  {
    id: '1',
    name: 'Front Door',
    location: 'Main Entrance',
    streamUrl: 'https://demo.url/stream1',
    isOnline: true,
    recordingEnabled: true,
    resolution: '1080p',
    type: 'outdoor',
    lastMotionDetected: new Date('2024-06-11T12:00:00Z'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-11T10:00:00Z')
  },
  {
    id: '2',
    name: 'Living Room',
    location: 'Interior',
    streamUrl: 'https://demo.url/stream2',
    isOnline: true,
    recordingEnabled: true,
    resolution: '1080p',
    type: 'indoor',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-11T10:00:00Z')
  },
  {
    id: '3',
    name: 'Backyard',
    location: 'Garden',
    streamUrl: 'https://demo.url/stream3',
    isOnline: false,
    recordingEnabled: true,
    resolution: '720p',
    type: 'outdoor',
    lastMotionDetected: new Date('2024-06-11T11:30:00Z'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-06-11T10:00:00Z')
  },
  {
    id: '4',
    name: 'Garage',
    location: 'Side Entrance',
    streamUrl: 'https://demo.url/stream4',
    isOnline: true,
    recordingEnabled: false,
    resolution: '1080p',
    type: 'indoor',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-11T10:00:00Z')
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    cameraId: '1',
    cameraName: 'Front Door',
    type: 'motion',
    message: 'Motion detected at main entrance',
    severity: 'medium',
    isRead: false,
    timestamp: new Date('2024-06-11T11:55:00Z')
  },
  {
    id: '2',
    cameraId: '3',
    cameraName: 'Backyard',
    type: 'offline',
    message: 'Camera went offline',
    severity: 'high',
    isRead: false,
    timestamp: new Date('2024-06-11T11:45:00Z')
  }
];

const mockStats: DashboardStats = {
  totalCameras: 4,
  onlineCameras: 3,
  offlineCameras: 1,
  totalRecordings: 156,
  storageUsed: 45.2,
  storageTotal: 500,
  unreadAlerts: 2,
  lastMotionDetected: new Date('2024-06-11T12:00:00Z')
};

export default function CCTVMonitor() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cameras, setCameras] = useState<CameraType[]>(mockCameras);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [stats] = useState<DashboardStats>(mockStats);

  const handleCameraUpdate = (updatedCamera: CameraType) => {
    setCameras(cameras.map(cam => 
      cam.id === updatedCamera.id ? updatedCamera : cam
    ));
  };

  const handleCameraDelete = (cameraId: string) => {
    setCameras(cameras.filter(cam => cam.id !== cameraId));
  };

  const handleAlertRead = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">CCTV Monitor</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant={stats.unreadAlerts > 0 ? "destructive" : "secondary"} className="text-xs">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{stats.unreadAlerts} Alerts</span>
                <span className="sm:hidden">{stats.unreadAlerts}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{stats.onlineCameras}/{stats.totalCameras} Online</span>
                <span className="sm:hidden">{stats.onlineCameras}/{stats.totalCameras}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-max sm:min-w-0">
              <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="cameras" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Cameras</span>
              </TabsTrigger>
              <TabsTrigger value="recordings" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Records</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Cameras</CardTitle>
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{stats.totalCameras}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{stats.onlineCameras} online, {stats.offlineCameras} offline</span>
                    <span className="sm:hidden">{stats.onlineCameras} / {stats.offlineCameras}</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Recordings</CardTitle>
                  <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{stats.totalRecordings}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="hidden sm:inline">Available recordings</span>
                    <span className="sm:hidden">Available</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Storage</CardTitle>
                  <HardDrive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{stats.storageUsed}GB</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="hidden sm:inline">of {stats.storageTotal}GB total</span>
                    <span className="sm:hidden">/ {stats.storageTotal}GB</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Alerts</CardTitle>
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{stats.unreadAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="hidden sm:inline">Unread notifications</span>
                    <span className="sm:hidden">Unread</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Camera Grid */}
            <CameraGrid cameras={cameras} />
          </TabsContent>

          {/* Cameras Tab */}
          <TabsContent value="cameras">
            <CameraManagement 
              cameras={cameras}
              onCameraUpdate={handleCameraUpdate}
              onCameraDelete={handleCameraDelete}
            />
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings">
            <RecordingManagement cameras={cameras} />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertsPanel 
              alerts={alerts}
              onAlertRead={handleAlertRead}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
