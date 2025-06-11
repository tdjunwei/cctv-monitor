'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlayCircle, 
  Download, 
  Trash2, 
  Search,
  Calendar,
  Clock,
  HardDrive,
  Filter
} from 'lucide-react';
import { Camera, Recording } from '@/types/cctv';
import { format, formatDistanceToNow, intervalToDuration } from 'date-fns';

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
  }
];

interface RecordingManagementProps {
  cameras: Camera[];
}

function RecordingManagement({ cameras }: RecordingManagementProps) {
  const [recordings] = useState<Recording[]>(mockRecordings);
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>(mockRecordings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter recordings based on search term, camera, and type
  const applyFilters = useCallback(() => {
    let filtered = recordings;

    if (searchTerm) {
      filtered = filtered.filter(recording =>
        recording.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.cameraName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCamera !== 'all') {
      filtered = filtered.filter(recording => recording.cameraId === selectedCamera);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(recording => recording.type === selectedType);
    }

    setFilteredRecordings(filtered);
  }, [recordings, searchTerm, selectedCamera, selectedType]);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePlay = (recording: Recording) => {
    console.log(`Playing recording: ${recording.filename}`);
    // In a real app, this would open video player
  };

  const handleDownload = (recording: Recording) => {
    console.log(`Downloading recording: ${recording.filename}`);
    // In a real app, this would download the file
  };

  const handleDelete = (recordingId: string) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      console.log(`Deleting recording: ${recordingId}`);
      // In a real app, this would delete the recording
    }
  };

  const formatDurationString = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const hours = duration.hours || 0;
    const minutes = duration.minutes || 0;
    const secs = duration.seconds || 0;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getTotalSize = () => {
    return filteredRecordings.reduce((total, recording) => total + recording.size, 0);
  };

  const getTypeColor = (type: Recording['type']) => {
    switch (type) {
      case 'motion':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manual':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recording Management</h2>
          <p className="text-sm text-muted-foreground">
            {filteredRecordings.length} recordings • {getTotalSize().toFixed(1)} MB total
          </p>
        </div>
        <Button variant="outline">
          <HardDrive className="h-4 w-4 mr-2" />
          Storage Settings
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger>
                  <SelectValue placeholder="All cameras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cameras</SelectItem>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={applyFilters}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <div className="space-y-3">
        {filteredRecordings.map((recording) => (
          <Card key={recording.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Thumbnail placeholder */}
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{recording.filename}</h3>
                      <Badge className={getTypeColor(recording.type)}>
                        {recording.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(recording.startTime, 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(recording.startTime, 'HH:mm')} - {format(recording.endTime, 'HH:mm')}
                      </span>
                      <span>Duration: {formatDurationString(recording.duration)}</span>
                      <span>Size: {recording.size.toFixed(1)} MB</span>
                      <span>Camera: {recording.cameraName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlay(recording)}
                  >
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(recording)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(recording.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
      {filteredRecordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Storage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Recordings</p>
                <p className="text-lg font-semibold">{filteredRecordings.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Size</p>
                <p className="text-lg font-semibold">{getTotalSize().toFixed(1)} MB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Oldest Recording</p>
                <p className="text-lg font-semibold">
                  {filteredRecordings.length > 0 
                    ? formatDistanceToNow(
                        Math.min(...filteredRecordings.map(r => r.startTime.getTime())),
                        { addSuffix: true }
                      )
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Latest Recording</p>
                <p className="text-lg font-semibold">
                  {filteredRecordings.length > 0 
                    ? formatDistanceToNow(
                        Math.max(...filteredRecordings.map(r => r.startTime.getTime())),
                        { addSuffix: true }
                      )
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { RecordingManagement };
