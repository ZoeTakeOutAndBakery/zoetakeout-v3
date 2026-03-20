# Zoe Take Out & Bakery Website

Astro marketing site backed by Sanity CMS and deployed on Netlify.

## Overview
- Public website routes: `/` and `/menu`
- Content source: Sanity CMS
- Hosting/runtime: Netlify (static site + serverless function)

## Stack
- Frontend: Astro 5 + Tailwind CSS
- CMS: Sanity Studio (`/sanity`)
- Backend endpoint: Netlify Function (`/.netlify/functions/catering-inquiry`)
- Hosting: Netlify

## Security + Configuration
- Runtime configuration is managed in Netlify environment variables.
- Sensitive values are never committed to the repository.
- The inquiry endpoint includes origin validation and request throttling.
- CSP and baseline security headers are defined in `netlify.toml`.

## Deployment
- Deploy target: Netlify
- Build output: `dist`
- Netlify configuration file: `netlify.toml`

## Key Runtime Files
- `netlify/functions/catering-inquiry.js`
- `src/lib/sanity.server.js`
- `src/lib/urlSafety.js`
- `sanity/schemaTypes/cateringInquiry.ts`

## Project Structure
```text
src/
  components/
  layouts/
  lib/
  pages/
  styles/
netlify/functions/
sanity/
milestones/
```
