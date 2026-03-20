# Milestone 1 - Astro + Netlify Foundation Hardening

Goal
- Finalize core Astro foundation for deployment to Netlify with consistent local workflows.

Scope
- Keep Astro + Tailwind project structure stable.
- Ensure local scripts clearly separate frontend-only development and function-capable development.
- Confirm environment setup and repository hygiene for handoff.

Key Tasks
- Maintain `npm run dev:site` for Astro frontend development.
- Add/maintain `npm run dev:netlify` for local Netlify Functions runtime.
- Normalize `.gitignore` to exclude generated build/cache artifacts.
- Document required environment variables and setup flow.

Acceptance Criteria
- `npm run dev:site` launches Astro on port 8080.
- `npm run dev:netlify` launches local runtime with function support.
- Generated folders are excluded from version control.
- README accurately reflects real stack and setup.
