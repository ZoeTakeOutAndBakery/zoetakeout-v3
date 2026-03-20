# Milestone 4 - Public Site Data Integration (Astro + Sanity)

Goal
- Keep all public pages driven by Sanity content with stable, behavior-preserving rendering.

Scope
- Render home and menu pages from Sanity queries.
- Keep safe fallbacks for optional fields (e.g., delivery links and CTA URLs).
- Ensure inquiry form submits to Netlify Function endpoint.

Key Tasks
- Maintain query module (`src/lib/sanity.ts`) and component contracts.
- Keep shared constants centralized (event types, fallback URLs).
- Ensure `Reservations` form and backend function remain schema-compatible.

Acceptance Criteria
- No required section depends on hardcoded operational content.
- Page rendering remains stable when optional Sanity fields are missing.
- Inquiry submission path remains `/.netlify/functions/catering-inquiry`.
