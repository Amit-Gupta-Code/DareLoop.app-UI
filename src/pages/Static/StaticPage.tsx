import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { STATIC_PAGES, type StaticPageKey } from "./staticPages";
import { SEOHead } from "@/src/seo/SEOHead";
import { breadcrumbSchema } from "@/src/seo/schema";

const LEGAL_KEYS: StaticPageKey[] = ["privacy-policy", "terms-of-service", "cookies"];

type StaticPageProps = { pageKey: StaticPageKey };

const StaticPage = ({ pageKey }: StaticPageProps) => {
  const data = STATIC_PAGES[pageKey];
  const isLegal = LEGAL_KEYS.includes(pageKey);

  return (
    <>
      <SEOHead
        title={data.title}
        description={data.lead}
        canonical={`/${pageKey}`}
        noindex={isLegal}
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: data.title, url: `/${pageKey}` },
        ])}
      />
    <div className="max-w-[800px] mx-auto pt-24 pb-20 px-4 md:px-8 lg:px-12 animate-in fade-in duration-500">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Growth Engine
      </Link>

      <div className="space-y-4 mb-12">
        <span className="badge-green">{data.badge}</span>
        <h1 className="text-3xl lg:text-[44px] font-black tracking-tight leading-tight text-primary">
          {data.title}
        </h1>
        <p className="text-text-muted text-[15px] leading-relaxed font-medium">{data.lead}</p>
      </div>

      <div className="space-y-10">
        {data.sections.map((section, i) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="card-main border-border-sleek p-6 md:p-8 space-y-4 shadow-sm"
          >
            <h2 className="text-lg font-black text-text-main tracking-tight">{section.heading}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-text-muted text-[14px] leading-relaxed font-medium">
                  {p}
                </p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
    </>
  );
};

export default StaticPage;
