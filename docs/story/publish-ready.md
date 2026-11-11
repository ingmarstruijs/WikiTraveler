# Publish-ready kit

Copy/paste for Medium, LinkedIn, Hacker News, and forums. Live story: [www.wikitraveler.org/story](https://www.wikitraveler.org/story) (React in `apps/www/app/story/`). Editorial markdown archive: [the-hotel-said-accessible-that-wasnt-enough.md](./the-hotel-said-accessible-that-wasnt-enough.md).

### Publish-ready links

- GitHub: [https://github.com/ingmarstruijs/WikiTraveler](https://github.com/ingmarstruijs/WikiTraveler)  
- Lens (Chrome Web Store): [https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho](https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho)  
- Access (hub URL; registration currently off): [https://access.wikitraveler.org](https://access.wikitraveler.org)  
- SDK (npm): [https://www.npmjs.com/package/@wikitraveler/sdk](https://www.npmjs.com/package/@wikitraveler/sdk)  
- Docs hub: [https://github.com/ingmarstruijs/WikiTraveler/blob/main/docs/README.md](https://github.com/ingmarstruijs/WikiTraveler/blob/main/docs/README.md)

---

*Audience note: primary readers = UX/product people exploring AI-assisted building; secondary = a11y/disability, OSS/dev, travel tech. Channels: Medium, LinkedIn, Hacker News, plus disability / open-source / developer forums. CTA: read, share, reuse, critique, hands-on Access/Lens via GitHub contact (registration off). Suggested tags:* `#accessibility` `#opensource` `#ux` `#a11y` `#traveltech` `#federation`. *Estimated reading time: ~12 minutes.*

**Images:** linked relatively from the story as `../assets/screenshots/` (`mesh-overview.jpg`, `mesh-coverage-geo.png`, `access-desktop.jpg`, `access-mobile.png`, `access-property-the-match.png`, `access-audit-the-match.png`, `lens-on-booking.png`, Node shots, …). On GitHub they render from the repo. For Medium/LinkedIn, upload those same files and swap in CDN URLs.

**Screenshot disclaimer (use when posting product UI shots):** Scores, facts, and audit values in the Access / Lens / Node screenshots are made up for illustration, not real property data.

---

## Platform captions (copy/paste)

### LinkedIn

The hotel said “accessible.”

That wasn’t enough. Not for my cousin-in-law Maurice, who uses a wheelchair. Booking travel still means guessing from marketing checkboxes, blurry photos, and reviews that say “wheelchair-friendly” the way they say “cozy.”

That conversation wouldn’t leave me alone. So I started building.

AI assistance made the hands keep up with the thought. The hard part was still the picture: experience, architecture, and the value bet, kept coherent while agents assemble parts.

Six months later there’s an open toolkit for accessibility facts about stays: a mesh of nodes, a traveler/auditor app, a Chrome extension that sits on Booking and Expedia, and an SDK for products that want the same data. Sidecar, not another booking site. OpenStreetMap as baseline. Field audits as the thing that actually creates trust.

~12 min read: https://www.wikitraveler.org/story

If it resonates: reuse what helps, or tell me where I’m wrong. Public signup is off for now; reach out via GitHub if you want hands-on.

Repo: https://github.com/ingmarstruijs/WikiTraveler

(If you attach product screenshots: scores and facts are sample/demo data, not real property information.)

#accessibility #ux #opensource #a11y

---

### Medium (subtitle + deck)

**Subtitle:** A relative told me how miserable booking travel with a wheelchair still is. Curiosity and a UX brain did the rest, then I got sucked into an accidental product once coding stopped being the bottleneck.

**Deck / intro blurb:**  
I’m not a full-time distributed-systems engineer. I do UX and engineering for work, and I build with AI assistance across several projects. After a conversation about booking accessible stays, I started a sidecar-style open project beside travel platforms. This is the honest story of what got built, what got thrown away, and what I’d still bet on: an open mesh of field-checked facts over another closed database of half-true icons.

**Image note (caption under product screenshots):** Sample UI, scores and accessibility facts are fictional for illustration, not real property data.

---

### Hacker News (title + comment)

**Title options (pick one):**

1. WikiTraveler: accidental federated accessibility data mesh for hotels (OSS)
2. Show HN: WikiTraveler: accessibility facts as a sidecar to Booking/Expedia
3. I built a federated accessibility commons for travel stays with AI assistance (ask me anything-ish)

**First comment (recommended for Show HN / discussion):**  
Family conversation → “accessible hotel info is unreliable” → tried Amadeus → self-service developer portal decommissioned 17 July 2026 (enterprise-only left) → moved to OpenStreetMap → monorepo, gossiping nodes, audit PWA (Access), Chrome extension (Lens), agency SDK. Same node software everywhere; clients only ask; peers cover geography.

I’m UX/engineering, not “I meant to invent federation.” Scarce skill was keeping experience, architecture, and the value bet coherent while agents assemble parts. Later found people already on the same problem (e.g. Ongehinderd in NL). Open bet: CC-BY mesh + sidecar beside Booking, OSM as baseline. Happy to talk trust tiers, sidecar UX, security, or where this is still naive. Registration is off; ping GitHub for a hands-on look. (Screenshots use demo accessibility data, not real hotel facts.)

Repo: [https://github.com/ingmarstruijs/WikiTraveler](https://github.com/ingmarstruijs/WikiTraveler)  
Lens: [https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho](https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho)  
Access (registration currently off): [https://access.wikitraveler.org](https://access.wikitraveler.org)  
SDK: [https://www.npmjs.com/package/@wikitraveler/sdk](https://www.npmjs.com/package/@wikitraveler/sdk)  
Article: [LINK]

---

### Disability / a11y forums

Short version:  
A relative who uses a wheelchair described how hard it is to find up-to-date accessibility information for hotels and other stays. I built an open prototype (web app + browser extension) that starts from open map data and is meant to be enriched by real audits and photos, not marketing checkboxes. It sits beside Booking, not as another place to book.

I’d love honest feedback from people who actually travel with accessibility needs: Does this solve a real problem, or the wrong one? Public signup is off while it’s a controlled test; GitHub issues / discussion welcome if you want an account. Screenshots show sample data only, not real hotel accessibility facts.

Access (registration off): [https://access.wikitraveler.org](https://access.wikitraveler.org)  
Article: [LINK]  
Repo: [https://github.com/ingmarstruijs/WikiTraveler](https://github.com/ingmarstruijs/WikiTraveler)

---

### Dev / open-source forums

Built an MIT/CC-BY toolkit for federated accessibility facts about stays: same node software everywhere, gossip sync, trust tiers (OSM → AI guess → verified audit → multi-auditor confirmed), Access PWA, Lens extension, agency SDK. Clients only ask the mesh; they never become the source of record.

Looking for sharp critique on the architecture, and for people who might reuse or fork parts if useful. Hands-on Access/Lens needs an account; registration is off, so reach out via GitHub if you want in.

Article: [LINK]  
Repo: [https://github.com/ingmarstruijs/WikiTraveler](https://github.com/ingmarstruijs/WikiTraveler)  
Lens: [https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho](https://chromewebstore.google.com/detail/wikitraveler-lens/bkkbidghpfkojnhhjnmddegkiopjbkho)  
SDK: [https://www.npmjs.com/package/@wikitraveler/sdk](https://www.npmjs.com/package/@wikitraveler/sdk)
