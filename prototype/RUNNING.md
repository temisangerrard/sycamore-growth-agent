# Run Sikamo UK research workspace

Requires Node 22+ and, for optional synthesis, a signed-in `codex` CLI.

```sh
node prototype/server.mjs
```

Open http://127.0.0.1:4317. Test with `node --test prototype/*.test.mjs`.

Records are written atomically to `prototype/data/records.json` (gitignored). Back up that file. Run one server process per data file. `SYCAMORE_DATA` overrides the path; `SYCAMORE_PORT` overrides the port. The server is local-only and has no shared-user authentication. Do not deploy it publicly as-is.

The optional Treg route uses connected Treg tools through the local Codex CLI: one Exa search requested (five results), followed by at most two Firecrawl page checks requested. Budget is about $0.017 per run; actual provider calls and charges are parsed from tool events. These are model instructions, not a hard billing cap. A failed worker preserves actual source events when available. No separate provider keys are required on this route.

The optional direct Exa discovery route is inherited from the starter's public MCP search integration. Firecrawl retrieval is optional via a session-only key or FIRECRAWL_API_KEY. CODEX_BIN and SYCAMORE_MODEL configure local synthesis. Provider access may fail independently; retrieved source excerpts remain reviewable when synthesis fails. Each run searches at most five sources and does not send outreach. Cache is bounded to 30 queries for one hour in server memory. Search-provider billing is not available through this interface.

The pipeline starts empty. Original seed.json is preserved in the package but is never imported automatically. Segment cards are labelled hypotheses. Public evidence does not establish eligibility. The supplied product terms conflict; see Product questions. Applicants' identity, banking and immigration documents do not belong here. Free-text notes still require operator care.

Deletion removes a record. If it was suppressed, hashed name/source/contact identities remain to prevent reimport. Suppression is irreversible in the UI. CSV and research brief downloads include saved records and their provenance; handle exports appropriately. Drafts are editable conversation starters and require human review; the application cannot send them.

Known scope: segment cards are starting hypotheses rather than validated market research; funnel counts show current stages rather than historical conversion rates. Research runs are currently session-only; saved pipeline evidence persists. The unidentified “Xa” provider and investment prospecting are not integrated. Regulatory review and approved promotions are unresolved.

Runtime finding: free Treg catalog calls work through the local CLI, but paid calls were cancelled by the runtime. Direct Exa remains the default app route. Treg → Exa → Firecrawl calls were exercised successfully from the Codex chat connector and saved locally in `prototype/data/treg-research.json`; this is real dated research, not a live app integration claim. The optional CLI adapter remains available for runtimes that approve those calls.
