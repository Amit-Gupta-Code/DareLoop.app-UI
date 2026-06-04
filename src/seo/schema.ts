const SITE_URL = import.meta.env.VITE_APP_URL || "https://www.dareloop.app";
const SITE_NAME = "Dareloop";

/** Organization schema — used in homepage and global footer */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: [
      "https://www.facebook.com/dareloop/",
      "https://www.youtube.com/@CodeWithCodeOfficial",
      "https://www.instagram.com/dareloop.app/",
    ],
  };
}

/** WebApplication schema — homepage */
export function webAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "A gamified challenge and accountability platform where users join, create, and complete 30-day challenges with streak tracking and community leaderboards.",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** Challenge / Loop page schema */
export function challengeSchema(opts: {
  name: string;
  description: string;
  url: string;
  participantCount?: number;
  startDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.participantCount !== undefined && {
      maximumAttendeeCapacity: opts.participantCount + 10000,
      remainingAttendeeCapacity: 9999,
    }),
    ...(opts.startDate && { startDate: opts.startDate }),
  };
}

/** BreadcrumbList schema — pass in ordered list of { name, url } */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/** FAQ schema — pass array of { question, answer } */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Article schema — for blog posts */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: {
      "@type": "Person",
      name: opts.authorName || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: opts.imageUrl,
      },
    }),
  };
}

/** Person / user profile schema */
export function profileSchema(opts: {
  name: string;
  handle: string;
  profileUrl: string;
  avatarUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    identifier: opts.handle,
    url: opts.profileUrl,
    ...(opts.avatarUrl && { image: opts.avatarUrl }),
    memberOf: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** Explore / SoftwareApplication listing schema */
export function exploreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Explore Active Challenges | Dareloop",
    description:
      "Browse all active challenges on Dareloop. Join fitness, productivity, mindfulness, and self-improvement challenges with a global community.",
    url: `${SITE_URL}/explore`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
