import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MOCK_DATA from "../../data/mockData";
import RootGrowthAnimation from "../../components/animations/RootGrowthAnimation";
import NetworkChainLoader from "../../components/common/NetworkChainLoader";
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

const Landing = () => {
  const [stats] = useState(MOCK_DATA.stats);
  const [spotlights, setSpotlights] = useState<TrendingSpotlight[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
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
      : `https://loopify.io/signup?ref=${encodeURIComponent(inviteSlug)}`;

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
            Loopify <br/> 
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

  return (
    <div className="max-w-[1440px] mx-auto pt-12 pb-24 px-6 md:px-12 animate-in fade-in duration-700">
      {/* 2027 Hero */}
      <KineticTitle />

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
          <div className="absolute inset-0 opacity-10">
            <NetworkChainLoader dotCount={60} connectionCount={4} color="#22C55E" />
          </div>
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
            One unique invitation link. Thousands of connections. Loopify maps your growth tree across 40+ platforms seamlessly.
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
            Loopify isn't just theory. Thousands of creators are actively scaling their reach through recursive loops right now.
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
        <div className="absolute inset-0 opacity-5">
           <NetworkChainLoader dotCount={40} connectionCount={2} color="#FFFFFF" />
        </div>
        <div className="relative z-10 text-center space-y-8 px-6">
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter lowercase italic italic">
            stop fighting <br/> <span className="text-accent underline decoration-white/20">monoliths.</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Join 50k+ nodes building the world's most resilient growth engine. 
          </p>
          <button onClick={handleActivateLoop} className="btn-viral py-6 px-12 text-xl shadow-2xl hover:scale-105 transition-transform group">
            ACTIVATE MY LOOP <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;