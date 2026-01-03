# Scripts

Utility scripts for mo-arch project management.

## Deployment

### check-deployment.sh

Quick deployment status check for Vercel.

```bash
./scripts/check-deployment.sh
```

**Shows:**
- Recent deployment history
- Production URLs
- Site health status
- Useful Vercel commands

## Prerequisites

- Vercel CLI installed: `npm i -g vercel`
- Authenticated: `vercel login`
- Project linked: `vercel link` (already done)

## Vercel CLI Quick Reference

```bash
# Deploy to production
vercel --prod

# List deployments
vercel ls

# Get deployment details
vercel inspect <deployment-url>

# View build logs
vercel logs <deployment-url>

# Open Vercel dashboard
vercel open
```

## Project Configuration

**Project:** tumativerses-projects/mo-arch
**Production URLs:**
- https://mo-arch.tumati.me (custom domain)
- https://mo-arch.vercel.app (Vercel domain)

**Local Config:**
- `.vercel/` - Vercel CLI configuration (gitignored)
- `.env.local` - Environment variables (gitignored)
