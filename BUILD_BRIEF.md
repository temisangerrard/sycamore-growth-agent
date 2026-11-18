# Build handoff

Build Sycamore Growth Agent using the product and business requirements in README.md.

Start by running the included prototype and reviewing its limitations. Preserve its lead review and live research behaviour while moving records into server-side storage. Present a user with a working Manchester campaign, evidence-backed candidates, reviewed contact routes, next actions and a persisted pipeline.

The agent should use narrow tools to discover, retrieve, validate, propose record changes, draft approved partnership messages and report stored outcomes. It should explain missing evidence and keep a traceable run history. Use Exa for discovery and Firecrawl for page retrieval. Treg can provide additional capabilities after endpoint and authentication verification. Provider failures and retries must preserve partial results and spend visibility.

First implementation milestone is a persistently stored campaign and lead review workflow exercised through the app, with reliable duplicate handling and source evidence. Then add reviewed scoring, outreach drafts, session tracking and reporting.

Keep the provided seed organisations marked Found until checked. Preserve the distinction between potential partners, actual outreach, confirmed bookings and opted-in people. Use the attached dated research as starting evidence and refresh it before outreach.

A hosted version needs an explicit deployment and model runtime configuration. The local prototype uses the owner’s Codex CLI login. Verify the target account’s available model instead of assuming the prototype’s configured model is supported.

Complete work on a feature branch and deliver via a pull request with meaningful verification. Keep the implementation small, readable and aligned with existing working code.
