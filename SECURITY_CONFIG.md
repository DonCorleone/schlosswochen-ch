# Secure Runtime Configuration System

## Overview
This document describes the secure runtime configuration system that replaces the previous build-time API key injection approach.

## Problem Solved
- **Security Issue**: Previously, Google Maps API keys were being injected into built HTML files during the build process, which triggered Netlify's security scanner
- **Secret Exposure**: API keys were visible in the built `index.html` file as `window.__GOOGLE_MAPS_API_KEY__`
- **Compliance**: This approach violated best practices for secret management

## New Solution

### 1. Runtime Configuration Service (`RuntimeConfigService`)
- **Location**: `src/app/services/runtime-config.service.ts`
- **Purpose**: Fetches configuration from Netlify Functions at runtime
- **Security**: API keys never appear in built files

### 2. Netlify Function for Configuration (`get-config.ts`)
- **Location**: `netlify/functions/get-config.ts`
- **Purpose**: Serves configuration data from server-side environment variables
- **Endpoint**: `/.netlify/functions/get-config`
- **Security**: Environment variables stay server-side only

### 3. App Initialization
- **APP_INITIALIZER**: Loads configuration during app startup before components initialize
- **Graceful Fallbacks**: Handles network errors during prerendering and SSR
- **Observable Pattern**: Uses RxJS for reactive configuration management

## Implementation Details

### Environment Variables (Netlify Dashboard)
```bash
API_KEY_GMAPS=your_google_maps_api_key_here
NODE_ENV=production
```

### Configuration Interface
```typescript
interface AppConfig {
  googleMapsApiKey: string;
  environment: string;
  version: string;
}
```

### Usage in Components
```typescript
// Inject the service
private runtimeConfigService = inject(RuntimeConfigService);

// Get API key
const apiKey = this.runtimeConfigService.getGoogleMapsApiKey();
```

## Security Benefits

1. **No Secrets in Build Output**: API keys never appear in built HTML, CSS, or JS files
2. **Server-Side Only**: Environment variables remain on the server
3. **Runtime Loading**: Configuration is fetched dynamically when the app starts
4. **Audit Compliance**: Passes Netlify's security scanning without warnings
5. **Zero Exposure**: Even if someone downloads your built files, no secrets are revealed

## Build Process Changes

### Before (Insecure)
```bash
npm run build && npm run prerender && node scripts/inject-prod-env.js
```

### After (Secure)
```bash
npm run build && npm run prerender
```

### Removed Files
- `scripts/inject-prod-env.js` (build-time injection)
- `scripts/inject-dev-env.js` (development injection)

## Development vs Production

### Development
- Uses fallback configuration with empty API key
- Runtime config service attempts to load from `/.netlify/functions/get-config`
- Gracefully handles missing configuration

### Production (Netlify)
- Environment variables set in Netlify dashboard
- Netlify Functions serve configuration securely
- Full functionality with proper API keys

## Error Handling

### During Prerendering/SSR
- Network errors are expected and handled gracefully
- Fallback configuration prevents build failures
- Apps render successfully without runtime config

### In Browser
- Configuration loads asynchronously after app initialization
- Components check for API key availability
- Appropriate warnings logged if configuration fails

## Migration Notes

1. **Environment Variables**: Set `API_KEY_GMAPS` in Netlify environment variables
2. **Old Scripts**: Removed all build-time injection scripts
3. **Clean Builds**: Built files no longer contain any secrets
4. **Security Scan**: Passes Netlify security scanning without warnings

## Verification

To verify the system is working:

1. **Check Built Files**: No secrets in `dist/schlosswochen-ch/browser/index.html`
2. **Runtime Loading**: Browser console shows "Configuration loaded" message
3. **Network Tab**: See successful call to `/.netlify/functions/get-config`
4. **Maps Functionality**: Google Maps components load correctly with API key

This approach ensures your application is secure, compliant, and follows modern best practices for secret management in web applications.
