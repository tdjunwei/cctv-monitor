'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  WifiOff, 
  Camera,
  HardDrive,
  Clock,
  Eye,
  Trash2,
  Bell
} from 'lucide-react';
import { Alert as AlertType } from '@/types/cctv';
import { formatDistanceToNow, format } from 'date-fns';

interface AlertsPanelProps {
  alerts: AlertType[];
  onAlertRead: (alertId: string) => void;
}

function AlertsPanel({ alerts, onAlertRead }: AlertsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'motion' | 'offline'>('all');

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread':
        return !alert.isRead;
      case 'motion':
        return alert.type === 'motion';
      case 'offline':
        return alert.type === 'offline';
      default:
        return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'motion':
        return <Camera className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'recording_failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'storage_full':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    onAlertRead(alertId);
  };

  const handleMarkAllAsRead = () => {
    alerts.filter(alert => !alert.isRead).forEach(alert => {
      onAlertRead(alert.id);
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    console.log(`Deleting alert: ${alertId}`);
    // In a real app, this would delete the alert
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Security Alerts</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} of {alerts.length} total
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b">
        {[
          { key: 'all', label: `All (${alerts.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'motion', label: `Motion (${alerts.filter(a => a.type === 'motion').length})` },
          { key: 'offline', label: `Offline (${alerts.filter(a => a.type === 'offline').length})` }
        ].map(tab => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter(tab.key as typeof filter)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`${getAlertColor(alert.severity)} ${!alert.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${!alert.isRead ? 'font-semibold' : ''}`}>
                        {alert.message}
                      </h3>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center">
                        <Camera className="h-3 w-3 mr-1" />
                        {alert.cameraName}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(alert.timestamp, 'MMM d, yyyy HH:mm')}
                      </span>
                      <span>
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(alert.severity)}
                      <Badge variant="outline" className="capitalize">
                        {alert.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Thumbnail if available */}
              {alert.thumbnail && (
                <div className="mt-3 ml-11">
                  <div className="w-32 h-20 bg-gray-200 rounded border"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          {filter === 'all' ? (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
              <p className="text-gray-500">Your system is running smoothly</p>
            </>
          ) : (
            <>
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {filter} alerts</h3>
              <p className="text-gray-500">
                {filter === 'unread' ? 'All alerts have been read' : `No ${filter} alerts found`}
              </p>
            </>
          )}
        </div>
      )}

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Alerts</p>
                <p className="text-lg font-semibold">{alerts.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unread</p>
                <p className="text-lg font-semibold text-red-600">{unreadCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Motion Alerts</p>
                <p className="text-lg font-semibold">{alerts.filter(a => a.type === 'motion').length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">System Alerts</p>
                <p className="text-lg font-semibold">{alerts.filter(a => a.type !== 'motion').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { AlertsPanel };
