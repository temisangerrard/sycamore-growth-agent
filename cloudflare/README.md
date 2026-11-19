# Hosted workspace

Cloudflare Worker serves the existing frontend without a password prompt. D1 persists pipeline records with version-checked updates; validation and suppression logic is shared with the local server. Research collected by the local connector can be imported into the research table. New Codex CLI research remains local.

Build assets with `node cloudflare/build.mjs`. At the owner’s request, the site and its API no longer require a password. Existing origin checks and record validation remain in place. Anyone who can reach the site can view and edit the public workspace. Do not store private applicant data or credentials here.

After approving the target account and resource creation, create D1, place its ID in wrangler.jsonc, execute schema.sql remotely, deploy with Wrangler. The database is a persistent account resource.

`node --test cloudflare/worker.test.mjs prototype/*.test.mjs` runs local checks. Single-document storage is intended for this small initial pipeline. Regression tests verify that assets and records open without an authentication challenge.
