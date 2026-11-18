# Hosted workspace

Cloudflare Worker serves the existing frontend behind HTTP Basic authentication. D1 persists pipeline records with version-checked updates; validation and suppression logic is shared with the local server. Research collected by the local connector can be imported into the research table. New Codex CLI research remains local.

Build assets with `node cloudflare/build.mjs`. Set `ACCESS_PASSWORD_HASH` as a Worker secret containing the SHA-256 hexadecimal hash of a strong password; the username is `sycamore`. Requests fail closed if the secret is absent. No applicant documents or credentials are bundled in static assets.

After approving the target account and resource creation, create D1, place its ID in wrangler.jsonc, execute schema.sql remotely, set the authentication secret and deploy with Wrangler. The database and authentication secret are account resources; changing a password requires changing the secret. Store the password securely outside Git.

`node --test cloudflare/worker.test.mjs prototype/*.test.mjs` runs local checks. Single-document storage is intended for this small initial pipeline. Worker auth runs ahead of every static asset and API path. No public asset URLs bypass it.
