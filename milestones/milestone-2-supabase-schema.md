# Milestone 2 - Sanity Content Model and Data Contracts

Goal
- Establish and maintain Sanity schema contracts for all public-site content.

Scope
- Define schema types for site settings, menu, hours, testimonials, delivery links, and catering inquiries.
- Keep content contracts aligned between frontend queries and schema definitions.
- Support safe import/export workflows for data migration.

Key Tasks
- Maintain schema files in `sanity/schemaTypes`.
- Keep `src/lib/sanity.ts` queries aligned with schema changes.
- Validate inquiry schema (`cateringInquiry`) for function write compatibility.
- Track import/export artifacts intentionally (and exclude generated Studio builds).

Acceptance Criteria
- Studio schema loads without missing type references.
- Frontend queries return expected fields for all rendered sections.
- Catering inquiry documents can be created with required fields.
