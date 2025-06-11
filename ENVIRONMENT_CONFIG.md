# Environment Configuration Guide

This document explains how to configure the CCTV Monitor application using environment variables.

## 📋 Overview

The CCTV Monitor frontend uses environment variables to configure various aspects of the application, most importantly the API backend URL. This allows for flexible deployment across different environments (development, staging, production) without code changes.

## 🚀 Quick Start

1. **Copy the example environment file:**
   ```bash
   cd /Applications/www/_personal/cctv-monitor
   cp .env.example .env.local
   ```

2. **Edit your configuration:**
   ```bash
   nano .env.local  # or use your preferred editor
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API server URL | `http://localhost:3001/api` | Auto-detected based on `NODE_ENV` |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `5000` | `5000` |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging | `true` | `false` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `CCTV Monitor` | `CCTV Monitor` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` | `1.0.0` |

## 🌍 Environment Files

### File Priority (Next.js loads in this order)

1. `.env.local` (always loaded, ignored by git)
2. `.env.development` (loaded when `NODE_ENV=development`)
3. `.env.staging` (loaded when `NODE_ENV=staging`)
4. `.env.production` (loaded when `NODE_ENV=production`)
5. `.env` (default for all environments)

### Provided Environment Files

```
cctv-monitor/
├── .env.example          # Template file with examples
├── .env.local            # Your local development config (git ignored)
├── .env.development      # Development environment defaults
├── .env.staging          # Staging environment config
└── .env.production       # Production environment config
```

## 📚 Configuration Examples

### Local Development
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_APP_NAME=CCTV Monitor (Dev)
```

### Docker Development
```env
# .env.local
NEXT_PUBLIC_API_URL=http://host.docker.internal:3001/api
NEXT_PUBLIC_DEBUG_MODE=true
```

### Remote Development Server
```env
# .env.local
NEXT_PUBLIC_API_URL=http://192.168.1.100:3001/api
NEXT_PUBLIC_DEBUG_MODE=true
```

### Staging Environment
```env
# .env.staging
NEXT_PUBLIC_API_URL=https://api-staging.your-domain.com/api
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_APP_NAME=CCTV Monitor (Staging)
```

### Production Environment
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_APP_NAME=CCTV Monitor
```

## 🔍 Debugging Configuration

### Check Current Configuration

You can verify your current configuration by:

1. **Console Logging** (when `NEXT_PUBLIC_DEBUG_MODE=true`):
   - Open browser developer tools
   - Check console for API request logs

2. **Environment Info Method**:
   ```javascript
   import { DatabaseAPI } from '@/lib/database-client';
   console.log(DatabaseAPI.getEnvironmentInfo());
   ```

3. **Debug Component**:
   - The `ApiConfigDebug` component shows current configuration
   - Add it temporarily to any page for debugging

### Common Issues

**Issue**: API requests failing with CORS errors
```
Solution: Ensure NEXT_PUBLIC_API_URL points to the correct backend URL
```

**Issue**: Environment variables not loading
```
Solution: 
1. Check file naming (.env.local not .env.localhost)
2. Restart the development server after changes
3. Ensure variables start with NEXT_PUBLIC_ for client-side use
```

**Issue**: Different behavior between development and production
```
Solution: Check that production environment has correct NEXT_PUBLIC_API_URL
```

## 🚀 Deployment Configurations

### Vercel Deployment
```bash
# Set environment variables in Vercel dashboard
vercel env add NEXT_PUBLIC_API_URL production
# Enter your production API URL when prompted
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build
CMD ["npm", "start"]
```

```bash
# Build with environment variable
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.your-domain.com/api -t cctv-monitor .
```

### Manual Server Deployment
```bash
# Build with production environment
NODE_ENV=production npm run build

# Start with environment variables
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api npm start
```

## 🔒 Security Considerations

### Important Notes

1. **Client-Side Exposure**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
2. **No Secrets**: Never put sensitive data (API keys, passwords) in `NEXT_PUBLIC_` variables
3. **Git Ignore**: `.env.local` is ignored by git by default - keep it that way
4. **Environment Specific**: Use different API URLs for different environments

### Best Practices

```env
# ✅ Good - Configuration data
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_APP_VERSION=1.0.0

# ❌ Bad - Sensitive data (use server-side variables instead)
# NEXT_PUBLIC_API_SECRET=secret123
# NEXT_PUBLIC_DB_PASSWORD=password123
```

## 🛠️ Advanced Configuration

### Custom Environment Variables

Add custom configuration by:

1. **Define the variable** in your `.env.local`:
   ```env
   NEXT_PUBLIC_CUSTOM_FEATURE=true
   ```

2. **Use in your code**:
   ```typescript
   const isCustomFeatureEnabled = process.env.NEXT_PUBLIC_CUSTOM_FEATURE === 'true';
   ```

3. **Add to DatabaseAPI** configuration:
   ```typescript
   static getEnvironmentInfo() {
     return {
       // ...existing properties
       customFeature: process.env.NEXT_PUBLIC_CUSTOM_FEATURE === 'true'
     };
   }
   ```

### Runtime Configuration

For runtime configuration changes without rebuilds:

1. **Server-side API** to fetch configuration
2. **Configuration endpoint** on your backend
3. **React Context** to manage configuration state

## 📝 Troubleshooting

### Verification Checklist

- [ ] Environment file exists (`.env.local`)
- [ ] Variables start with `NEXT_PUBLIC_` for client-side use
- [ ] Development server restarted after changes
- [ ] API backend is running and accessible
- [ ] No typos in variable names
- [ ] Correct file encoding (UTF-8)

### Debug Commands

```bash
# Check if environment file exists
ls -la .env*

# View current environment variables (development)
npm run dev 2>&1 | grep -i env

# Test API connection manually
curl $(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)/cameras
```

## 📞 Support

If you encounter issues with environment configuration:

1. Check this documentation
2. Verify your API backend is running
3. Use the debug component to inspect current configuration
4. Check browser developer tools for console errors
