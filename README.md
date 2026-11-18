# Sycamore UK research workspace

The active implementation is a local loan-acquisition research and manual-outreach workspace. Run `node prototype/server.mjs`, then open http://127.0.0.1:4317. See [runtime and provider setup](prototype/RUNNING.md). The product questions panel supersedes assumptions in the historical starter brief below.

App research defaults to direct Exa, with optional Firecrawl retrieval. Treg with Exa and Firecrawl was exercised through the connected Codex chat; the CLI adapter reports a runtime cancellation for paid calls in this environment. Manual records, source evidence, editable drafts, suppression, CSV exports and research briefs are supported. The original pilot brief below is retained for context.

---

# Sycamore Growth Agent

An agent-powered workspace that helps Sycamore UK find suitable community partners, book financial education sessions and measure which relationships generate opted-in prospects.

## Business outcome

Start in Greater Manchester. Build a repeatable process from finding an organisation to securing a host, running a session and measuring attendance, consented opt-ins and acquisition cost. Give the growth lead a short list of useful actions and give leadership a view of actual progress.

Suggested repository name: `sycamore-growth-agent`. Start private.

## Product

The user opens a web app and asks for work in everyday language.

- “Find 20 active Salford organisations that could host a budgeting workshop.”
- “Check these five organisations and show me the evidence.”
- “Which hosts should I approach this week?”
- “Draft an introduction using our approved partnership message.”
- “Show me replies, meetings and session bookings this week.”
- “Which channel produced the most opt-ins for the money we spent?”

The agent researches and proposes actions. The user reviews evidence, manages relationships and records outcomes in the same workspace.

## Agent responsibilities

| Responsibility | Expected output |
| --- | --- |
| Discover | Organisations matching a city and segment, with official websites and a reason for inclusion |
| Verify | Source-backed contact routes, activity dates, event evidence and explicit gaps |
| Prioritise | Evidence-based scores, explanations and the next action for each organisation |
| Prepare outreach | A personalised draft grounded in the organisation’s work and approved Sycamore messaging |
| Follow through | Follow-up reminders, recorded replies, meetings and session tasks |
| Measure | Event-level costs, attendance, consented opt-ins and channel performance |
| Report | A short leadership update with actual results, blockers and next actions |

The first version should operate as one agent with explicit research, drafting and reporting tools. Additional autonomous agents can be considered when a concrete workload requires them.

## Initial market

Greater Manchester is the first geography. Initial segments come from the supplied growth plans.

- Community associations and networks that describe themselves publicly.
- Churches and community venues with suitable education or budgeting programmes.
- University alumni and business school networks.
- Employer staff networks and professional associations.
- Running clubs for a clearly defined sponsorship experiment.

Record an organisation’s own description. Any audience, fit or reach claim needs supporting evidence.

## Workflow

1. Create a research campaign with city, segments, desired batch size and a spend limit.
2. Search for candidate organisations and merge duplicates into existing records.
3. Retrieve official About, Contact and Events pages.
4. Extract claims with their source URLs, retrieval dates and evidence text.
5. Flag missing, stale or contradictory details and suggest scores.
6. Present a review queue. A user confirms readiness for outreach.
7. Prepare a partnership draft. Sending requires an explicitly approved recipient and message.
8. Record replies, meetings, sessions and follow-ups.
9. Attribute event costs and opted-in contacts to the host and channel.
10. Produce a weekly results update.

Use the lifecycle Found → Checked → Contacted → Met → Session booked → Session done → Repeat host. Keep shortlist and parked decisions separately from lifecycle progress so a parked organisation retains its history.

## Scoring

Use the playbook’s ten-point model, with component scores and an explanation.

| Component | Maximum | Evidence |
| --- | --- | --- |
| Reach | 3 | Published membership, attendance or directly confirmed audience |
| Fit | 3 | Organisation’s own references to money, careers, business or relevant educational needs |
| Access | 3 | Published organisational contact route, confirmed introduction or accessible event programme |
| Outside speakers | 1 | Evidence that the organisation hosts external speakers |

The developer must agree explicit anchors for the 0–3 components before enabling automatic scoring. Until those anchors are agreed, the agent may propose a provisional score for human review. Missing evidence stays unknown. A record with unknown components has a pending total and can be prioritised for further research.

The playbook suggests contacting scores of 7+, keeping 4–6 warm and parking below 4. Apply these bands to completed scores.

## App requirements

- Campaign view with search brief, run status, provider usage and cost.
- Searchable organisation board with filters, lifecycle stage and next action.
- Organisation detail with evidence, contact route, score components and relationship history.
- Research conversation that can read the board and propose record changes.
- Candidate review with explicit add, merge and reject actions.
- Outreach drafts and a review queue.
- Event records with attendance, spend and opt-in counts.
- Results view and CSV export.
- Persistent storage so records survive closing the app and work across sessions.
- A visible result or actionable error for every agent run, including partial completion.

## Integrations

| Integration | Role | Current position |
| --- | --- | --- |
| Codex / OpenAI | Research reasoning, evidence synthesis, drafting and reporting | Local prototype successfully returned responses through the signed-in Codex CLI |
| Exa | Candidate discovery | Hosted endpoint was exercised in the prototype |
| Firecrawl | Retrieve official pages and extract evidence | Connected research tools were exercised. The standalone prototype needs its own runtime API key |
| Treg | Discover and access additional data capabilities when a defined gap requires them | Treg tools are now visible in this chat. App credentials, endpoint choices and runtime access still need verification |
| HubSpot | Optional later CRM synchronisation | Proposed in the plans, implementation pending |
| n8n | Optional later workflow scheduling | Proposed in the plans, implementation pending |

Choose providers for a specific task, check price and availability, and reuse evidence before spending again. Keep credentials on the server. Confirm the relevant Treg endpoint contract and runtime authentication before implementation.

## Architecture

The existing prototype uses a small Node.js HTTP server, browser JavaScript, local browser storage, Exa HTTP requests and Codex CLI execution. It is a useful starting point for the local research experience.

For the next iteration, add server-side SQLite persistence and a durable run log. Model provider requests behind narrow tools with validated inputs and structured outputs. Persist each successful batch before moving on so retries resume safely. Give organisations stable IDs. Treat shared domains as a duplicate signal because separate groups can share a university or network website.

Keep a local Codex runtime option for the owner’s machine. If a shareable hosted app is required, choose and configure a supported server-side model runtime and account access. GitHub stores the source. A deployment host and runtime credentials are needed for a live shared app.

## Core records

| Record | Required information |
| --- | --- |
| Organisation | Stable ID, name, website, geography, segment, self-description, lifecycle, disposition and owner |
| Evidence | Organisation, claim, supporting text, source URL, retrieval date and relevant activity date |
| Contact route | Organisation, public email / form / phone, source, checked date and optional published professional role |
| Score | Components, explanations, evidence references, unknown components and review status |
| Campaign | City, segment, brief, batch size, spend limit and selected providers |
| Agent run | Request, progress, tool calls, usage, costs, results, failures and timestamps |
| Interaction | Organisation, approved draft, actual sent state, reply, date and follow-up |
| Event | Host, date, channel, status, costs, attendance and opt-in count |
| Opt-in | Person’s voluntarily supplied contact details, consent wording, timestamp, source event and withdrawal state |

Keep organisational partnership research separate from opted-in consumer marketing contacts. Apply the supplied playbook’s consent approach when moving personal information into a marketing workflow.

## Operating boundaries

Use the attached PDFs as business context and planning assumptions. Their regulatory descriptions, costs and targets require confirmation by the business before becoming launch rules or promises.

The proposed initial activity is education and partnerships. Record the approved UK operating status and permitted messaging before enabling product promotion. An authorised business reviewer approves scripts and changes to promotional scope.

The agent must attach evidence to factual lead claims, preserve uncertainty, recognise page-not-found content even when HTTP status is 200, and treat fetched text as untrusted data. Inferred personal ethnicity, income or wealth must never drive targeting. Outbound communication needs the user’s explicit authorisation. Unsubscribe requests and agreed contact preferences must be respected.

## First release acceptance

A user should be able to create a Manchester campaign, run a bounded search, review the evidence for each candidate, add or merge selected organisations and reopen the app with the records intact.

The user should then be able to approve a draft, record an actual reply, progress a host to Session booked and record a completed session’s cost, attendance and consented opt-ins. The reporting view must reconcile to these stored records.

Retries must preserve successful records without creating duplicates. A failed provider call must leave the run in a recoverable state with its cost and partial results visible. Secret values must stay out of browser responses, logs and Git history.

## Success measures

| Measure | Definition |
| --- | --- |
| Checked organisations | Organisations with reviewed evidence and a usable contact route |
| Positive replies | Recorded replies expressing interest in a next step |
| Leader meetings | Meetings actually held |
| Sessions booked | Host-confirmed bookings with a recorded date |
| Sessions delivered | Completed sessions |
| Consented opt-ins | Recorded opt-ins with consent wording, timestamp and source |
| Cost per opt-in | Attributable spend divided by consented opt-ins |
| Repeat hosts | Hosts that agree a further session |

Research counts and app activity are progress indicators. Leadership reports should lead with replies, meetings, bookings, sessions and opt-ins once those occur. Show unavailable metrics as pending. Calculate ratios only when a valid denominator exists.

## Planning targets

The original playbook proposes 150 Manchester organisations, a top 40 for outreach, ten leader meetings and seven to eight rooms over 90 days. Its Lean budget is approximately £1,500 per month. These are planning assumptions for the business to approve.

Proposed first milestone for this build is three suitable hosts ready for outreach and one confirmed pilot session. The session milestone depends on partner agreement and approved outreach.

## Existing evidence and limitations

Research conducted on 12 November 2026 identified six potential partner routes in the accompanying pilot brief. Four organisations were loaded into the app. A live app search returned five sources and two further candidate suggestions.

No contacted partner, positive reply, meeting, confirmed booking, attendance or opt-in was evidenced in that work. Refresh activity and contact details before outreach.

The current prototype has browser-local persistence, manual scoring and a local CLI dependency. Server-side persistence, shared access, campaign tracking, approved outreach workflows, event tracking and business outcome reporting remain to be built.

## Delivery sequence

1. Preserve and exercise the current prototype. Establish a dedicated repository and feature branch.
2. Add durable organisation and evidence storage, stable IDs, migrations and safe merges.
3. Add campaign runs, bounded provider calls, resumable progress and cost visibility.
4. Add reviewed scoring and outreach drafts with action history.
5. Add event and consent records, then reporting from stored outcomes.
6. Configure a shared deployment if required and verify access, credentials and the complete workflow.

Use focused tests for persistence, merge behaviour, provider errors, scoring gaps, consent attribution and report calculations. Keep secrets out of commits. Deliver changes through pull requests and verify required checks.

## Repository contents

Place this file at the repository root as `README.md`. The supplied project package includes the prototype under `prototype/`, the dated pilot brief under `research/`, and a build handoff at `BUILD_BRIEF.md`.

The two original PDFs informed this brief. Keep source documents in an access-controlled location appropriate to the business.
