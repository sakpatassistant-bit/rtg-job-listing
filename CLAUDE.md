# RTG Job Listing

A lightweight, SEO-friendly job listing website for ReAnThai Group.

## Overview

This is a Next.js (App Router) application that:
- Displays public job postings from RTG-ERP
- Allows candidates to submit job applications
- Uses SSR/SSG for SEO (Google crawlable)
- Connects to RTG-ERP API for data

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Kanit (Thai/Latin)
- **Deployment**: Docker

## Project Structure

```
rtg-job-listing/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Redirect to /jobs
│   │   ├── globals.css         # Global styles
│   │   └── jobs/
│   │       ├── page.tsx        # Job list (SSR)
│   │       └── [id]/
│   │           ├── page.tsx    # Job detail (SSG)
│   │           ├── apply/
│   │           │   └── page.tsx # Application form
│   │           └── not-found.tsx
│   ├── components/
│   │   ├── ApplicationForm.tsx # Client-side form
│   │   ├── JobCard.tsx         # Job listing card
│   │   ├── Header.tsx          # Site header
│   │   └── Footer.tsx          # Site footer
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript types
├── .github/workflows/
│   ├── ci.yml                  # CI (lint + build)
│   ├── deploy-dev.yml          # Deploy to dev
│   └── deploy-prod.yml         # Deploy to prod
├── Dockerfile                  # Production build
├── docker-compose.yml          # Production deployment
└── docker-compose.dev.yml      # Dev deployment
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm 10+
- RTG-ERP running locally or accessible

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | RTG-ERP API URL (SSR) | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | RTG-ERP API URL (client) | `http://localhost:3000` |

### Environment Files

- `.env.local` - Local development (localhost:3000)
- `.env.development` - Dev environment (erp-dev.reanthai.com)
- `.env.production` - Production (erp.reanthai.com)

## API Endpoints Used

### RTG-ERP Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/jobs` | GET | List active job postings |
| `/api/public/jobs/:id` | GET | Get job details |
| `/api/public/jobs/:id/apply` | POST | Submit application |

### Application Payload

```typescript
{
  fullName: string;     // Required
  email: string;        // Required
  phone?: string;       // Optional
  coverLetter?: string; // Optional
}
```

## Deployment

### Docker Build

```bash
# Build production image
docker build \
  --build-arg API_URL=https://erp.reanthai.com \
  --build-arg NEXT_PUBLIC_API_URL=https://erp.reanthai.com \
  -t rtg-job-listing:latest .

# Run container
docker run -p 3001:3000 rtg-job-listing:latest
```

### Docker Compose

```bash
# Production
docker compose up -d

# Development
docker compose -f docker-compose.dev.yml up -d
```

### CI/CD Pipeline

**Branches:**
- `dev` → Deploys to dev environment (port 3002)
- `main` → Deploys to production (port 3001)

**Required GitHub Secrets:**
- `SERVER_HOST` - Server hostname/IP
- `SERVER_USER` - SSH username
- `SERVER_SSH_KEY` - SSH private key

### Server Directories

- Production: `/opt/rtg-job-listing`
- Development: `/opt/rtg-job-listing-dev`

## RTG-ERP Integration

The job listing app requires RTG-ERP to expose public endpoints. See the RTG-ERP project for:

1. **Public Controller**: `apps/api/src/modules/jobs/public-jobs.controller.ts`
2. **CORS Configuration**: Allow `jobs.reanthai.com` origin
3. **Security**: Read-only for listings, validated write for applications

## URLs

| Environment | URL |
|-------------|-----|
| Local | http://localhost:3000 |
| Dev | https://jobs-dev.reanthai.com |
| Production | https://jobs.reanthai.com |

## Notes

- Job detail pages use SSG with ISR (revalidate every 60s)
- Application form is client-side for interactivity
- Thai font (Kanit) loaded via Google Fonts
- No authentication required for viewing jobs
- Applications stored in RTG-ERP database
