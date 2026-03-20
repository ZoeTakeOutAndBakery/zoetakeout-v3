# Milestone 5 - Deploy Readiness and SEO Hygiene

Goal
- Keep deployment and SEO fundamentals production-ready for Netlify handoff.

Scope
- Validate build pipeline assumptions (`npm run build` -> `dist`).
- Preserve canonical metadata and crawl assets (`robots.txt`, route-level metadata usage).
- Keep repository clean for migration into a new dedicated repository.

Key Tasks
- Ensure generated artifacts are not committed.
- Keep docs aligned to real deployment workflow and required env variables.
- Retain predictable static output structure for Netlify.

Acceptance Criteria
- Project builds cleanly with documented environment variables.
- Handoff folder is free of generated local artifacts.
- Documentation provides clear commands for local dev and deploy.
