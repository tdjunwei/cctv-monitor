'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlayCircle, 
  Search,
  Calendar,
  Clock,
  HardDrive,
  Filter
} from 'lucide-react';
import { Camera, Recording } from '@/types/cctv';
import { 
  formatTimeAgo, 
  formatDateTime, 
  formatTime, 
  formatDurationString,
  formatFileSize,
  filterRecordingsByDateRange,
  filterRecordingsBySearch,
  sortRecordingsByDate,
  getRecordingsByCamera,
  getRecordingsByType,
  getTotalRecordingSize
} from '@/lib/utils/cctv-utils';
import { RecordingControls } from '@/components/ui/action-buttons';

// Mock recordings data
const mockRecordings: Recording[] = [
  {
    id: '1',
    cameraId: '1',
    cameraName: 'Front Door',
    filename: 'front_door_20240615_143022.mp4',
    duration: 1800, // 30 minutes
    size: 245.5,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    type: 'motion',
    thumbnail: '/api/thumbnails/1'
  },
  {
    id: '2',
    cameraId: '2',
    cameraName: 'Living Room',
    filename: 'living_room_20240615_120000.mp4',
    duration: 3600, // 1 hour
    size: 512.3,
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    endTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    type: 'scheduled'
  },
  {
    id: '3',
    cameraId: '1',
    cameraName: 'Front Door',
    filename: 'front_door_20240615_080000.mp4',
    duration: 7200, // 2 hours
    size: 1024.7,
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    type: 'scheduled'
  },
  {
    id: '4',
    cameraId: '4',
    cameraName: 'Garage',
    filename: 'garage_20240615_063045.mp4',
    duration: 900, // 15 minutes
    size: 128.2,
    startTime: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() - 9.75 * 60 * 60 * 1000), // 9.75 hours ago
    type: 'motion'
  },
  {
    id: '5',
    cameraId: '3',
    cameraName: 'Backyard',
    filename: 'backyard_20240614_220000.mp4',
    duration: 2700, // 45 minutes
    size: 356.8,
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    endTime: new Date(Date.now() - 23.25 * 60 * 60 * 1000), // 23.25 hours ago
    type: 'manual'
  }
];

interface RecordingManagementProps {
  cameras: Camera[];
}

function RecordingManagement({ cameras }: RecordingManagementProps) {
  const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>(mockRecordings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filterRecordings = useCallback(() => {
    let filtered = recordings;

    // Apply search filter
    if (searchTerm) {
      filtered = filterRecordingsBySearch(filtered, searchTerm);
    }

    // Apply camera filter
    if (selectedCamera !== 'all') {
      filtered = getRecordingsByCamera(filtered, selectedCamera);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = getRecordingsByType(filtered, selectedType as Recording['type']);
    }

    // Apply sorting
    filtered = sortRecordingsByDate(filtered, sortOrder);

    setFilteredRecordings(filtered);
  }, [recordings, searchTerm, selectedCamera, selectedType, sortOrder]);

  useEffect(() => {
    filterRecordings();
  }, [filterRecordings]);

  const handlePlay = (recording: Recording) => {
    console.log(`Playing recording: ${recording.filename}`);
    // In a real app, this would open a video player
  };

  const handleDownload = (recording: Recording) => {
    console.log(`Downloading recording: ${recording.filename}`);
    // In a real app, this would trigger a download
  };

  const handleDelete = (recordingId: string) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
      console.log(`Deleting recording: ${recordingId}`);
    }
  };

  const getTypeBadgeVariant = (type: Recording['type']) => {
    switch (type) {
      case 'motion':
        return 'destructive';
      case 'scheduled':
        return 'default';
      case 'manual':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const totalStorageUsed = getTotalRecordingSize(recordings);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Recording Management</h2>
          <p className="text-sm text-muted-foreground">
            {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''} 
            {recordings.length !== filteredRecordings.length && ` of ${recordings.length} total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search recordings</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by filename, camera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Camera</label>
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cameras</SelectItem>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recording Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="motion">Motion Detection</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recordings Grid */}
      <div className="grid gap-4">
        {filteredRecordings.map((recording) => (
          <Card key={recording.id}>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="h-6 w-6 text-white opacity-75" />
                  </div>
                  
                  {/* Recording Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{recording.filename}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(recording.startTime)} - {formatTime(recording.endTime)}
                      </span>
                      <span>Duration: {formatDurationString(recording.duration)}</span>
                      <span>Size: {formatFileSize(recording.size)}</span>
                      <span>Camera: {recording.cameraName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getTypeBadgeVariant(recording.type)}>
                      {recording.type}
                    </Badge>
                    <Badge variant="outline">
                      {formatTimeAgo(recording.startTime)}
                    </Badge>
                  </div>
                  
                  <RecordingControls
                    recordingId={recording.id}
                    onPlay={() => handlePlay(recording)}
                    onDownload={() => handleDownload(recording)}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="text-center py-12">
          <PlayCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
          <p className="text-gray-500">
            {recordings.length === 0 
              ? 'No recordings have been made yet'
              : 'Try adjusting your search filters'
            }
          </p>
        </div>
      )}

      {/* Storage Summary */}
      {recordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Recordings</p>
                <p className="text-lg font-semibold">{recordings.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Storage Used</p>
                <p className="text-lg font-semibold">{formatFileSize(totalStorageUsed)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Motion Recordings</p>
                <p className="text-lg font-semibold">{recordings.filter(r => r.type === 'motion').length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Scheduled Recordings</p>
                <p className="text-lg font-semibold">{recordings.filter(r => r.type === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { RecordingManagement };
