# CCTV Monitor Application

A modern, responsive home CCTV monitoring system built with Next.js, TypeScript, and Shadcn/ui components.

## Features

### 🎥 Live Camera Monitoring
- Real-time camera feed display in a responsive grid layout
- Camera status indicators (online/offline)
- Recording status and motion detection alerts
- Individual camera controls (play, fullscreen, refresh)

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
\`\`\`bash
git clone https://github.com/tdjunwei/cctv-monitor.git
cd cctv-monitor
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
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
\`\`\`

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

1. Create components in \`src/components/\`
2. Define TypeScript interfaces in \`src/types/\`
3. Use Shadcn/ui components for consistent styling
4. Implement form validation with react-hook-form and Zod

### Form Validation

All forms use react-hook-form with Zod schemas for validation:

\`\`\`typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});
\`\`\`

### Styling

- Uses Tailwind CSS for utility-first styling
- Shadcn/ui components for consistent design system
- Responsive design with mobile-first approach

## Configuration

### Environment Variables

Create a \`.env.local\` file for configuration:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=your_database_url
\`\`\`

### Customization

- Modify \`tailwind.config.ts\` for theme customization
- Update \`src/types/cctv.ts\` for data model changes
- Customize components in \`src/components/ui/\`

## Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

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
