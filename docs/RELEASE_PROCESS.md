# Release process

Version candidates v0.x.x; v1.0.0 reserved for professional launch. Confirm milestone scope, create dedicated branch, implement, run checks, open review PR, document actual results and limitations, obtain owner acceptance and owner-controlled merge. No automatic merge. Tag/release only with authorization. Publication requires separate explicit approval and manual production deployment, not merely merge. Public repo content is already public, regardless of Pages status. Review all files and assets before commit; never use secrets in logs or artifacts.

Build verification: npm ci on Node 24, npm run check, npm run build; browser, accessibility, unit and performance checks introduced at relevant milestones. No deployment workflow in PP-004A.
