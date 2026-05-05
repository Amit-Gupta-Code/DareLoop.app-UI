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
      "Loopify models creator growth as a graph, not a feed: every participant extends the chain and inherits social proof from the path above them.",
    sections: [
      {
        heading: "Abstract",
        paragraphs: [
          "Traditional social graphs optimize for impressions. Loopify optimizes for depth and participation—each node is an explicit opt-in to a shared challenge narrative.",
        ],
      },
      {
        heading: "Token & roadmap",
        paragraphs: [
          "Economics and on-chain plans will be published here when finalized. Until then, treat this page as the product vision anchor.",
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
