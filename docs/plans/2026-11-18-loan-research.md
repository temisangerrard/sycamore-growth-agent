# Loan research workspace implementation plan

Goal: a local evidence-backed research and manual sales pipeline for Sikamo UK.
Architecture: retain Node HTTP and vanilla browser UI. Store validated records in an atomic local JSON file; serialize mutations. Keep Exa/Firecrawl as replaceable research functions and manual entry independent of model access.

1. Write storage tests for restart persistence, concurrent mutation, duplicates, validation, suppression and deletion. Run red, implement store.mjs, run green.
2. Extend HTTP API with records, drafts, CSV/brief exports and research history. Preserve local origin checks. Cap request sizes and provider calls, cache successful research, retain sources on model failure.
3. Replace partnership-specific UI with segment hypotheses, editable pipeline, reviewable drafts, missing terms and research history. Empty live pipeline; no implicit seeded leads.
4. Exercise API and browser, document runtime/provider limitations, commit on feature branch, open PR if remote bootstrap permits.

Design: the segment map contains labelled hypotheses, not proven demand. Every saved record carries provenance, timestamps and evidence. Research confidence and commercial priority are separate. Drafts never send. Suppression survives deletion using a minimal identity hash. Historical January 2024 screenshot terms conflict with later supplied terms and cannot be advertised. No applicant documents or automated eligibility decisions.
