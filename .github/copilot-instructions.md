# Schlosswochen-CH Development Guide

## Architecture Overview
This is an Angular 17+ application with Server-Side Rendering (SSR) deployed on Netlify. The app manages content for a children's summer program website in Lucerne, Switzerland.

**Tech Stack**: Angular 17, Angular Material, TailwindCSS, Netlify Functions, MongoDB (native driver)

## Project Structure
- **Main app**: Lazy-loaded `SchlosswochenModule` at `/schlosswochen` route
- **Content management**: Dynamic routing via `/:title` parameter to display MongoDB content
- **Data flow**: MongoDB (native driver) → Netlify Functions → Angular Services → Components
- **Deployment**: Netlify with prerendering for SEO

## Key Development Patterns

### Modern Environment Configuration
Environment variables are handled via modern Angular dependency injection:
```bash
npm start          # Standard Angular development server
npm run build      # Production build with proper environment replacement
```
- **Server-side variables**: Sensitive data (MongoDB credentials, API keys) stay server-side only
- **Client-side config**: Injected via `APP_CONFIG` token with `ConfigService`
- **Runtime injection**: Safe variables injected into HTML during SSR

### Content Architecture
Content is fetched from MongoDB via Netlify Functions using the native MongoDB driver:
- `ContentService.loadAll()` fetches all content on app initialization
- Content is stored in BehaviorSubject for reactive updates
- Components access content via `ContentService.contentByTitle(title)`
- Content structure: `Content` objects with nested `Card[]` arrays containing `Impression[]` and `Button[]`

### Routing Pattern
```typescript
// Main route: /schlosswochen/:title
// No title parameter = default welcome content
// With title = fetches specific content by title from MongoDB
```

### Component Structure
- `SchlosswochenAppComponent`: Main layout with sidenav/toolbar
- `MainContentComponent`: Dynamic content renderer based on route title
- Card-based components: Specialized components for different content types (maps, impressions, subscribe, etc.)

### Netlify Functions
Located in `netlify/functions/`:
- `get-content.ts`: Fetches content from MongoDB using native driver with connection caching
- `get-assets.ts`: Proxies Netlify asset API (keeps sensitive API keys server-side)
- `mongodb.ts`: Shared MongoDB connection helper with connection pooling
- `submission-created.ts`: Handles newsletter subscriptions with email notifications

### Development Workflow
```bash
npm start          # Runs Angular dev server
npm run netlify    # Starts Netlify functions locally with inspector
npm run dev:ssr    # Runs SSR development server
npm run prerender  # Generates static pages for deployment
```

### Custom Configurations
- **Date handling**: Custom `CustomDateAdapter` for Swiss German locale (de-CH)
- **Markdown**: Custom renderer with red paragraph styling via `markedOptionsFactory()`
- **Maps**: Google Maps integration with API key from injected configuration
- **Swiper**: Custom swiper module for image galleries
- **Configuration**: Modern injection token pattern with `ConfigService`

### Asset Management
- Content data in multiple formats: `content.hjson`, `content.bson`, `content.md`
- Images organized by year/week: `2021-1_*.jpg`, `2022-1_*.jpg`, etc.
- PDFs and other files in `assets/files/`
- Image resizing via Netlify's built-in transforms

### SEO & Prerendering
- Uses Angular Universal for SSR
- `SeoService` manages meta tags and titles
- Prerendering configured for static page generation
- Netlify redirects handle SPA routing

## Critical Notes
- **No build-time environment scripts**: Uses modern runtime configuration injection
- **Security**: Sensitive variables never reach the browser bundle
- **Connection pooling**: MongoDB connections are cached for performance
- **Swiss locale**: (de-CH) is the primary language
- **Google Maps**: API key injected safely during SSR
- **Email functionality**: Requires Netlify Email service configuration

## Required Environment Variables
Set these in your Netlify environment or `.env` file:
- `MONGODB_URI`: Your MongoDB connection string
- `MONGODB_DB_NAME`: Your database name
- `API_KEY_GMAPS`: Google Maps API key
- `API_KEY_NETLIFY`: Netlify API key for asset management
- `SITE_ID`: Netlify site ID
- `NETLIFY_EMAILS_SECRET`: For email notifications
- `EMAIL_SENDER`: From address for emails
