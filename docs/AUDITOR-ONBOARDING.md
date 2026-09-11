# Auditor onboarding

**Why this exists:** Commercial AMS players fill cities with paid mappers. An open sidecar only wins if **real people** can get from “I want to help” to **first `VERIFIED` audit** without tribal knowledge. Registration on public Access is **off** during the controlled test — so onboarding is intentional, not ambient signup.

Related: [COMMUNITY.md](./COMMUNITY.md) · [ACCESS-UX.md](./ACCESS-UX.md) · [apps/README.md](../apps/README.md) Flow 2 · [FEDERATED-AUTH.md](./FEDERATED-AUTH.md) · story cold-start note in [the-hotel-said-accessible…](./story/the-hotel-said-accessible-that-wasnt-enough.md)

---

## Pipeline (target)

```text
Interest (GitHub / email / intro)
    → Intake (who, where, independence)
    → Home-node account (USER → AUDITOR)
    → Walkthrough (Access + trust tiers + one property)
    → First triage audit (photos + critical fields)
    → Follow-up (second property / firm pack / CONFIRM path)
```

Maintainers own steps until productized invite exists. Do not leave auditors stuck at “create an account yourself” while hub signup is disabled.

---

## Roles (short)

| Role | Can browse / signal | Can run audit wizard |
|------|---------------------|----------------------|
| `USER` | Yes | No |
| `AUDITOR` | Yes | Yes → `VERIFIED` facts |
| `ADMIN` | Yes | Yes + Node Admin |

Independence matters: prefer auditors who are **not** selling the room. Hotel staff can host and fix; verified facts should come from people who aren’t grading their own meat.

---

## Maintainer runbook (today)

Public Access: [https://access.wikitraveler.org](https://access.wikitraveler.org) — **registration off**. Home / data node for EU test: typically [https://node-eu.wikitraveler.org](https://node-eu.wikitraveler.org) (confirm `/api/health`).

### 1. Intake

Collect:

- Name / contact (GitHub handle preferred)
- Region they can visit (city / country)
- Context: traveler with lived experience, independent a11y auditor, firm that already inspects hotels, other
- Confirmation they understand facts are CC-BY mesh data and must be honest on-site observations

Open or reply on a GitHub issue/discussion so the trail is public when possible.

### 2. Create account + promote

On the **home node** (Node Admin → Users, or Admin API):

1. Create user with a **temporary password** (or import via `POST /api/admin/users/import`).
2. Set role to **`AUDITOR`** (`PATCH /api/admin/users/:username` with `{ "role": "AUDITOR" }`).
3. Send credentials **out of band** (not in a public issue): Access URL, home node URL, username, temp password, “change password on first login if exposed.”

Local / operator equivalent: Stats → Users on the node dashboard after `pnpm dev`.

### 3. Walkthrough (30–45 min)

Live or async checklist:

1. Sign in on **hub Access** (home node = identity).
2. Trust tiers: `OFFICIAL` → `AI_GUESS` → `VERIFIED` → `CONFIRMED` — AI is never ground truth.
3. Find a property in a covered bbox (map / search). Prefer a stay they can physically visit soon.
4. Open property → **Start audit** (Contribute / audit entry).
5. Explain: photos attach to **steps / room types**, not random tags; submit creates `VERIFIED` evidence.
6. Show how travelers see tiers in Access (and Lens if relevant).
7. How to **report** wrong data as a traveler signal vs. fixing via audit.

### 4. First audit bar (triage, not 200 points)

Ship a useful first visit, not an AMS clone. Minimum honest set when on site:

- Step-free entrance (or clear barrier)
- Lift present / usable to the room floor (if multi-storey)
- Door width (room and/or bathroom) if measurable
- Roll-in shower vs tub / walk-in-with-threshold
- Grab bars (toilet / shower) if present
- Turning space / blocking fixtures (bathroom) — note even if qualitative
- Photos of entrance, path, bathroom doorway, shower/toilet area

Partial audits are OK. Empty fake completeness is not. Mark unknowns; don’t invent measurements.

### 5. After first submit

- Confirm the property shows new `VERIFIED` facts (and photos) on Access.
- Invite a **second** independent auditor later for `CONFIRMED` where possible (≥3 distinct auditors in core merge rules).
- Ask whether they can repeat in the same city (coverage density) or bring a firm checklist on existing hotel visits.
- Offer ongoing support: GitHub issues, maintainer office hours when established.

---

## Auditor-facing checklist (send this)

**You will get:** Access login, short walkthrough, help on the first property.

**You bring:** On-site judgment, phone camera, measuring tape if you have one, honesty about what you didn’t see.

**Steps:**

1. Log in at the Access URL we send you.
2. Change the temporary password if we ask you to.
3. Open a property you can visit.
4. Start audit → fill what you can verify → add photos on the relevant steps.
5. Submit. If something is unclear, stop and ask — don’t guess tiers into existence.
6. Tell us what broke in the UX; that feedback is part of the audit.

---

## Product gaps (build next)

Documented so ROADMAP stays honest:

| Gap | Today | Better |
|-----|--------|--------|
| Signup | Registration off; manual create | Invite link / magic onboarding that creates `AUDITOR` with expiry |
| Request access | Informal GitHub | Issue template **Auditor intake** + label `auditor-onboarding` |
| Training | Live walkthrough | Short in-app first-run + link to this doc |
| Triage pack | Full field catalog in wizard | Explicit “triage” vs “deep” audit modes |
| Firms | Same as individuals | Org-aware accounts / shared checklist later |
| Signals → audit | Thin loop | Assign report → auditor queue |

---

## Success metrics

- Time from “I want to help” → **account ready** (target: &lt; 2 business days while manual)
- Time from account → **first `VERIFIED` submit**
- # active auditors with ≥1 audit in the last 90 days
- # stays in focus region with triage-complete bathroom/entrance evidence

Not: mailing-list size or earned media.

---

## Related operator APIs

- `GET /api/admin/users` — list  
- `PATCH /api/admin/users/:username` — `{ role, password? }`  
- `POST /api/admin/users/import` — bulk create/update  

Admin JWT required. See Node Admin UI Users panel.
