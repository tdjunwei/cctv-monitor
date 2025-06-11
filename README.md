# CCTV Monitor Application

A modern, responsive home CCTV monitoring system built with Next.js, TypeScript, and Shadcn/ui components.

## Features

### 🎥 Live Camera Monitoring
- Real-time camera feed display in a responsive grid layout
- Camera status indicators (online/offline)
- Recording status and motion detection alerts
- Individual camera controls (play, fullscreen, refresh)

### 📱 Mobile Responsive Design
- **Mobile-first approach** with responsive breakpoints (sm: 640px+, md: 768px+, lg: 1024px+)
- **Touch-friendly interface** with optimized button sizes and spacing
- **Adaptive layouts** that stack vertically on mobile and expand horizontally on larger screens
- **Horizontal scrolling tabs** for navigation on small screens
- **Responsive grids** that adjust from 1-2 columns on mobile to 4+ columns on desktop
- **Optimized text sizing** and icon scaling for different screen sizes
- **Mobile-optimized forms** with appropriate input sizing and validation
- **Safe area insets** support for modern mobile devices

### 📷 Camera Management
- Add, edit, and delete cameras with form validation
- Support for multiple camera types (indoor/outdoor)
- Configurable recording settings and stream URLs
- Real-time camera status monitoring

### 📹 Recording Management
- Browse and search through recorded footage
- Filter recordings by camera, date, and type (motion/scheduled/manual)
- Download and playback functionality
- Storage usage monitoring and analytics

### 🚨 Alert System
- Real-time motion detection alerts
- System status notifications (camera offline, storage issues)
- Categorized alerts with severity levels
- Mark as read/unread functionality

### ⚙️ System Settings
- Recording quality configuration (720p/1080p/4K)
- Motion sensitivity adjustment
- Storage retention policies
- Notification preferences (push/email)
- Network configuration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Forms**: react-hook-form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tdjunwei/cctv-monitor.git
cd cctv-monitor
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

The application can be configured using environment variables. Copy `.env.example` to `.env.local` and customize:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Application Metadata
NEXT_PUBLIC_APP_NAME=CCTV Monitor
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API server URL | `http://localhost:3001/api` | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `CCTV Monitor` | No |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` | No |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Use this prefix for client-side configuration only.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── alerts-panel.tsx   # Security alerts management
│   ├── camera-grid.tsx    # Live camera feeds display
│   ├── camera-management.tsx # Camera CRUD operations
│   ├── cctv-monitor.tsx   # Main dashboard component
│   ├── recording-management.tsx # Recording browser
│   ├── settings-panel.tsx # System configuration
│   └── ui/                # Shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions
└── types/
    └── cctv.ts            # TypeScript interfaces
```

## Key Components

### Dashboard
- Overview of all cameras and system status
- Quick stats (online cameras, storage usage, alerts)
- Tabbed navigation between different sections

### Camera Grid
- Live video feed simulation
- Camera status indicators
- Individual camera controls
- Motion detection visualization

### Camera Management
- Add new cameras with validation
- Edit existing camera settings
- Toggle recording on/off
- Delete cameras with confirmation

### Recording Management
- Browse recorded footage
- Search and filter capabilities
- Storage analytics
- Download functionality

### Alerts Panel
- Real-time security notifications
- Categorized by type and severity
- Mark as read functionality
- Alert history

### Settings Panel
- System-wide configuration
- Recording quality settings
- Motion detection sensitivity
- Notification preferences
- Network settings

## Development

### Adding New Features

1. Create components in `src/components/`
2. Define TypeScript interfaces in `src/types/`
3. Use Shadcn/ui components for consistent styling
4. Implement form validation with react-hook-form and Zod

### Form Validation

All forms use react-hook-form with Zod schemas for validation:

```typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});
```

### Styling

- Uses Tailwind CSS for utility-first styling
- Shadcn/ui components for consistent design system
- Responsive design with mobile-first approach

### Mobile Testing

To test mobile responsiveness:

1. **Browser DevTools**: Use Chrome/Firefox DevTools to simulate different devices
2. **Responsive Breakpoints**: Test at 320px, 640px, 768px, 1024px, and 1280px widths
3. **Touch Interactions**: Ensure buttons and controls are touch-friendly (minimum 44px)
4. **Real Device Testing**: Test on actual mobile devices when possible

**Key Mobile Features to Test:**
- Navigation tabs with horizontal scroll
- Camera grid responsive layout
- Form inputs and validation on mobile
- Alert cards and action buttons
- Settings panel with responsive controls

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
