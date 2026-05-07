# KhauSpot

Community-powered street-food discovery app built with Next.js.
Find nearby stalls on a live map, check in when you are physically at a stall, suggest new stalls, and moderate submissions through an admin dashboard.

## Features

- Discover nearby stalls using browser geolocation
- Explore stalls on an interactive Leaflet map with marker clustering
- View stall details, photos, distance, and recent check-ins
- Suggest new stalls with optional image uploads
- Check in only when you are physically near the stall (distance + GPS accuracy validation)
- Activity feed for recent check-ins and suggestions
- Admin review flow to approve/reject suggested stalls
- Rate-limited APIs (Upstash Redis)

## Tech Stack

- Next.js (App Router) + React + TypeScript
- MongoDB + Mongoose
- Clerk authentication + Clerk webhooks
- React Query for server state
- Leaflet + React Leaflet + Supercluster
- Tailwind CSS + custom UI components
- Cloudinary for image uploads
- Upstash Redis for rate limiting

## Project Structure

```text
app/            # UI routes + API routes
components/     # Shared components (layout, map, forms, ui)
hooks/          # Custom hooks + React Query hooks
lib/            # Utilities (db, redis, validators, api clients)
models/         # Mongoose models
services/       # Service-layer helpers
types/          # TypeScript types
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root:

```bash
mongodbUrl=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
```

### 3) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Clerk Webhook Setup

Configure Clerk webhook endpoint:

- URL: `http://localhost:3000/api/webhooks/clerk` (or your deployed domain)
- Events: `user.created`, `user.updated`, `user.deleted`
- Copy the signing secret into `CLERK_WEBHOOK_SECRET`

## Available Scripts

```bash
npm run dev      # start development server
npm run build    # production build
npm run start    # run production build
npm run lint     # run eslint
```

## API Highlights

- `GET /api/stalls/nearby` - nearby stalls by user coordinates
- `GET /api/stalls` - stalls within map bounds
- `POST /api/stalls/suggest-stall` - submit a new suggestion
- `POST /api/stalls/[stallId]/checkin` - create a proximity-based check-in
- `GET /api/activity` - combined recent check-ins + suggestions
- `GET /api/admin/suggestions` - pending suggestions (admin)
- `POST /api/admin/approve-stall` - approve suggestion (admin)
- `POST /api/admin/reject-stall` - reject suggestion (admin)

## Notes

- Admin route access is protected by Clerk metadata role (`admin`).
- The app uses OpenStreetMap tiles and Nominatim reverse geocoding.
- Cloudinary signatures are generated server-side before upload.
