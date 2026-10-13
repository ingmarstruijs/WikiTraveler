# The hotel said “accessible.” That wasn’t enough.

### A relative told me how miserable booking travel with a wheelchair still is. Curiosity and a UX brain did the rest — then I got sucked into an accidental product once coding stopped being the bottleneck.

---

I didn’t set out to build infrastructure.

I set out to answer a relatively human question that somehow never gets a trustworthy answer when you need it most:

**Is this hotel actually accessible — not “accessible according to a marketing checkbox,” but accessible according to someone who has been there, looked, measured, photographed, and cared?**

That question came from Maurice.

Maurice is my cousin-in-law. He uses a wheelchair. We talked at the funeral of my uncle Jaap. The kind of conversation that sits between grief and ordinary life, where people suddenly tell you the real stuff: booking travel is exhausting when accessibility information is missing, outdated, contradictory, or written by someone who has never pushed a chair through a bathroom doorway.

When a UX engineer hears a problem like that, the head does overtime. You don’t live that life. You still have to stand in those shoes long enough to feel the booking flow break: sitting with the tab open, in the chair. Will the entrance actually work? Is the “accessible” room reachable when the lift isn’t? Can you turn in the bathroom, or do you find out the sink blocks the transfer only after you’ve paid and traveled? Search says accessible. The photo omits the doorway. A review says “wheelchair-friendly” like “cozy” — atmosphere, not evidence. Too often: *you won’t know until you’re there.*

When people struggle like that, the system is often lying about complexity. It pretends the workflow is simple. It hides the missing data. It optimizes for the median user and calls the rest an edge case.

Accessibility information for hotels, apartments, and other stays is not an edge case. It’s a trust problem dressed up as a content problem.

That picture has to come first. Only then do the product and engineering questions get real room — what creates value, what scales without lying, what’s feasible to build without up-to-date programming knowledge.

Strong AI models change the tempo: they can implement against a picture you can already hold in your head. The picture is the hard part. The agents type. You’re the conductor — continuously bridging **user → product/value → technique**.

So I did what people with dangerous curiosity always do.

I started building.

I got sucked in anyway. First the data model. Then the sidecar. Then the mesh. Then the monorepo. Then the parts that make a side project start behaving like an accidental product.

And then it got out of hand — in the useful way.

Welcome to WikiTraveler.

This piece is mainly for people who do **UX and product work** and are figuring out what AI-assisted building changes — and what it doesn’t.  
Along the way it should also make sense if you care about **disability and travel access**, **open source commons**, or **shipping weird infrastructure as a side project**.

Different readers can take different exits. Same story.

One vocabulary note before we go on, because “UX” gets abused into meaning “someone made the buttons blue.” **User experience (UX)** is the whole lived path through a product: goals, confusion, trust, dead ends, what happens when the data is wrong. **Usability** is a chunk of that — can someone complete the task without fighting the interface? **UI** is the visible layer: screens, controls, layout. Related; not the same. Product sense asks whether we’re solving the right problem at all. When I say UX in this piece, I mostly mean the *experience of trusting a stay* — journey and information architecture first, pixels second.

---

## Then I found something that already existed

Travel platforms are incredible at inventory, pricing, and converting intent into bookings. They are much worse at accessibility as **structured truth over time**. Someone booking with a wheelchair often gets a vague icon, a sentence that could mean anything, a filter that doesn’t match the bathroom, or a review that says “accessible” without saying *for whom*.

So I built. And shortly after the toolkit started working, I found [Ongehinderd](https://www.ongehinderd.nl/) — a Dutch organisation that already runs a system aimed at the same problem: trustworthy accessibility information for places people actually need to use.

I wrote to them. No commercial pitch. Just: here’s an open-source side project that got out of hand; if any of the learning or tooling is useful to people who have been doing this work for years, I’d rather share it than pretend I invented the need. Data exchange, open standards, hands on a keyboard — whatever fits. They haven’t replied (yet). That’s fine.

The useful conclusion for me wasn’t “compete.” It was: **I do not need to become the accidental IT department of accessibility information.**

I still care that the work helps someone. I don’t want to run a product company, grow a community as a growth loop, or own this problem alone. WikiTraveler stays open. If someone already in the field — or someone who sees the sidecar/commons pattern for a different domain — wants to pick it up, adapt it, or strip parts for their own stack, that’s closer to the point than me pretending this side project is my next career.

The bet that remains is still the same shape: treat stay accessibility like a commons — **closer to OpenStreetMap than to a closed inventory**. A **sidecar** beside the giants. OSM maps **where** things are (plus thin wheelchair tags). WikiTraveler is **can you stay and wash here** — audits, photos, trust tiers — on OSM as `OFFICIAL` baseline. Coarse verified signals (`wheelchair=yes|limited|no`) should be able to **flow back**; bed height and roll-in detail stay with the depth layer.

Not another Booking. The truth layer beside the booking journey — and neighbourly to the open map it started from.

---

## Confession: I am not a full-time distributed-systems engineer

I do UX and engineering for work.

That means I spend a lot of time on how complex tools feel to real people: flows, information structure, trust, whether something is usable under pressure — usability inside a broader experience, with UI as one of the instruments. I’ve also been poking at AI-assisted building — not because the model should own the product, but because implementation used to be the tax on having a clear system in your head.

I can prototype. I’m not allergic to code. My programming knowledge is uneven and, in places, outdated. Historically that would have been enough to stop a build like this:

- a federated mesh of nodes
- gossip sync
- RS256 cross-node auth
- OSM ingest
- an audit PWA
- a Chrome extension
- an agency SDK
- Docker + Vercel deployment paths
- release compatibility policy
- SSRF hardening
- and a community model with auditors and operators

…in six months, as a side project.

Which is exactly what happened.

The unpopular opinion worth planting early:

**Outdated coding skills are less of a blocker than people think — if you can hold the system in your head like a board on the wall.**

Journeys. Trust boundaries. Failure modes. What creates value. What’s feasible. What must stay human.

AI doesn’t invent that board.
AI doesn’t invent taste.
AI doesn’t invent the original problem — that conversation did.

What it can offer is **hands at the tempo of thought**.

Agents can assemble a lot of the parts.
Someone still has to hold the picture.
Someone still has to conduct.
The real job is the bridge: **user ↔ product/value ↔ technique** — over and over, every time a system invents a new way to lie.

And throughput, it turns out, is a hell of a drug.

---

## The March 2026 manifesto (mostly still true)

On **18 March 2026**, early in the build, I wrote myself a manifesto. It had a version number. It had emoji. It had sentences like “Distributed Truth Layer” and “Community-Owned Certainty.” It was earnest, a little loud, and — looking back — almost awkwardly on target.

The vision, compressed:

> Replace unreliable corporate booking data with a community-driven truth layer. Travelers deserve certainty, not best guesses. Keep insights free, open, and verified by people on the ground — not by whoever is selling the room.

The strategy had five verbs: **Expose → Verify → Decentralize → Gossip → Open-source.**

The toolkit was already named in spirit: **Node**, **Lens**, **Field Kit**, a **gossip** sync, trust tiers from official baseline → AI guess → community verification → multi-party consensus.

What held:

- sidecar, not replacement
- AI estimates guide; they don’t become reality
- field audits as the scarce honest resource
- federated nodes so truth can’t sit behind one paywall
- Lens as the browser overlay
- open protocol / open data instincts (MIT code, CC-BY mesh data)

The interesting part isn’t how many times the manifesto got rewritten.
It’s how much of the early shape survived contact with reality.

---

## What WikiTraveler is (today)

WikiTraveler is an open-source toolkit for **federated accessibility intelligence for travel**.

In human terms:

- **Nodes** hold the truth for geographic regions.
- **Access** is the traveler/auditor web app.
- **Lens** is the [Chrome extension](https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho) that injects community facts into booking sites.
- **SDK** lets agencies and travel products embed or fetch the same data.
- **Core** shared packages define tiers, merge rules, and gossip logic.

<p>
  <img src="../assets/screenshots/access-mobile.png" alt="WikiTraveler Access on mobile: map of Eindhoven with an audited property sheet for The Match" width="280" />
  &nbsp;
  <img src="../assets/screenshots/access-desktop.jpg" alt="WikiTraveler Access on desktop: map, property list, and detail card" width="420" />
</p>

*Access — mobile and desktop. Same trust model; different viewport.*

Trust is layered on purpose:

| Tier | Meaning |
|------|---------|
| `OFFICIAL` | Baseline from OSM / Wikidata-style sources |
| `AI_GUESS` | Machine estimate to guide auditors — not ground truth |
| `VERIFIED` | A field audit happened |
| `CONFIRMED` | Multiple independent auditors agree |

Higher tiers win on merge.

That one table is the moral of the system.

AI is allowed to help.
AI is not allowed to quietly become reality.

---

## System overview (the napkin version)

The full architecture doc is longer. The useful mental model is short:

**Clients never hold the truth. Regional nodes do — and they gossip.**

```mermaid
flowchart LR
  subgraph sources["Sources"]
    OSM["OpenStreetMap<br/>baseline"]
    Audit["Field audits<br/>+ photos"]
  end

  subgraph mesh["Node mesh = truth"]
    Home["Home node<br/>identity · JWT · resolve"]
    Data["Data node(s)<br/>regional facts"]
  end

  subgraph clients["Clients (apps & integrations)"]
    Access["Access<br/>PWA"]
    Lens["Lens<br/>browser sidecar"]
    SDK["Agency SDK"]
  end

  OSM -->|"ingest inventory"| Data
  Data -.->|"coarse verified tags<br/>(future / careful)"| OSM
  Audit --> Data
  Home <-->|"gossip"| Data
  Access -->|"login"| Home
  Access -->|"search · map · audit"| Data
  Lens -->|"resolve + facts"| Home
  Lens --> Data
  SDK --> Data
  Lens -.->|"overlay"| OTA["Booking / Expedia / …"]
```

| Piece | Job |
|-------|-----|
| **Data node** | Owns properties/facts for a geographic region |
| **Home node** | Registration, JWT, “which data node for this place?” |
| **Access** | Traveler + auditor app |
| **Lens** | Sidecar UX on existing booking sites |
| **SDK** | Embed/fetch the same facts in agency products |

<img src="../assets/screenshots/node-admin.png" alt="Node admin statistics: hundreds of thousands of OSM properties, almost all Official tier, almost no field audits yet" width="720" />

*A real node dashboard. Hundreds of thousands of stays ingested from OSM. Almost all facts still `OFFICIAL`. Audits: basically a rounding error. That gap is the product.*

---

## Sidecar, not destination

This is the UX idea I care about most.

People do not wake up wanting a new travel platform.
They wake up wanting a stay that won’t trap them.

So WikiTraveler is designed as a **sidecar**:

1. **Baseline from the commons** — OpenStreetMap and related open sources give you something to start from.
2. **Truth lives in a mesh** — independent nodes gossip verified facts; no single vendor is required.
3. **Clients consume the mesh** — Access, Lens, SDK.
4. **Existing platforms remain the booking surface** — we overlay, enrich, deep-link, report issues.

Lens is the purest expression of that idea.

You’re on Booking.com / Expedia / Hotels.com.
You hover a listing.
WikiTraveler tries to resolve the property and show accessibility facts from the community mesh.
If the area isn’t covered, it should say so honestly instead of inventing confidence.

<img src="../assets/screenshots/lens.png" alt="WikiTraveler Lens extension showing scores, feature icons, and audit photos for The Match" width="360" />

*Lens — the sidecar in practice: scores, features, audit photos, without leaving the browsing flow.*

The SDK is the same idea for product teams:

> Don’t rebuild accessibility truth.
> Consume the commons.
> Show it in *your* UX.

If that sounds ambitious: yes.
If that sounds unfinished: also yes.
If that sounds more useful than another closed database of half-true icons: that’s the bet.

---

## How the system was built (in acts)

I won’t pretend this arrived fully formed. It grew in layers — each one solving a real problem, and sometimes creating the next one.

### Act I — Inventory without renting the universe

First problem: where do the stays come from?

The March 2026 manifesto still assumed **Amadeus** as the official baseline to “expose” vague corporate tags. I started there because it looked like a sensible property feed. Then the self-service developer portal was gone: decommissioned on **17 July 2026** (their announcement), with only the Enterprise API path remaining — request access, sandbox, travel consultants, commercial offers. For a side project that wants open, keepable inventory, that’s a dead end. So I ripped the dependency out and went looking for a baseline I could keep building on without a sales conversation every time the wind changed.

That search landed on **OpenStreetMap** (plus related open sources like Wheelmap ideas early on).

OSM didn’t just replace a feed. It pushed the product toward commons thinking:

- start from open map data
- enrich with people who actually visit
- distribute the result
- ride beside booking platforms instead of becoming one
- eventually give **coarse** verified wheelchair signals back to OSM where they belong — and keep stay-depth (photos, measurements, trust tiers) in WikiTraveler

Around the same time I sketched the first **Lens** idea (show facts on top of existing sites) and poked at federation experiments that didn’t all survive. The important leftover: **the data layer should be open and ownable** — and neighbourly to the commons it already leans on, not a one-way extract.

### Act II — One node isn’t a world

Second problem: a single server can’t honestly cover the planet, and a central “node registry” is still a soft monopoly.

So the system grew a **mesh**:

- regional **data nodes** own facts for a geographic area
- clients ask “which node is responsible for here?”
- nodes **gossip** deltas to peers
- bootstrap peers help a new node find the network

I did try the obvious shortcut first: a central registry. It felt orderly. It was also the wrong shape for a commons. Killing it forced the real design: peer discovery, geographic resolve, and federation that doesn’t need a king.

### Act III — Make it usable for travelers and auditors

Third problem: infrastructure without a product is a science fair.

The traveler/auditor app started life as **Field Kit** — a name that sounded like specialist gear. The product needed to serve travelers *and* people doing audits. Renaming it to **WikiTraveler Access** wasn’t cosmetics; it changed who the system claimed to be for.

Access grew into the main human interface:

- search / map / list
- property detail with trust-aware facts
- favorites and contribute flows
- a structured **audit wizard** with photos attached to steps and room types

The **monorepo** showed up here for a boring reason: Node, Access, Lens, and the SDK all need the same truth definitions. One trust model. One field catalog. One shared blast radius: break merge logic once, and every client feels it.

### Act IV — Make it safe enough to share

Fourth problem: once peers fetch peers, and JWTs cross nodes, and photos get uploaded, “it works on my laptop” stops being a strategy.

So the build shifted from features to **operability**:

- Docker / Vercel deploy paths
- rate limits and AI cost controls
- photo storage adapters
- gossip compatibility checks
- SSRF guards on peer fetches
- dependency / CodeQL hygiene
- release versioning so operators aren’t forced into day-zero upgrades

This is where vibe-built software either grows up or stays cosplay. Accessibility data can affect real travel decisions. That raises the bar.

### Act V — Hide the mesh from travelers

Fifth problem: federation is only useful if normal people don’t have to understand it.

**RFC-0002 / hub Access** is the product answer:

- one Access experience worldwide
- **home node** = identity
- **data node** = facts for the place you’re looking at
- Lens and SDK follow the same resolve pattern
- if an area isn’t covered, say so — don’t fake completeness

That’s the system as it stands around **v0.5.x**: not finished, but shaped. Sidecar clients on the outside. A gossiping mesh on the inside. OSM as baseline. Audits as the scarce resource that actually creates trust.

---

## Vibe coding, but with adult supervision

There’s a lot of discourse about vibe coding.

Some of it is fair.
Some of it is people defending their identity as “real engineers” against a scary new productivity curve.
Some of it is warnings I agree with: if you can’t read diffs, you will ship haunted houses.

The experience is less ideological and more practical.

You can imagine a system from a handful of ideas.
You can hold the user model, the trust model, and the deployment model in your head.
You can tell when an AI suggestion is locally clever and globally stupid.
You still need help turning that mental picture into thousands of coherent lines across apps, packages, tests, docs, and CI.

So you collaborate with agents.

Hard.

Intent gets described.
The agent explores the monorepo.
You argue via diffs.
You redirect when the system drifts.
Security findings get fixed.
Operator docs get written.
Yesterday’s registry idea turns out to be a trap.
Field Kit becomes Access — because travelers aren’t a “kit.”
Another release candidate ships that is somehow both more serious and more unfinished.

The scarce skill isn’t coding speed.
It’s knowing what *not* to ship when agents can generate almost anything.

Can you keep judgment sharp when building suddenly got cheap?

That is the new UX systems problem.

---

## The product was never only the code

Here’s the part where the engineer ego needs to sit down.

The code is not the hard part anymore. Filling a system with **reliable accessibility information** — and keeping it trustworthy — is.

That needs travelers who notice gaps, auditors who go on-site, operators who run nodes, integrators who show facts where bookings happen. Without those humans the mesh is a fancy mirror of OSM tags and AI guesses. OSM is inventory, not a bathroom doorway.

I’m not recruiting a community as the growth strategy, though. I’m not looking to *build* one around myself.

I’m looking for people who already care about this problem — or who see the same sidecar/commons pattern elsewhere — and might use, fork, absorb, or discard what exists. Open source is the offer. Ownership of the mission is optional, and preferably not mine forever.

---

## Why reliability beats cleverness

If WikiTraveler tells someone a bathroom is accessible and it isn’t, that is not a bug in a backlog.

That is a broken promise with physical consequences.

So the system is biased toward:

- explicit trust tiers
- independent confirmation
- photo evidence attached to meaningful audit steps
- coverage honesty over fake completeness
- operator sovereignty over forced upgrades
- RFCs for federation-impacting changes
- security checks in CI, not as folklore

Is it perfect? No.
Is there a public Access URL? Yes — [https://access.wikitraveler.org](https://access.wikitraveler.org) — but **registration is off** right now. This is still a controlled test setup, not an open signup product. You can read the repo and docs, judge the architecture, and tell me where I’m wrong. If you want a hands-on look (auditor, operator, or sharp reviewer), reach out via GitHub.

Repo: [https://github.com/ingmarstruijs/WikiTraveler](https://github.com/ingmarstruijs/WikiTraveler)

I want the kind of feedback that stings productively.

Especially from people who travel with accessibility constraints.
Especially from people who have tried to maintain community data before.
Especially from people who look at federation and say: “cute, now show me the failure modes.”

---

## What this built taught (without the TED Talk polish)

### 1. A clear mental model beats a perfect initial stack
The design moved left to right. Amadeus-until-self-service-died, OSM, central registry, peer mesh, Field Kit, Access, hub routing — some of the best instincts arrived as workarounds. The surviving ideas — sidecar, commons, trust tiers, honest coverage — were less “designed on day one” and more “what remained after reality edited the plan.”

### 2. Agents make wrong paths ship fast — so killing them becomes the work
Locally coherent ideas are easy to generate now. The useful skill isn’t producing more surface area; it’s noticing when a path fights the product and deleting it before it hardens into “the product.”

### 3. Renames are architecture
Naming isn’t cosmetics. A rename forces a clearer claim about who the system is for and what it is allowed to become — and that clarity is what lets the next design decisions land.

### 4. Security work is community work
SSRF guards, dependency pins, trusted CORS for hub clients — these are how you respect operators and travelers you haven’t met yet.

### 5. Docs are part of the UX
Operator guides, RFCs, upgrade runbooks, community roles: if only one person understands the mesh, it isn’t a mesh. It’s a science project with a domain name.

### 6. Code without coverage is still vapor
Nodes can ship forever. If verified facts don’t accumulate in real regions, WikiTraveler remains a well-documented empty room. That risk is real. Naming it is part of taking the problem seriously.

---

## Why you might care even if you’ll never run a node

Because this pattern is bigger than hotels.

Lots of domains have the same shape:

- big platforms own the transaction surface
- critical contextual truth is under-modeled
- communities know more than databases admit
- AI can estimate, but shouldn’t silently become authority
- the useful system may be a sidecar, not a replacement

Accessibility for stays is just an unusually concrete version of that pattern, with unusually high human stakes.

Also, if you do UX or product work and you’ve been told your technical knowledge is “too outdated” for modern building: maybe.
Or maybe your advantage is exactly that you still think in journeys, trust, and system boundaries — and now the implementation bottleneck is negotiable.

Not everyone should vibe-build a federated mesh.
This one happened accidentally. The half-finished acts are both evidence and comedy.

---

## An invitation, not a victory lap

WikiTraveler is still a side project that grew teeth — releases, docs, a mesh, clients. It is not a company I intend to run.

Shipping code with agents isn’t the point.

If this resonated, the useful next steps are simple:

1. **Read** the repo docs if you want the technical deep dive.  
2. **Try** [Lens on the Chrome Web Store](https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho) — the sidecar on existing booking sites.  
3. **Judge** Access honestly — registration is off while this stays a controlled test: [https://access.wikitraveler.org](https://access.wikitraveler.org).  
4. **Share** with someone who books accessible travel, builds travel products, or already works on access information.  
5. **Reuse** what helps: fork, integrate the SDK, strip the pattern for another domain — or tell me where the architecture is wrong.

Human test: would this have helped the last time someone needed trustworthy facts before booking a stay?

Shortest summary:

**The goal was trustworthy accessibility facts for stays — via open data (beside OSM, not against it), a sidecar UX strategy, and AI-accelerated building. What exists now is a monorepo, a federated mesh, a browser extension, an SDK, too many architectural U-turns, and clearer respect for how hard that information is — and for the fact that others may already be closer to the people who need it.**

That’s the project.  
That’s the lesson.  
That’s the offer.

Read it. Share it if it’s useful. Tell me where I’m wrong.  
And if you want to take any of it further — welcome.

---

### Publish-ready links

- GitHub: https://github.com/ingmarstruijs/WikiTraveler  
- Lens (Chrome Web Store): https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho  
- Access (hub URL; registration currently off): https://access.wikitraveler.org  
- Docs hub: https://github.com/ingmarstruijs/WikiTraveler/blob/main/docs/README.md  

---

*Audience note: primary readers = UX/product people exploring AI-assisted building; secondary = a11y/disability, OSS/dev, travel tech. Channels: Medium, LinkedIn, Hacker News, plus disability / open-source / developer forums. CTA: read, share, reuse, critique — not “join my community.” Suggested tags: `#accessibility` `#opensource` `#ux` `#a11y` `#traveltech` `#federation` `#vibecoding`. Estimated reading time: ~15–18 minutes.*

**Images:** linked relatively from this file as `../assets/screenshots/` (`access-mobile.png`, `access-desktop.jpg`, `lens.png`, `node-admin.png`). On GitHub they render from the repo. For Medium/LinkedIn, upload those same files and swap in CDN URLs. Mermaid renders on GitHub; on Medium, paste a diagram screenshot if needed.

---

## Platform captions (copy/paste)

### LinkedIn

The hotel said “accessible.” That wasn’t enough.

I’m a UX engineer. After a relative who uses a wheelchair described how miserable booking travel still is, curiosity and a UX brain did the rest. Strong AI models removed the old implementation bottleneck. I got sucked into a side project that began behaving like an accidental product: federated mesh, browser sidecar, agency SDK.

Then I found organisations already working on the same problem — and realised I don’t want to become the accidental IT department of accessibility information. The code stays open; the useful ask is reuse, critique, or picking it up if it fits your work.

[LINK TO ARTICLE]

Repo: https://github.com/ingmarstruijs/WikiTraveler  
Lens: https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho  
Access (registration off): https://access.wikitraveler.org

#accessibility #ux #opensource #a11y #vibecoding

---

### Medium (subtitle + deck)

**Subtitle:** A relative told me how miserable booking travel with a wheelchair still is. Curiosity and a UX brain did the rest — then I got sucked into an accidental product once coding stopped being the bottleneck.

**Deck / intro blurb:**  
I’m not a distributed-systems engineer by trade — I do UX and engineering for work. After a conversation about booking accessible stays, I started a sidecar-style open project on top of travel platforms. This is the honest story of what got built, what got thrown away, and why I’d rather share the toolkit than run the product alone.

---

### Hacker News (title + comment)

**Title options (pick one):**
1. WikiTraveler: accidental federated accessibility data mesh for hotels (OSS)
2. Show HN: WikiTraveler – accessibility facts as a sidecar to Booking/Expedia
3. I vibe-coded a federated accessibility commons for travel stays – ask me anything-ish

**First comment (recommended for Show HN / discussion):**  
Family conversation → “accessible hotel info is unreliable” → tried Amadeus → self-service developer portal decommissioned 17 July 2026 (enterprise-only left) → moved to OpenStreetMap → somehow ended up with a monorepo, gossip mesh, audit PWA, Chrome extension (Lens), and an agency SDK.

Later found people already working on the same problem (e.g. Ongehinderd in NL). Open bet remains: CC-BY mesh + sidecar beside Booking, OSM as baseline. I’m closer to UX/engineering than to “I meant to invent federation,” and I’m not trying to become the IT shop for this domain — happy if others reuse or absorb what’s useful.

Repo: https://github.com/ingmarstruijs/WikiTraveler  
Lens: https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho  
Access (registration currently off): https://access.wikitraveler.org  
Article: [LINK]

---

### Disability / a11y forums

Short version:  
A relative who uses a wheelchair described how hard it is to find up-to-date accessibility information for hotels and other stays. I built an open prototype (web app + browser extension) that starts from open map data and is meant to be enriched by real audits and photos — not marketing checkboxes. I’m sharing it so people already in this space can judge, reuse, or take parts further — not so I can run a community product alone.

I’d love honest feedback from people who actually travel with accessibility needs: Does this solve a real problem, or the wrong one? Public signup is off while it’s a controlled test — GitHub issues / discussion welcome.

Lens: https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho  
Access (registration off): https://access.wikitraveler.org  
Article: [LINK]  
Repo: https://github.com/ingmarstruijs/WikiTraveler

---

### Dev / open-source forums

Built an MIT/CC-BY toolkit for federated accessibility facts about stays: regional nodes, gossip sync, trust tiers (OSM → AI guess → verified audit → multi-auditor confirmed), Access PWA, Lens extension, agency SDK.

Looking for sharp critique — and for people who might reuse, fork, or absorb parts rather than for me to run this as a product forever.

Article: [LINK]  
Repo: https://github.com/ingmarstruijs/WikiTraveler  
Lens: https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho

