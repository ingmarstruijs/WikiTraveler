import { LINKS } from "../../lib/site";
import { ExtLink } from "./ExtLink";
import { StoryFigure } from "./StoryFigure";
import { StoryGallery } from "./StoryGallery";
import { TrustTable } from "./TrustTable";

export function StoryContent() {
  return (
    <article className="wt-www-article">
      <h1>The hotel said “accessible.” That wasn’t enough.</h1>
      <p className="wt-www-article__deck">
        A relative told me how miserable booking travel with a wheelchair still is. Curiosity and a
        UX brain did the rest, then I got sucked into an accidental product once coding stopped
        being the bottleneck.
      </p>

      <hr />

      <p>I didn’t set out to build infrastructure.</p>
      <p>
        I set out to answer a relatively human question that somehow never gets a trustworthy answer
        when you need it most:
      </p>
      <p>
        <strong>
          Is this hotel actually accessible, not “accessible according to a marketing checkbox,”
          but accessible according to someone who has been there, looked, measured, photographed,
          and cared?
        </strong>
      </p>
      <p>That question came from Maurice.</p>
      <p>
        Maurice is my cousin-in-law. He uses a wheelchair. We talked at the funeral of my uncle
        Jaap. The kind of conversation that sits between grief and ordinary life, where people
        suddenly tell you the real stuff: booking travel is exhausting when accessibility
        information is missing, outdated, contradictory, or written by someone who has never pushed
        a chair through a bathroom doorway.
      </p>
      <p>
        When a UX engineer hears a problem like that, the head does overtime. You don’t live that
        life. You still have to stand in those shoes long enough to feel the booking flow break:
        sitting with the tab open, in the chair. Will the entrance actually work? Is the
        “accessible” room reachable when the lift isn’t? Can you turn in the bathroom, or do you
        find out the sink blocks the transfer only after you’ve paid and traveled? Search says
        accessible. The photo omits the doorway. A review says “wheelchair-friendly” like “cozy” , 
        atmosphere, not evidence. Too often: <em>you won’t know until you’re there.</em>
      </p>
      <p>
        When people struggle like that, the system is often lying about complexity. It pretends the
        workflow is simple. It hides the missing data. It optimizes for the median user and calls
        the rest an edge case.
      </p>
      <p>
        Accessibility information for hotels, apartments, and other stays is not an edge case. It’s
        a trust problem dressed up as a content problem.
      </p>
      <p>
        That picture has to come first. Only then do the product and engineering questions get real
        room, what scales without lying, what’s feasible to build without up-to-date programming
        knowledge.
      </p>
      <p>
        Strong AI models change the tempo: they can implement against a picture you can already hold
        in your head. The picture is the hard part. The agents type. You’re the conductor.
      </p>
      <p>So I did what people with dangerous curiosity always do.</p>
      <p>I started building.</p>
      <p>
        First the data model. Then the sidecar. Then the mesh. Then the parts that make a side
        project start behaving like an accidental product.
      </p>
      <p>And then it got out of hand, in the useful way.</p>
      <p>Welcome to WikiTraveler.</p>
      <p>
        This piece is mainly for people who do <strong>UX and product work</strong> and are figuring
        out what AI-assisted building changes, and what it doesn’t.
        <br />
        Along the way it should also make sense if you care about{" "}
        <strong>disability and travel access</strong>, <strong>open source commons</strong>, or{" "}
        <strong>shipping weird infrastructure as a side project</strong>.
      </p>
      <p>Different readers can take different exits. Same story.</p>
      <p>
        One vocabulary note before we go on, because “UX” gets abused into meaning “someone made the
        buttons blue.” <strong>User experience (UX)</strong> is the whole lived path through a
        product: goals, confusion, trust, dead ends, what happens when the data is wrong.{" "}
        <strong>Usability</strong> is a chunk of that, can someone complete the task without
        fighting the interface? <strong>UI</strong> is the visible layer: screens, controls, layout.
        Related; not the same. Product sense asks whether we’re solving the right problem at all.
        When I say UX in this piece, I mostly mean the <em>experience of trusting a stay</em> , 
        journey and information architecture first, pixels second.
      </p>

      <hr />

      <h2>Confession: I am not a full-time distributed-systems engineer</h2>
      <p>I do UX and engineering for work.</p>
      <p>
        That means I spend a lot of time on how complex tools feel to real people: flows,
        information structure, trust, whether something is usable under pressure, usability inside
        a broader experience, with UI as one of the instruments.
      </p>
      <p>
        I can prototype. I’m not allergic to code. My programming knowledge is uneven and, in
        places, outdated. Historically that would have been enough to stop a build like this. Today
        I build with AI assistance across several projects, not because the model should own the
        product, but because I can now ship things like:
      </p>
      <ul>
        <li>a federated mesh of nodes</li>
        <li>gossip sync</li>
        <li>RS256 cross-node auth</li>
        <li>OSM ingest</li>
        <li>an audit PWA</li>
        <li>a Chrome extension</li>
        <li>an agency SDK</li>
        <li>Docker + Vercel deployment paths</li>
        <li>release compatibility policy</li>
        <li>SSRF hardening</li>
        <li>and a community model with auditors and operators</li>
      </ul>
      <p>…in six months, as a side project.</p>
      <p>Which is exactly what happened.</p>
      <p>
        <strong>
          The scarce skill is picturing the whole system as experience, as architecture, and as a
          value bet, and keeping those views coherent.
        </strong>
      </p>
      <p>AI doesn’t invent that picture.</p>
      <p>AI doesn’t invent taste.</p>
      <p>AI doesn’t invent the original problem. Maurice did.</p>
      <p>
        What it offers is <strong>hands at the tempo of thought</strong>. Multiple agents assemble
        parts. You argue via diffs, check they aren’t solving the wrong problem, and kill that path
        before it hardens.
      </p>
      <p>Throughput, it turns out, is a hell of a drug.</p>

      <hr />

      <h2>The March 2026 manifesto (mostly still true)</h2>
      <p>
        On <strong>18 March 2026</strong>, early in the build, I wrote myself a manifesto. It had a
        version number. It had emoji. It had sentences like “Distributed Truth Layer” and
        “Community-Owned Certainty.” It was earnest, a little loud, and looking back, almost
        awkwardly on target.
      </p>
      <p>The vision, compressed:</p>
      <blockquote>
        <p>
          Replace unreliable corporate booking data with a community-driven truth layer. Travelers
          deserve certainty, not best guesses. Keep insights free, open, and verified by people on
          the ground, not by whoever is selling the room.
        </p>
      </blockquote>
      <p>
        The strategy had five verbs: <strong>Expose → Verify → Decentralize → Gossip → Open-source.</strong>
      </p>
      <p>
        The toolkit was already named in spirit: <strong>Node</strong>, <strong>Lens</strong>,{" "}
        <strong>Field Kit</strong>, a <strong>gossip</strong> sync, trust tiers from official
        baseline → AI guess → community verification → multi-party consensus.
      </p>
      <p>What held:</p>
      <ul>
        <li>sidecar, not replacement</li>
        <li>AI estimates guide; they don’t become reality</li>
        <li>field audits as the scarce honest resource</li>
        <li>federated nodes so truth can’t sit behind one paywall</li>
        <li>Lens as the browser overlay</li>
        <li>open protocol / open data instincts (MIT code, CC-BY mesh data)</li>
      </ul>

      <hr />

      <h2>What WikiTraveler is (today)</h2>
      <p>
        WikiTraveler is an open-source toolkit for{" "}
        <strong>federated accessibility intelligence for travel</strong>.
      </p>
      <p>In human terms:</p>
      <ul>
        <li>
          <strong>Nodes</strong> hold the truth for geographic regions.
        </li>
        <li>
          <strong>Access</strong> is the traveler/auditor web app.
        </li>
        <li>
          <strong>Lens</strong> is the{" "}
          <ExtLink href={LINKS.lensRelease}>Chrome extension</ExtLink> that injects community facts
          into booking sites.
        </li>
        <li>
          <strong>SDK</strong> (
          <ExtLink href={LINKS.sdk}>@wikitraveler/sdk</ExtLink>) lets agencies and travel products
          embed or fetch the same data.
        </li>
        <li>
          <strong>Core</strong> shared packages define tiers, merge rules, and gossip logic.
        </li>
      </ul>
      <p>Trust is layered on purpose:</p>
      <TrustTable />
      <p>Higher tiers win on merge.</p>
      <p>That one table is the moral of the system.</p>

      <h3>What it looks like</h3>
      <p>Same trust model, different jobs, search, detail, field audit, booking sidecar, and operating a node:</p>

      <h4>Access: find a stay</h4>
      <p>Map and list over a region, with trust visible before you open a stay.</p>
      <StoryGallery
        layout="desktop-mobile"
        caption="Search on desktop and mobile. Coverage and audited stays show up before the booking decision. Scores and facts in these screenshots are made up for illustration, not real property data."
        items={[
          {
            src: "/screenshots/access-desktop.jpg",
            alt: "WikiTraveler Access on desktop: map, property list, and detail card",
            width: 1024,
            height: 732,
          },
          {
            src: "/screenshots/access-mobile.png",
            alt: "WikiTraveler Access on mobile: map of Eindhoven with an audited property sheet for The Match",
            width: 390,
            height: 844,
          },
        ]}
      />

      <h4>Access: property detail</h4>
      <p>Scores, category coverage, and fact tiers for one stay.</p>
      <StoryFigure
        src="/screenshots/access-property-the-match.png"
        alt="WikiTraveler Access property detail for The Match: accessibility score, feature badges, and Official facts"
        caption="Detail is where travelers see evidence, not a marketing checkbox. Scores and facts in this screenshot are made up for illustration, not real property data."
        width={1662}
        height={1033}
        priority
      />

      <h4>Access: audit wizard</h4>
      <p>Structured field audit with photos attached to steps and room types.</p>
      <StoryFigure
        src="/screenshots/access-audit-the-match.png"
        alt="WikiTraveler Access audit wizard for The Match: Step 1 Entrance with door width, step-free path, verified fields, and photos"
        caption="Field proof attaches to the claim, not a free-floating tag. Values and photos in this screenshot are made up for illustration, not a real audit."
        width={1047}
        height={1072}
      />

      <h4>Lens: booking sidecar</h4>
      <p>Community facts on Booking / Expedia without leaving the listing.</p>
      <StoryFigure
        src="/screenshots/lens-on-booking.png"
        alt="WikiTraveler Lens overlay on a blurred Booking.com listing for The Match: scores, feature icons, and audit photos"
        caption="Sidecar UX: stay where people already book. Scores and facts in this screenshot are made up for illustration, not real property data."
        width={1440}
        height={900}
      />

      <h4>Node Admin: operate a region</h4>
      <p>Property editing, peer gossip, and community signals for operators.</p>
      <StoryGallery
        caption="Edit audits on a stay, sync peers over gossip, review traveler signals. Property facts in these screenshots are made up for illustration, not real audits."
        items={[
          {
            src: "/screenshots/node-property-edit.png",
            alt: "WikiTraveler Node property audit for The Match: Submit audit wizard entrance step",
            width: 1280,
            height: 800,
          },
          {
            src: "/screenshots/node-peers.png",
            alt: "WikiTraveler Node Admin Peers tab showing node-eu peer with gossip protocol 2",
            width: 1280,
            height: 800,
          },
          {
            src: "/screenshots/node-signals.png",
            alt: "WikiTraveler Node Community signals queue for auditor review",
            width: 1280,
            height: 800,
          },
        ]}
      />

      <hr />

      <h2>System overview (the napkin version)</h2>
      <p>The full architecture doc is longer. The useful mental model is short:</p>
      <p>
        <strong>Clients never hold the truth. Regional nodes do, and they gossip.</strong>
      </p>
      <StoryFigure
        src="/screenshots/mesh-overview.jpg"
        alt="WikiTraveler mesh: OpenStreetMap and field audits feed gossiping nodes; Access and Lens consume the mesh; Lens overlays Booking / Expedia"
        caption="Sources feed the mesh. The mesh is the truth. Clients only ask."
        width={1200}
        height={675}
      />
      <p>
        OpenStreetMap is the baseline. People add audits and photos. That truth lives on{" "}
        <strong>nodes</strong>: same software everywhere. Nodes <strong>gossip</strong> so no
        single server covers the planet. Access, Lens, and the SDK only ask the mesh; they never
        become the source of record.
      </p>
      <StoryFigure
        src="/screenshots/mesh-coverage-geo.png"
        alt="World map: traveler in Europe signs in on an EU node; overlapping peer coverage; a US peer; search outside the home region routes to the peer that covers that place"
        caption="Coverage is geographic. Identity is not. A traveler signed in on an EU node can still look up a hotel in the US: their node routes them to the peer that covers that region. Some coverages overlap; others don’t."
        width={1671}
        height={941}
      />

      <hr />

      <h2>Sidecar, not destination</h2>
      <p>This is the UX idea I care about most.</p>
      <p>People do not wake up wanting a new travel platform.</p>
      <p>They wake up wanting a stay that won’t trap them.</p>
      <p>
        So WikiTraveler is designed as a <strong>sidecar</strong>:
      </p>
      <ol>
        <li>
          <strong>Baseline from the commons</strong>: OpenStreetMap and related open sources give
          you something to start from.
        </li>
        <li>
          <strong>Truth lives in a mesh</strong>: independent nodes gossip verified facts; no
          single vendor is required.
        </li>
        <li>
          <strong>Clients consume the mesh</strong>: Access, Lens, SDK.
        </li>
        <li>
          <strong>Existing platforms remain the booking surface</strong>: we overlay, enrich,
          deep-link, report issues.
        </li>
      </ol>
      <p>Lens is the purest expression of that idea.</p>
      <p>You’re on Booking.com / Expedia / Hotels.com.</p>
      <p>You hover a listing.</p>
      <p>
        WikiTraveler tries to resolve the property and show accessibility facts from the community
        mesh.
      </p>
      <p>
        If the area isn’t covered, it should say so honestly instead of inventing confidence.
      </p>
      <p>
        The <ExtLink href={LINKS.sdk}>SDK</ExtLink> is the same idea for product teams:
      </p>
      <blockquote>
        <p>Don’t rebuild accessibility truth.</p>
        <p>Consume the commons.</p>
        <p>
          Show it in <em>your</em> UX.
        </p>
      </blockquote>
      <p>
        Ambitious, and still early. Yet the bet is simple: an open mesh of field-checked facts is
        more useful than another closed database of half-true icons.
      </p>

      <hr />

      <h2>How the system was built (in acts)</h2>
      <p>
        I won’t pretend this arrived fully formed. It grew in layers, each one solving a real
        problem, and sometimes creating the next one.
      </p>

      <h3>Act I: Inventory without renting the universe</h3>
      <p>First problem: where do the stays come from?</p>
      <p>
        The March 2026 manifesto still assumed <strong>Amadeus</strong> as the official baseline to
        “expose” vague corporate tags. I started there because it looked like a sensible property
        feed. Then the self-service developer portal was gone: decommissioned on{" "}
        <strong>17 July 2026</strong> (their announcement), with only the Enterprise API path
        remaining, request access, sandbox, travel consultants, commercial offers. For a side
        project that wants open, keepable inventory, that’s a dead end. So I ripped the dependency
        out and went looking for a baseline I could keep building on without a sales conversation
        every time the wind changed.
      </p>
      <p>
        That search landed on <strong>OpenStreetMap</strong> (plus related open sources like
        Wheelmap ideas early on).
      </p>
      <p>OSM didn’t just replace a feed. It pushed the product toward commons thinking:</p>
      <ul>
        <li>start from open map data</li>
        <li>enrich with people who actually visit</li>
        <li>distribute the result</li>
        <li>ride beside booking platforms instead of becoming one</li>
        <li>
          eventually give <strong>coarse</strong> verified wheelchair signals back to OSM where they
          belong, and keep stay-depth (photos, measurements, trust tiers) in WikiTraveler
        </li>
      </ul>
      <p>
        Around the same time I sketched the first <strong>Lens</strong> idea (show facts on top of
        existing sites) and poked at federation experiments that didn’t all survive. The important
        leftover: <strong>the data layer should be open and ownable</strong>: and neighbourly to
        the commons it already leans on, not a one-way extract.
      </p>

      <h3>Act II: One node isn’t a world</h3>
      <p>
        Second problem: a single server can’t honestly cover the planet, and a central “node
        registry” is still a soft monopoly.
      </p>
      <p>
        So the system grew a <strong>mesh</strong>:
      </p>
      <ul>
        <li>
          every operator runs the same <strong>node</strong> software (identity, regional facts, or
          both)
        </li>
        <li>clients ask “which node is responsible for here?”</li>
        <li>
          nodes <strong>gossip</strong> deltas to peers
        </li>
        <li>bootstrap peers help a new node find the network</li>
      </ul>
      <p>
        I did try the obvious shortcut first: a central registry. It felt orderly. It was also the
        wrong shape for a commons. Killing it forced the real design: peer discovery, geographic
        resolve, and federation that doesn’t need a king.
      </p>

      <h3>Act III: Make it usable for travelers and auditors</h3>
      <p>Third problem: infrastructure without a product is a science fair.</p>
      <p>
        The traveler/auditor app started life as <strong>Field Kit</strong>: a name that sounded
        like specialist gear. The product needed to serve travelers <em>and</em> people doing
        audits. Renaming it to <strong>WikiTraveler Access</strong> wasn’t cosmetics; it changed
        who the system claimed to be for.
      </p>
      <p>Access grew into the main human interface:</p>
      <ul>
        <li>search / map / list</li>
        <li>property detail with trust-aware facts</li>
        <li>favorites and contribute flows</li>
        <li>
          a structured <strong>audit wizard</strong> with photos attached to steps and room types
        </li>
      </ul>
      <p>
        The <strong>monorepo</strong> showed up here for a boring reason: Node, Access, Lens, and
        the SDK all need the same truth definitions. One trust model. One field catalog. One shared
        blast radius: break merge logic once, and every client feels it.
      </p>

      <h3>Act IV: Make it safe enough to share</h3>
      <p>
        Fourth problem: once peers fetch peers, and JWTs cross nodes, and photos get uploaded, “it
        works on my laptop” stops being a strategy.
      </p>
      <p>
        So the build shifted from features to <strong>operability</strong>:
      </p>
      <ul>
        <li>Docker / Vercel deploy paths</li>
        <li>rate limits and AI cost controls</li>
        <li>photo storage adapters</li>
        <li>gossip compatibility checks</li>
        <li>SSRF guards on peer fetches</li>
        <li>dependency / CodeQL hygiene</li>
        <li>release versioning so operators aren’t forced into day-zero upgrades</li>
      </ul>
      <h3>Act V: Hide the mesh from travelers</h3>
      <p>
        Fifth problem: federation is only useful if normal people don’t have to understand it.
      </p>
      <p>
        <strong>RFC-0002 / hub Access</strong> is the product answer:
      </p>
      <ul>
        <li>one Access experience worldwide</li>
        <li>sign in on a node; fetch facts from whichever node covers the place you’re looking at</li>
        <li>Lens and SDK follow the same resolve pattern</li>
        <li>if an area isn’t covered, say so, don’t fake completeness</li>
      </ul>
      <p>
        That’s the system as it stands around <strong>v0.5.x</strong>: not finished, but shaped.
        Sidecar clients on the outside. A gossiping mesh on the inside. OSM as baseline. Audits as
        the scarce resource that actually creates trust.
      </p>

      <hr />

      <h2>Then I found something that already existed</h2>
      <p>
        Shortly after the toolkit started working, I found{" "}
        <ExtLink href="https://www.ongehinderd.nl/">Ongehinderd</ExtLink>, a Dutch organisation
        that already runs a system aimed at the same problem: trustworthy accessibility information
        for places people actually need to use.
      </p>
      <p>
        I wrote to them. No commercial pitch. Just: here’s an open-source side project that got out
        of hand; if any of the learning or tooling is useful to people who have been doing this work
        for years, I’d rather share it than pretend I invented the need. Data exchange, open
        standards, hands on a keyboard, whatever fits. They haven’t replied (yet). That’s fine. The
        useful move isn’t to compete with people already in the field, it’s to keep the toolkit
        open so someone who needs it can use it.
      </p>
      <p>
        Here’s the part where the engineer ego needs to sit down anyway: the code is not the hard
        part. Filling a system with <strong>reliable accessibility information</strong>: and
        keeping it trustworthy, is. Without travelers, auditors, operators, and integrators, the
        mesh is a fancy mirror of OSM tags and AI guesses. OSM is inventory, not a bathroom doorway.
        If the mesh lies about that doorway, it isn’t a backlog bug, it’s a broken promise with
        physical consequences. Open source is the offer: use, fork, or discard what exists.
      </p>
      <p>
        The bet that remains: an open commons beside Booking, rooted in OpenStreetMap, with audits
        and photos in the mesh so verified wheelchair signals can flow back where they belong.
      </p>

      <hr />

      <h2>What this built taught (without the TED Talk polish)</h2>

      <h3>1. A clear mental model beats a perfect initial stack</h3>
      <p>
        The design moved left to right. Amadeus-until-self-service-died, OSM, central registry, peer
        mesh, Field Kit, Access, hub routing, some of the best instincts arrived as workarounds.
        The surviving ideas, sidecar, commons, trust tiers, honest coverage, were less “designed
        on day one” and more “what remained after reality edited the plan.”
      </p>

      <h3>2. Agents make wrong paths ship fast, so killing them becomes the work</h3>
      <p>
        Locally coherent ideas are easy to generate now. The useful skill isn’t producing more
        surface area; it’s noticing when a path fights the product and deleting it before it hardens
        into “the product.”
      </p>

      <h3>3. Renames are architecture</h3>
      <p>
        Naming isn’t cosmetics. A rename forces a clearer claim about who the system is for and what
        it is allowed to become, and that clarity is what lets the next design decisions land.
      </p>

      <h3>4. Security work is community work</h3>
      <p>
        SSRF guards, dependency pins, trusted CORS for hub clients, these are how you respect
        operators and travelers you haven’t met yet.
      </p>

      <h3>5. Docs are part of the UX</h3>
      <p>
        Operator guides, RFCs, upgrade runbooks, community roles: if only one person understands the
        mesh, it isn’t a mesh. It’s a science project with a domain name.
      </p>

      <h3>6. Code without coverage is still vapor</h3>
      <p>
        Nodes can ship forever. If verified facts don’t accumulate in real regions, WikiTraveler
        remains a well-documented empty room. That risk is real. Naming it is part of taking the
        problem seriously.
      </p>

      <hr />

      <h2>Why you might care even if you’ll never run a node</h2>
      <p>Because this pattern is bigger than hotels.</p>
      <p>Lots of domains have the same shape:</p>
      <ul>
        <li>big platforms own the transaction surface</li>
        <li>critical contextual truth is under-modeled</li>
        <li>communities know more than databases admit</li>
        <li>AI can estimate, but shouldn’t silently become authority</li>
        <li>the useful system may be a sidecar, not a replacement</li>
      </ul>
      <p>
        Accessibility for stays is just an unusually concrete version of that pattern, with
        unusually high human stakes.
      </p>
      <p>
        Also, if you do UX or product work and you’ve been told your technical knowledge is “too
        outdated” for modern building: maybe. Or maybe your advantage is exactly that you still
        think in journeys, trust, and system boundaries, and now the implementation bottleneck is
        negotiable.
      </p>
      <p>
        Not everyone should build a federated mesh with AI assistance. This one happened
        accidentally.
      </p>

      <hr />

      <h2>An invitation, not a victory lap</h2>
      <p>WikiTraveler is still a side project that grew teeth, releases, docs, a mesh, clients.</p>
      <p>
        <strong>
          The goal was trustworthy accessibility facts for stays, via open data (beside OSM, not
          against it), a sidecar UX strategy, and AI-accelerated building. What exists now is a
          monorepo, a federated mesh, a browser extension, an SDK, too many architectural U-turns,
          and clearer respect for how hard that information is.
        </strong>
      </p>
      <p>That’s the project. That’s the lesson.</p>
      <p>If it resonated:</p>
      <ol>
        <li>
          <strong>Read</strong> the repo if you want the technical deep dive.
        </li>
        <li>
          <strong>Share</strong> it with someone who books accessible travel, builds travel
          products, or already works on access information.
        </li>
        <li>
          <strong>Reuse</strong> what helps: fork, integrate the{" "}
          <ExtLink href={LINKS.sdk}>SDK</ExtLink>, strip the pattern for another domain, or tell me
          where the architecture is wrong.
        </li>
        <li>
          <strong>Get in touch</strong> if you want hands-on Access or Lens. Public registration is
          off while this stays a controlled test, reach out via{" "}
          <ExtLink href={LINKS.github}>GitHub</ExtLink> and I’ll create an account and walk you
          through it.
        </li>
      </ol>
      <p>Tell me where I’m wrong. And if you want to take any of it further: welcome.</p>

      <hr />

      <h3>Links</h3>
      <ul>
        <li>
          GitHub: <ExtLink href={LINKS.github}>{LINKS.github}</ExtLink>
        </li>
        <li>
          Lens (Chrome Web Store):{" "}
          <ExtLink href={LINKS.lensRelease}>{LINKS.lensRelease}</ExtLink>
        </li>
        <li>
          Access (hub URL; registration currently off):{" "}
          <ExtLink href={LINKS.access}>{LINKS.access}</ExtLink>
        </li>
        <li>
          SDK (npm): <ExtLink href={LINKS.sdk}>{LINKS.sdk}</ExtLink>
        </li>
        <li>
          Docs hub: <ExtLink href={LINKS.docs}>{LINKS.docs}</ExtLink>
        </li>
      </ul>
    </article>
  );
}
