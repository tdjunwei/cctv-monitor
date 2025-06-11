'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseAPI } from '@/lib/database-client';

export function ApiConfigDebug() {
  const envInfo = DatabaseAPI.getEnvironmentInfo();
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium">API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">API URL:</span>
          <Badge variant="outline" className="text-xs font-mono max-w-48 truncate">
            {envInfo.apiUrl}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Environment:</span>
          <Badge variant={envInfo.isProduction ? "default" : "secondary"} className="text-xs">
            {envInfo.nodeEnv}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Timeout:</span>
          <Badge variant="outline" className="text-xs">
            {envInfo.timeout}ms
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Debug Mode:</span>
          <Badge variant={envInfo.debugMode ? "destructive" : "default"} className="text-xs">
            {envInfo.debugMode ? 'ON' : 'OFF'}
          </Badge>
        </div>
        {envInfo.appName && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">App Name:</span>
            <Badge variant="outline" className="text-xs">
              {envInfo.appName}
            </Badge>
          </div>
        )}
        {envInfo.appVersion && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Version:</span>
            <Badge variant="outline" className="text-xs">
              {envInfo.appVersion}
            </Badge>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Config Source:</span>
          <Badge variant="outline" className="text-xs">
            {envInfo.publicApiUrl ? 'Environment' : 'Default'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
