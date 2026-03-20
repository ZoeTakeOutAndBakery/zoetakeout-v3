# Milestone 3 - Content Operations in Sanity Studio

Goal
- Enable owner-friendly content operations through Sanity Studio rather than custom admin UI.

Scope
- Use Sanity Studio as the operational admin surface.
- Ensure editors can manage menu, hours, testimonials, delivery links, and site settings.
- Include inquiry triage fields/status in Studio.

Key Tasks
- Keep Studio config stable (`sanity/sanity.config.ts`, `sanity/sanity.cli.ts`).
- Maintain schema usability (clear field names, validation, and ordering).
- Keep inquiry status workflow (`new`, `in_progress`, `closed`) available in schema.

Acceptance Criteria
- Editors can update all site content from Studio.
- Inquiry records are viewable and manageable from Studio.
- No dependency on a separate `/admin` application.
