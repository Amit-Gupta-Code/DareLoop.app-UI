import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ChevronRight } from "lucide-react";
import { getLoops, Loop } from "../../services/loopService";
import { SEOHead } from "@/src/seo/SEOHead";
import { exploreSchema, breadcrumbSchema } from "@/src/seo/schema";

const Explore = () => {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLoops()
      .then(setLoops)
      .catch(() => setError("Failed to load challenges. Try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEOHead
        title="Explore Active Challenges"
        description="Browse and join active challenges on Challenge Loop. Fitness, productivity, mindfulness, self-improvement, and more. Find your challenge and start your streak today."
        keywords="explore challenges, active challenges, join challenge, fitness challenge, productivity challenge, habit challenge, 30 day challenge"
        canonical="/explore"
        schema={[
          exploreSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Explore Challenges", url: "/explore" },
          ]),
        ]}
      />
    <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 flex flex-col gap-10 animate-in fade-in duration-600">
      <div className="space-y-3">
        <span className="badge-green">Live Challenges ⚡</span>
        <h1 className="text-3xl lg:text-[48px] font-black tracking-tight leading-none text-primary">
          Active Challenges
        </h1>
        <p className="text-text-muted text-[15px] lg:text-[17px] max-w-2xl leading-relaxed font-medium">
          Browse and join active challenges. Build better habits, stay consistent, and hit your goals — one day at a time.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="card-sleek h-56 animate-pulse bg-white/5 rounded-2xl"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 font-semibold text-sm">{error}</p>
      )}

      {!loading && !error && loops.length === 0 && (
        <p className="text-text-muted font-semibold text-sm">
          No active challenges yet. Be the first to create one!
        </p>
      )}

      {!loading && !error && loops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loops.map((loop, index) => (
            <motion.div
              key={loop.id}
              whileHover={{ y: -8, rotateZ: index % 2 === 0 ? 1 : -1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="card-sleek flex flex-col justify-between shadow-xl group overflow-hidden border-border-sleek"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    {loop.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[11px] font-black text-primary">
                      {loop.participant_count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black leading-tight group-hover:text-accent transition-colors">
                  {loop.title}
                </h3>
                <p className="text-text-muted text-[14px] line-clamp-3 leading-relaxed font-medium">
                  {loop.description}
                </p>
              </div>
              <div className="pt-8 mt-auto flex items-center justify-between border-t border-border-sleek">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/${i + loop.id}/32/32`}
                      className="w-7 h-7 rounded-full border-2 border-white shrink-0 object-cover"
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <Link
                  to={`/c/${loop.root_code}`}
                  className="btn-sleek btn-viral !py-2.5 !px-6 !text-[11px] !rounded-lg active:scale-95 group-hover:scale-105 transition-all italic tracking-tight font-black"
                >
                  Join Challenge <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Explore;
