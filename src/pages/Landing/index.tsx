import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import MOCK_DATA from "../../data/mockData";
import RootGrowthAnimation from "../../components/animations/RootGrowthAnimation";
import { SEOHead } from "@/src/seo/SEOHead";
import { webAppSchema, organizationSchema, faqSchema } from "@/src/seo/schema";

const NetworkChainLoader = lazy(() => import("../../components/common/NetworkChainLoader"));
import { useAuthStore } from "../../store/authStore";
import { getTrendingSpotlights, type TrendingSpotlight } from "../../services/landingService";
import { type Platform } from "@/src/utils/helpers";
import {
  Users,
  Link as LinkIcon,
  Rocket,
  TrendingUp,
  Star,
  Quote,
  ChevronRight,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle,
  Flame,
  Play,
  Copy,
  Check,
  Share2,
  Sparkles,
  Activity,
  Eye,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { getPlatformIcon } from "@/src/utils/helpers";
import { cn } from "@/src/utils/cn";

const MetricBox = ({
  label,
  value,
  trend,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  color: "accent" | "highlight";
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="card-main bg-surface border-border-sleek p-8 flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-black uppercase tracking-widest text-text-muted">{label}</span>
      <Icon className={`w-5 h-5 ${color === "accent" ? "text-accent" : "text-yellow-400"}`} />
    </div>
    <div className={`text-4xl font-black italic ${color === "accent" ? "text-accent" : "text-yellow-400"}`}>{value}</div>
    <div className="text-xs font-bold text-green-400 mt-2">{trend}</div>
  </motion.div>
);

const HowItWorks = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <section className="mt-20 space-y-20">

    {/* ── THE PROBLEM ─────────────────────────────── */}
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border-sleek pb-12">
        <div className="space-y-4">
          <span className="badge-green px-4 py-1">THE PROBLEM</span>
          <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic">
            Why Creators <br /><span className="text-accent">Hit a Wall.</span>
          </h2>
        </div>
        <p className="text-text-muted text-lg max-w-md font-medium leading-relaxed mb-1">
          Every creator faces the same three invisible barriers. Dareloop was built to break all three — simultaneously.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            iconBg: "bg-red-500/10",
            iconColor: "text-red-400",
            tag: "PROBLEM 01",
            title: "Algorithms Bury Your Content",
            desc: "Platforms decide who sees your work. Even your best posts disappear within hours — before your own audience gets a chance.",
          },
          {
            icon: Eye,
            iconBg: "bg-orange-400/10",
            iconColor: "text-orange-400",
            tag: "PROBLEM 02",
            title: "Your Reach Has a Ceiling",
            desc: "Your existing followers are finite. Without a distribution system, growth stalls no matter how consistently you create.",
          },
          {
            icon: Users,
            iconBg: "bg-yellow-400/10",
            iconColor: "text-yellow-400",
            tag: "PROBLEM 03",
            title: "Creators Grow Alone",
            desc: "Other creators aren't your competition — they're your biggest untapped distribution network. Most never unlock this.",
          },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="card-main bg-surface border-border-sleek p-8 space-y-4 hover:border-red-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${p.iconBg} rounded-2xl flex items-center justify-center`}>
                <p.icon className={`w-6 h-6 ${p.iconColor}`} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{p.tag}</span>
            </div>
            <h3 className="font-black text-text-main text-xl uppercase tracking-tight leading-snug">{p.title}</h3>
            <p className="text-text-muted text-sm font-medium leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* ── HOW IT WORKS ────────────────────────────── */}
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border-sleek pb-12">
        <div className="space-y-4">
          <span className="badge-green px-4 py-1">HOW IT WORKS</span>
          <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic">
            Four Steps. <br /><span className="text-accent underline decoration-border-sleek">Infinite Reach.</span>
          </h2>
        </div>
        <p className="text-text-muted text-lg max-w-md font-medium leading-relaxed mb-1">
          Dareloop is a human-powered distribution tree. Every person who joins through your link becomes a permanent node — and their entire audience becomes yours.
        </p>
      </div>

      {/* Step cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            num: 1, icon: Rocket, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20",
            title: "Create or Join a Loop",
            desc: "Pick a loop in your niche or launch your own in under 60 seconds. No complex setup.",
          },
          {
            num: 2, icon: Share2, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20",
            title: "Share Your Unique Link",
            desc: "Every participant gets one invite link. Post it anywhere — Instagram, YouTube, TikTok, X.",
          },
          {
            num: 3, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20",
            title: "Your Network Joins",
            desc: "People who click your link become permanent nodes under you in the distribution tree.",
          },
          {
            num: 4, icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20",
            title: "Reach Compounds Forever",
            desc: "Everyone they invite also multiplies your reach. Growth compounds with every generation — endlessly.",
          },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="card-main bg-surface border-border-sleek p-8 space-y-5 text-center"
          >
            <div className="relative inline-flex mx-auto">
              <div className={`w-16 h-16 ${step.bg} border ${step.border} rounded-2xl flex items-center justify-center`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card-bg border border-border-sleek text-[10px] font-black ${step.color} flex items-center justify-center`}>
                {step.num}
              </span>
            </div>
            <h3 className={`font-black text-sm uppercase tracking-tight leading-snug ${step.color}`}>{step.title}</h3>
            <p className="text-text-muted text-sm font-medium leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Growth multiplier visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-main bg-surface border-border-sleek p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">REAL EXAMPLE — YOU INVITE JUST 3 PEOPLE</span>
            <h3 className="text-3xl md:text-4xl font-black text-text-main uppercase italic tracking-tight">
              3 Invites. 27 Reach. <span className="text-accent">Compounding Forever.</span>
            </h3>
          </div>

          {/* Multiplier flow */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {[
              { level: "YOU", count: "1", desc: "Root node", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
              { level: "LEVEL 1", count: "3", desc: "Direct invites", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/30" },
              { level: "LEVEL 2", count: "9", desc: "Their network", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-400/30" },
              { level: "LEVEL 3", count: "27", desc: "Next generation", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/30" },
              { level: "BEYOND", count: "∞", desc: "Compounds forever", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-400/30" },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`${item.bg} border ${item.border} rounded-2xl p-5 text-center min-w-[90px]`}
                >
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">{item.level}</div>
                  <div className={`text-3xl font-black italic ${item.color}`}>{item.count}</div>
                  <div className="text-[10px] font-medium text-text-muted mt-1 leading-tight">{item.desc}</div>
                </motion.div>
                {i < arr.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to={isAuthenticated ? "/create" : "/signup"} className="btn-viral px-10 py-5 text-base group">
              Start My Loop <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/explore" className="btn-sleek bg-surface border-border-sleek px-8 py-5 text-base hover:bg-card-bg">
              Explore Active Loops
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Landing = () => {
  const [stats] = useState(MOCK_DATA.stats);
  const [spotlights, setSpotlights] = useState<TrendingSpotlight[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.user !== null);

  const inviteSlug =
    user?.handle?.replace(/^@/, "").trim() ||
    user?.name?.trim().toLowerCase().replace(/\s+/g, "-") ||
    "your-handle";
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${encodeURIComponent(inviteSlug)}`
      : `https://www.dareloop.app/signup?ref=${encodeURIComponent(inviteSlug)}`;

  const handleActivateLoop = () => {
    navigate(isAuthenticated ? "/explore" : "/login");
  };

  const KineticTitle = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      <motion.div 
        animate={{ x: [0, -100, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap opacity-[0.03] absolute top-0 left-0 font-black text-[20vw] leading-none select-none pointer-events-none"
      >
        RECURSIVE GROWTH RECURSIVE GROWTH RECURSIVE GROWTH
      </motion.div>
      
      <div className="relative z-10 text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="badge-green mb-6 px-6 py-2 text-xs">V3.0 HYPER-FLUID ENGINE ⚡</span>
          <h1 className="text-5xl md:text-8xl lg:text-[120px] font-black tracking-tight leading-[0.85] text-primary italic uppercase italic">
            Dareloop <br/>
            <span className="text-accent underline decoration-border-sleek">Your Reach.</span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-muted text-lg md:text-2xl max-w-2xl mx-auto font-medium"
        >
          The world's first recursive distribution protocol. <br className="hidden md:block"/> No algorithms. Just human-led viral velocity.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link to={isAuthenticated ? "/create" : "/signup"} className="btn-viral px-12 py-6 text-xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:shadow-accent/40 group">
            INITIATE GROWTH <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </Link>
          <Link to="/explore" className="btn-sleek bg-surface border-border-sleek px-10 py-6 text-lg hover:bg-card-bg">
            Examine Network
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

  useEffect(() => {
    getTrendingSpotlights()
      .then(setSpotlights)
      .catch(() => setSpotlights([]));
  }, []);

  // Defer decorative background animations until after the page is interactive
  useEffect(() => {
    const id = setTimeout(() => setBgReady(true), 800);
    return () => clearTimeout(id);
  }, []);

  const landingFAQ = faqSchema([
    {
      question: "What is Challenge Loop?",
      answer:
        "Challenge Loop is a free challenge and accountability platform where you can join or create 30-day challenges, track daily streaks, compete on leaderboards, and stay accountable through a community of like-minded people.",
    },
    {
      question: "Is Challenge Loop free?",
      answer:
        "Yes, Challenge Loop is completely free to join. Create an account and start your first challenge in under 60 seconds.",
    },
    {
      question: "Can I create my own challenge?",
      answer:
        "Absolutely. Any user can create a public or private challenge, invite friends, and track everyone's progress in real time.",
    },
    {
      question: "How does the leaderboard work?",
      answer:
        "The leaderboard ranks participants in each challenge by streak length and completion consistency. The longer your streak, the higher you climb.",
    },
    {
      question: "Is Challenge Loop available in Australia?",
      answer:
        "Yes! Challenge Loop is used by communities across Australia, the US, UK, and India. Join your local city community or compete globally.",
    },
  ]);

  return (
    <>
      <SEOHead
        title="Join Challenges. Build Streaks. Change Your Life."
        description="The challenge platform where people start, share, and complete personal challenges with a community that keeps you accountable. Track streaks, compete on leaderboards. Free to join."
        keywords="challenge app, 30 day challenge tracker, habit challenge, accountability app, streak tracker, challenge community, self improvement app, fitness challenge app"
        canonical="/"
        ogType="website"
        appendSiteName={false}
        schema={[webAppSchema(), organizationSchema(), landingFAQ]}
      />
    <div className="max-w-[1440px] mx-auto pt-12 pb-24 px-6 md:px-12 animate-in fade-in duration-700">
      {/* 2027 Hero */}
      <KineticTitle />

      {/* Why & How It Works */}
      <HowItWorks isAuthenticated={isAuthenticated} />

      {/* Spatial Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
        {/* Main Feature: Pulse Engine */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 card-main bg-surface border-border-sleek p-12 relative overflow-hidden flex flex-col justify-between min-h-[480px]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -ml-32 -mb-32" />
          {bgReady && (
            <div className="absolute inset-0 opacity-10 hidden md:block">
              <Suspense fallback={null}>
                <NetworkChainLoader dotCount={28} connectionCount={2} color="#22C55E" />
              </Suspense>
            </div>
          )}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-text-main tracking-tight uppercase italic">
                Recursive Distribution Protocol
              </h2>
            </div>
            <p className="text-text-muted text-lg md:text-xl max-w-xl font-medium leading-relaxed">
              Our V3 Engine ensures that every loop participant becomes a permanent distribution node. By passing the chain forward, you unlock views from 100% of the network that follows.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 pt-12">
            <div className="bg-card-bg border border-border-sleek backdrop-blur-md p-6 rounded-[32px] flex-1 min-w-[200px]">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Network Depth</div>
              <div className="text-3xl font-black text-text-main italic">14.2k Nodes</div>
            </div>
            <div className="bg-card-bg border border-border-sleek backdrop-blur-md p-6 rounded-[32px] flex-1 min-w-[200px]">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Viral Velocity</div>
              <div className="text-3xl font-black text-text-main italic">x140 Reach</div>
            </div>
          </div>
        </motion.div>

        {/* Side Metrics */}
        <div className="md:col-span-4 grid grid-rows-2 gap-8">
          <MetricBox label="Active Loops" value="482" trend="+12.4%" icon={Activity} color="accent" />
          <MetricBox label="Global Reach" value="1.2M" trend="+40%" icon={Eye} color="highlight" />
        </div>

        {/* Experience Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-4 card-main p-10 bg-surface border-border-sleek flex flex-col justify-center text-center space-y-6 group"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-accent transition-all duration-500">
            <LinkIcon className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-text-main italic uppercase italic">Single-Link Synergy</h3>
          <p className="text-text-muted text-sm font-medium leading-relaxed">
            One unique invitation link. Thousands of connections. Dareloop maps your growth tree across 40+ platforms seamlessly.
          </p>
        </motion.div>

        {/* Live Visualization Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-8 card-main bg-card-bg border-border-sleek p-1 min-h-[400px] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-surface z-0" />
          <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center">
            <RootGrowthAnimation />
            <div className="absolute bottom-8 left-8">
              {/* UPDATE THIS TEXT BLOCK when refreshing the node section copy */}
              <div className="text-2xl font-bold text-primary mb-2">Scale Your Reach Everywhere</div>
              <div className="text-sm font-semibold text-accent flex items-center gap-1 cursor-pointer hover:underline">
                Explore Active Growth Chains →
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust & Social Pulse */}
      <div className="mt-24 space-y-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border-sleek pb-12">
          <div className="space-y-4">
            <span className="badge-green px-4 py-1">REAL-TIME VALIDATION</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic italic">
              Proof of the <br/> <span className="text-accent">Chain.</span>
            </h2>
          </div>
          <p className="text-text-muted text-lg max-w-md font-medium leading-relaxed mb-1">
            Dareloop isn't just theory. Thousands of creators are actively scaling their reach through recursive loops right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_DATA.testimonials.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-main p-8 bg-surface border-border-sleek hover:border-accent/40 transition-all group relative"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt={t.name} />
                <div>
                  <h4 className="font-black text-text-main text-sm uppercase tracking-tight">{t.name}</h4>
                  <div className="flex items-center gap-1.5 text-accent">
                    {getPlatformIcon(t.platform as Platform)}
                    <span className="text-[10px] font-bold tracking-widest">{t.handle}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-muted text-sm font-medium leading-relaxed italic">"{t.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Marquee */}
      <div className="mt-24 bg-[#0F172A] py-12 rounded-[64px] border-none shadow-3xl relative overflow-hidden">
        {bgReady && (
          <div className="absolute inset-0 opacity-5 hidden md:block">
            <Suspense fallback={null}>
              <NetworkChainLoader dotCount={20} connectionCount={2} color="#FFFFFF" />
            </Suspense>
          </div>
        )}
        <div className="relative z-10 text-center space-y-8 px-6">
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter lowercase italic italic">
            stop fighting <br/> <span className="text-accent underline decoration-white/20">monoliths.</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Join 50k+ nodes building the world's most resilient growth engine.
          </p>
          <div className="flex justify-center">
            <button onClick={handleActivateLoop} className="btn-viral py-6 px-12 text-xl shadow-2xl hover:scale-105 transition-transform group">
              ACTIVATE MY LOOP <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Landing;