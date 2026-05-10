export type StaticPageData = {
  badge: string;
  title: string;
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const STATIC_PAGES = {
  documentation: {
    badge: "Resources · Docs",
    title: "Documentation",
    lead:
      "How Loops work, how challenges propagate, and how creators plug into the growth graph. This hub will expand as the product ships.",
    sections: [
      {
        heading: "Loops & depth",
        paragraphs: [
          "A Loop is a branching challenge chain: each join creates a new node with its own invite code. Depth reflects how far the chain has grown from the root challenge.",
          "Use Explore to discover active chains and Challenge pages to join or share your position.",
        ],
      },
      {
        heading: "Accounts & profile",
        paragraphs: [
          "Sign up to attach a verified profile to joins, upload an avatar, and track your growth tree from the profile area.",
        ],
      },
    ],
  },
  "api-reference": {
    badge: "Resources · API",
    title: "API Reference",
    lead:
      "REST endpoints that power challenges, chains, and newsletter signup. Base URL comes from VITE_API_URL in the frontend client.",
    sections: [
      {
        heading: "Challenges & chains",
        paragraphs: [
          "GET /api/challenges — list active loops.",
          "POST /api/challenges — create a challenge (authenticated).",
          "GET /api/chains/{code} — loop detail and participant tree.",
          "POST /api/chains/{code}/join — join with handle and platform.",
        ],
      },
      {
        heading: "Newsletter",
        paragraphs: [
          "POST /api/newsletter/subscribe — public signup with email validation.",
        ],
      },
    ],
  },
  "growth-engine-lab": {
    badge: "Resources · Lab",
    title: "Growth Engine Lab",
    lead:
      "Experiments, metrics, and ideas for recursive distribution. The lab is where we prototype pacing, depth incentives, and map visualizations before they hit production.",
    sections: [
      {
        heading: "What lives here",
        paragraphs: [
          "Concept write-ups for viral triggers, A/B tests on join flows, and instrumentation plans for the analytics dashboard.",
          "Network Data (Analytics) in the app is the live surface for charts; this page is the narrative counterpart.",
        ],
      },
    ],
  },
  whitepaper: {
    badge: "Resources · Paper",
    title: "Whitepaper",
    lead:
      "Loopify models creator growth as a graph, not a feed: every participant extends the chain and inherits social proof from the path above them. This document explains the mechanics, rationale, and roadmap behind the system.",
    sections: [
      {
        heading: "Abstract",
        paragraphs: [
          "Traditional social graphs optimize for impressions. Loopify optimizes for depth and participation—each node is an explicit opt-in to a shared challenge narrative.",
          "The result is a compounding distribution system: every person who joins a challenge becomes a micro-distributor, and every share carries measurable social proof inherited from the nodes above. Growth becomes recursive by design, not by luck.",
        ],
      },
      {
        heading: "The problem with feeds",
        paragraphs: [
          "Algorithmic feeds reward content that triggers fast, passive reactions—likes, views, shares in isolation. They optimize for attention at the expense of participation. Creators are reduced to competing for milliseconds of scroll time.",
          "This model has a compounding disadvantage: reach is rented, not owned. If a post underperforms in the first hour, the algorithm buries it. Creators have no structural mechanism to build durable distribution.",
          "Communities form around content, but that community has no memory. There is no graph of who referred whom, no chain of trust from creator to audience, and no way to reward the people who actually moved the needle.",
        ],
      },
      {
        heading: "The Loopify model",
        paragraphs: [
          "Loopify replaces the feed with a challenge chain. A creator launches a challenge and receives a root invite code. Each person who joins using that code becomes a node in the chain and is issued their own code.",
          "Every node has a defined parent. The graph is directed and acyclic—a tree rooted at the original challenge. Depth is a first-class metric: a chain with 10 levels of participants is more structurally valuable than 1,000 passive impressions.",
          "This structure makes distribution legible. You can trace exactly which paths grew fastest, which nodes drove the most downstream joins, and where the chain stalled. That data is the growth engine.",
        ],
      },
      {
        heading: "Social proof inheritance",
        paragraphs: [
          "When a user shares their position in a chain, the share carries context: how many people are above them, who started the challenge, and how deep the chain has grown. This context is the inherited social proof.",
          "A viewer seeing a challenge at depth 8 knows that 8 layers of real people opted in before them. That is qualitatively different from seeing a post with 8,000 impressions and no visible community structure.",
          "Social proof inheritance is compounding. The deeper the chain, the stronger the signal for every new potential participant—without the creator needing to produce new content or run new campaigns.",
        ],
      },
      {
        heading: "Viral coefficient & growth mechanics",
        paragraphs: [
          "The viral coefficient K is defined as: K = i × p, where i is the average number of invites each participant sends and p is the conversion rate. A challenge with K > 1 grows exponentially. Loopify is built to push both levers.",
          "Sharing is built into the join flow—each participant receives their code immediately after joining, with one-tap share targets. Friction is minimal by design.",
          "Conversion is improved by the chain context visible on every challenge page: participant count, depth indicator, and the names of people already in the chain. Joining feels like joining a movement, not clicking an ad.",
        ],
      },
      {
        heading: "Challenge architecture",
        paragraphs: [
          "Each challenge has a title, description, duration, category, and status. The status lifecycle is: draft → active → completed. Only active challenges accept new joins.",
          "The chain is stored as an adjacency list: each participant row records its parent code, enabling efficient tree traversal and depth calculation. The root node has no parent.",
          "Analytics are computed from the chain graph: total participants, max depth, average branching factor, and top-performing nodes by downstream reach. These metrics are surfaced in the creator dashboard.",
        ],
      },
      {
        heading: "Creator incentives",
        paragraphs: [
          "Creators who launch challenges gain a permanent root position in the chain graph. Every future participant is, structurally, a downstream node from their root. The creator's social proof compounds as long as the chain grows.",
          "Unlike platform-dependent reach, the chain is durable. A challenge can be shared months after launch and still onboard new participants into the same graph, preserving the full depth history.",
          "Future releases will surface leaderboards for top chain builders, enabling creators to compete on depth and reach—not vanity metrics.",
        ],
      },
      {
        heading: "Privacy & data model",
        paragraphs: [
          "Participation is opt-in and pseudonymous by default. A join requires only a handle and platform—no personal data beyond what users choose to display on their profile.",
          "Chain graphs are public by design: the structural data (depth, branching, participant count) is what creates social proof. Individual join timestamps and referral paths are visible only to the challenge creator.",
          "All data handling follows the Loopify Privacy Policy. No participant data is sold or shared with third parties.",
        ],
      },
      {
        heading: "Roadmap",
        paragraphs: [
          "Phase 1 (current): Core chain mechanics, challenge creation, public explore feed, analytics dashboard, and the blog content engine.",
          "Phase 2: Creator leaderboards, challenge categories with filtered explore, streak tracking, and email/push notifications for chain activity.",
          "Phase 3: Public API for third-party integrations, embeddable chain widgets, and advanced graph analytics including influencer node detection and churn prediction.",
          "Phase 4: Collaborative challenges (multi-creator roots), milestone-based unlocks, and potential tokenised incentive layer pending regulatory review.",
        ],
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "The feed is not broken—it is optimized for the wrong thing. Loopify is an alternative distribution primitive: one where depth beats volume, participation beats impressions, and every join makes the next join easier.",
          "The challenge chain is the unit of growth. Build one, and every person in it becomes part of your distribution infrastructure—permanently, transparently, and without algorithmic interference.",
          "This whitepaper will be updated as the product ships. For technical documentation, see the Docs page. For the experimental layer, see the Growth Engine Lab.",
        ],
      },
    ],
  },
  "privacy-policy": {
    badge: "Legal",
    title: "Privacy Policy",
    lead: 'Last updated: April 30, 2026. Loopify Technologies ("we", "us") explains how we handle information when you use our websites and services.',
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "Account details you provide (such as name, email, and social handle), content you submit when joining loops, technical logs (IP, device, browser), and usage analytics to improve the product.",
        ],
      },
      {
        heading: "How we use data",
        paragraphs: [
          "To run the service, personalize your profile and loop map, send transactional or product emails when you opt in (e.g. newsletter), secure accounts, and comply with law.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You may update profile data where the product allows, unsubscribe from marketing via the link in emails, or contact support to exercise applicable privacy rights.",
        ],
      },
    ],
  },
  "terms-of-service": {
    badge: "Legal",
    title: "Terms of Service",
    lead: "Last updated: April 30, 2026. By accessing Loopify you agree to these terms. If you disagree, do not use the service.",
    sections: [
      {
        heading: "Use of the service",
        paragraphs: [
          "You must provide accurate information, keep credentials secure, and not abuse the platform (spam, harassment, illegal content, or attempts to disrupt infrastructure).",
        ],
      },
      {
        heading: "Content & loops",
        paragraphs: [
          "You retain rights to content you submit; you grant us a license to host, display, and distribute it as needed to operate loops and sharing features.",
        ],
      },
      {
        heading: "Disclaimer",
        paragraphs: [
          'The service is provided "as is". We may change or discontinue features; continued use after changes constitutes acceptance where permitted by law.',
        ],
      },
    ],
  },
  cookies: {
    badge: "Legal",
    title: "Cookie Policy",
    lead: "We use cookies and similar technologies to keep you signed in, remember preferences (such as theme), and understand how the product is used.",
    sections: [
      {
        heading: "Types of cookies",
        paragraphs: [
          "Essential: session and security. Functional: theme and UI state. Analytics: optional measurement to improve performance (where enabled).",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can control cookies through your browser settings. Blocking essential cookies may prevent parts of the site from working correctly.",
        ],
      },
    ],
  },
} satisfies Record<string, StaticPageData>;

export type StaticPageKey = keyof typeof STATIC_PAGES;
