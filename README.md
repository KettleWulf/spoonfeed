# SpoonFeed

SpoonFeed is a collaborative web app for discovering and sharing places to eat.

Users can explore places on an interactive map, add new spots with address/location data, and attach photos. The app is built around Firebase services for authentication, data storage, and file uploads.

## Core Features

- Interactive map view with markers for stored places
- Search and geocoding support for finding locations and cities
- Add new places directly from map clicks
- Place list and detail views
- Image uploads for places via drag-and-drop
- User authentication (sign up, log in, password reset, profile updates)
- Protected routes for authenticated-only pages

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Routing: React Router
- UI: React Bootstrap, Sass
- Data layer: Firebase Firestore
- Auth: Firebase Authentication
- File storage: Firebase Storage
- Maps and geospatial UX: Google Maps JavaScript API via `@react-google-maps/api`
- Forms and utilities: React Hook Form, React Dropzone, React Toastify, TanStack Table

## Project Structure (high level)

- `src/components`: reusable UI and map-related components
- `src/pages`: route-level pages
- `src/context`: auth context and provider
- `src/hooks`: Firebase, map, geocoding, streaming, and upload hooks
- `src/services/Firebase.ts`: Firebase app/service initialization

## Environment Variables

Create a `.env` file in the project root and configure:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GOOGLE_MAPS_API_KEY=
```

## Local Development

```bash
npm install
npm run dev
```

Other useful scripts:

```bash
npm run build
npm run check
npm run preview
```

## Collaborators

This project was developed collaboratively, with each team member taking primary ownership of a core subsystem while contributing across the codebase.

### Lucas Hernandez – Authentication
- Implementation of user authentication flows using Firebase Authentication  
- Session handling and user-scoped access logic  
- Secure access to protected features  

### Philip Andersson – Map & Geospatial Logic
- Interactive map integration using the Google Maps API  
- Marker management and geospatial visualization  
- Synchronization between map state and stored location data  

### Olle Wistedt – Architecture & Data Layer ( & Janitor )
- Overall application architecture and technical direction  
- Data modeling and integration with Cloud Firestore  
- Image handling and file storage via Firebase Storage  
- Service integration across the application  
