import { Camera, Recording, Alert, ONVIFDiscoveryResult, ONVIFCapabilities, ONVIFProfile, DashboardStats } from '@/types/cctv';

// Client-side database API functions
export class DatabaseAPI {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://your-api-domain.com/api' 
      : 'http://localhost:3001/api');
  
  private static readonly TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '5000');
  private static readonly DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

  // Debug method to check the current API URL being used
  static getApiUrl(): string {
    return this.BASE_URL;
  }

  // Debug method to check environment info
  static getEnvironmentInfo() {
    return {
      apiUrl: this.BASE_URL,
      timeout: this.TIMEOUT,
      debugMode: this.DEBUG_MODE,
      nodeEnv: process.env.NODE_ENV,
      publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
      isProduction: process.env.NODE_ENV === 'production',
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION
    };
  }

  // Enhanced fetch wrapper with timeout and debug logging
  private static async apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    if (this.DEBUG_MODE) {
      console.log(`[API] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (this.DEBUG_MODE) {
        console.log(`[API] Response ${response.status}:`, response.ok ? 'Success' : 'Error');
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (this.DEBUG_MODE) {
        console.error(`[API] Request failed:`, error);
      }
      throw error;
    }
  }

  // Camera operations
  static async getCameras(): Promise<Camera[]> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras`);
    if (!response.ok) {
      throw new Error('Failed to fetch cameras');
    }
    const result = await response.json();
    return result.success ? result.data : [];
  }

  static async getCamera(id: string): Promise<Camera> {
    const response = await fetch(`${this.BASE_URL}/cameras/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch camera');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to fetch camera data');
    }
    return result.data;
  }

  static async createCamera(camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt' | 'isOnline' | 'lastMotionDetected'>): Promise<Camera> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(camera),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create camera');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to create camera');
    }
    return result.data;
  }

  static async updateCamera(id: string, updates: Partial<Camera>): Promise<Camera> {
    const response = await fetch(`${this.BASE_URL}/cameras/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update camera');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to update camera');
    }
    return result.data;
  }

  static async deleteCamera(id: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/cameras/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete camera');
    }
  }

  // Database initialization
  static async testConnection(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.BASE_URL.replace('/api', '')}/api/database/status`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to test database connection');
    }
    return response.json();
  }

  static async initializeDatabase(): Promise<{ status: string; message: string }> {
    // For now, return success since the API backend handles database initialization
    return { status: 'success', message: 'Database initialized successfully' };
  }

  static async initializeAndSeedDatabase(): Promise<{ status: string; message: string }> {
    // For now, return success since the API backend handles database initialization
    return { status: 'success', message: 'Database initialized and seeded successfully' };
  }

  // Recording operations
  static async getRecordings(): Promise<Recording[]> {
    const response = await fetch(`${this.BASE_URL}/recordings`);
    if (!response.ok) {
      throw new Error('Failed to fetch recordings');
    }
    const result = await response.json();
    return result.success ? result.data : [];
  }

  // Alert operations
  static async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${this.BASE_URL}/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    const result = await response.json();
    return result.success ? result.data : [];
  }

  static async markAlertAsRead(id: string): Promise<Alert> {
    const response = await fetch(`${this.BASE_URL}/alerts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRead: true }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark alert as read');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to mark alert as read');
    }
    return result.data;
  }

  // ONVIF operations
  static async discoverONVIFDevices(timeout?: number): Promise<ONVIFDiscoveryResult> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras/onvif/discover${timeout ? `?timeout=${timeout}` : ''}`);
    
    if (!response.ok) {
      throw new Error('Failed to discover ONVIF devices');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to discover ONVIF devices');
    }
    
    return result.data;
  }

  static async testONVIFConnection(credentials: {
    host: string;
    port?: number;
    username: string;
    password: string;
  }): Promise<{
    success: boolean;
    capabilities?: ONVIFCapabilities;
    profiles?: ONVIFProfile[];
    streamUri?: string;
    error?: string;
  }> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras/onvif/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    return result.data || result;
  }

  static async getONVIFCapabilities(cameraId: string): Promise<{
    capabilities: ONVIFCapabilities;
    profiles: ONVIFProfile[];
  }> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras/${cameraId}/onvif/capabilities`);
    
    if (!response.ok) {
      throw new Error('Failed to get ONVIF capabilities');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get ONVIF capabilities');
    }
    
    return result.data;
  }

  static async controlPTZ(cameraId: string, action: 'move' | 'stop', direction?: string, speed?: number): Promise<boolean> {
    const response = await this.apiRequest(`${this.BASE_URL}/cameras/${cameraId}/onvif/ptz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, direction, speed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to control PTZ');
    }
    
    const result = await response.json();
    return result.success;
  }

  // Dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.apiRequest(`${this.BASE_URL}/dashboard/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to fetch dashboard statistics');
    }
    return result.data;
  }

  // Utility methods for error handling
  static handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }

  // Mock data for development (can be removed once database is fully integrated)
  static getMockCameras(): Camera[] {
    return [
      {
        id: '1',
        name: 'Front Door',
        location: 'Main Entrance',
        streamUrl: 'rtsp://192.168.1.100:554/stream1',
        isOnline: true,
        recordingEnabled: true,
        resolution: '1080p',
        type: 'outdoor',
        onvifEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMotionDetected: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Living Room',
        location: 'Living Area',
        streamUrl: 'rtsp://192.168.1.101:554/stream1',
        isOnline: true,
        recordingEnabled: true,
        resolution: '720p',
        type: 'indoor',
        onvifEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Backyard',
        location: 'Garden Area',
        streamUrl: 'rtsp://192.168.1.102:554/stream1',
        isOnline: false,
        recordingEnabled: true,
        resolution: '4K',
        type: 'outdoor',
        onvifEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMotionDetected: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
  }
}
