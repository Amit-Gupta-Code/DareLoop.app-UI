import { Helmet } from "react-helmet-async";

const SITE_URL = import.meta.env.VITE_APP_URL || "https://www.dareloop.app";
const SITE_NAME = "Dareloop";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
const TWITTER_HANDLE = "@dareloop";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  /** Append " | Dareloop" to the title automatically */
  appendSiteName?: boolean;
}

export function SEOHead({
  title,
  description = "Join challenges, track streaks, compete on leaderboards, and stay accountable with a community that keeps you going. Free to join.",
  keywords,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  ogImageAlt = "Dareloop — Join Challenges. Build Streaks.",
  noindex = false,
  schema,
  appendSiteName = true,
}: SEOProps) {
  const fullTitle =
    title
      ? appendSiteName
        ? `${title} | ${SITE_NAME}`
        : title
      : `${SITE_NAME} — Join Challenges. Build Streaks. Change Your Life.`;

  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${SITE_URL}${canonical}`
    : undefined;

  const schemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* JSON-LD schema blocks */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
