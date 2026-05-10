import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Zap, GitBranch, Users, BarChart3, ChevronRight,
  ChevronDown, ArrowRight, BookOpen, Terminal, TrendingUp,
  CheckCircle2, Copy, Check, Rocket, Globe, Award, Target,
  MessageCircle, ExternalLink, Info, AlertTriangle, Lightbulb,
  Star,
} from "lucide-react";
import { SEOHead } from "@/src/seo/SEOHead";
import { breadcrumbSchema } from "@/src/seo/schema";

// ─── Nav sections ───────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "getting-started", label: "Getting Started",    icon: Rocket    },
  { id: "loop-system",     label: "The Loop System",    icon: GitBranch  },
  { id: "challenges",      label: "Challenges",         icon: Target     },
  { id: "analytics",       label: "Analytics & Growth", icon: BarChart3  },
  { id: "profiles",        label: "Profiles & Identity",icon: Users      },
  { id: "faq",             label: "FAQ",                icon: BookOpen   },
] as const;

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "What is a Loop?",
    a: "A Loop is a viral challenge chain. When you start or join a challenge, you receive a unique invite link — your node in the network. Everyone who joins through your link branches from your node and can create their own branches, growing the tree exponentially.",
  },
  {
    q: "How is depth calculated?",
    a: "Depth is the number of hops between the challenge root and your position. The root creator sits at depth 0. Their direct invitees are depth 1. Invitees of invitees are depth 2, and so on indefinitely.",
  },
  {
    q: "Do I need an account to join a loop?",
    a: "No — you can join as a guest with just a handle and platform name. Creating an account unlocks your full loop tree, performance analytics, and a reputation score that persists across all challenges.",
  },
  {
    q: "How does the Loyalty Index work?",
    a: "The Loyalty Index measures the percentage of your chain nodes that forwarded the loop to at least one new participant. A score of 100% means every person in your tree kept the chain alive.",
  },
  {
    q: "Can I create my own challenges?",
    a: "Yes. Authenticated users can create challenges from the Create page. Set a title and description — your root invite code generates automatically. Share it and watch the tree grow.",
  },
  {
    q: "What drives the Viral Score?",
    a: "Viral Score is a composite of depth, total reach, daily growth velocity, and Loyalty Index. High-viral loops are featured prominently on the Explore page and can trend platform-wide.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl bg-[#0D1117] border border-white/10 overflow-hidden my-5 group">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 hover:text-white/70 transition-colors"
        >
          {copied
            ? <><Check className="w-3 h-3 text-accent" /><span className="text-accent">Copied</span></>
            : <><Copy className="w-3 h-3" />Copy</>
          }
        </button>
      </div>
      <pre className="px-5 py-4 text-[12.5px] text-white/75 overflow-x-auto font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning";
  children: ReactNode;
}) {
  const cfg = {
    info:    { bg: "bg-blue-500/5",   border: "border-blue-500/20",   Icon: Info,          color: "text-blue-400",   label: "Note"   },
    tip:     { bg: "bg-accent/5",     border: "border-accent/20",     Icon: Lightbulb,     color: "text-accent",     label: "Tip"    },
    warning: { bg: "bg-orange-500/5", border: "border-orange-500/20", Icon: AlertTriangle, color: "text-orange-400", label: "Heads up"},
  }[type];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border} my-5`}>
      <cfg.Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
      <div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
        <div className="text-[13px] text-text-muted font-medium leading-relaxed mt-1">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: React.FC<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <h2 id={id} className="text-2xl font-black text-primary scroll-mt-28">{children}</h2>
    </div>
  );
}

// ─── Loop depth SVG diagram ──────────────────────────────────────────────────

function LoopDepthDiagram() {
  // positions in a 520×220 viewBox
  const root  = { cx: 260, cy: 38 };
  const d1    = [{ cx: 130, cy: 118 }, { cx: 390, cy: 118 }];
  const d2    = [
    { cx: 65,  cy: 198 },
    { cx: 195, cy: 198 },
    { cx: 325, cy: 198 },
    { cx: 455, cy: 198 },
  ];

  return (
    <div className="bg-surface rounded-2xl border border-border-sleek p-5 my-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loop Depth Visualizer</span>
        <span className="badge-green text-[9px]">Interactive</span>
      </div>

      <svg viewBox="0 0 520 222" className="w-full" aria-label="Loop depth tree diagram">
        {/* Lines — depth 0 → 1 */}
        <line x1={root.cx} y1={root.cy + 20} x2={d1[0].cx} y2={d1[0].cy - 18} stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 3" />
        <line x1={root.cx} y1={root.cy + 20} x2={d1[1].cx} y2={d1[1].cy - 18} stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 3" />
        {/* Lines — depth 1 → 2 */}
        {[
          [d1[0], d2[0]], [d1[0], d2[1]],
          [d1[1], d2[2]], [d1[1], d2[3]],
        ].map(([a, b], i) => (
          <line key={i} x1={(a as typeof root).cx} y1={(a as typeof root).cy + 17} x2={(b as typeof root).cx} y2={(b as typeof root).cy - 14}
            stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
        ))}

        {/* Root node */}
        <circle cx={root.cx} cy={root.cy} r="20" fill="#22C55E" />
        <text x={root.cx} y={root.cy - 0.5} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="system-ui">YOU</text>
        <text x={root.cx} y={root.cy + 28} textAnchor="middle" fill="#22C55E" fontSize="8" fontWeight="800" fontFamily="system-ui">Root · Depth 0</text>

        {/* Depth 1 nodes */}
        {d1.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="17" fill="white" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.5" />
            <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="8" fontWeight="700" fontFamily="system-ui">D1</text>
            <text x={n.cx} y={n.cy + 26} textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontWeight="600" fontFamily="system-ui">{["Alice","Bob"][i]}</text>
          </g>
        ))}

        {/* Depth 2 nodes */}
        {d2.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="13" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize="7.5" fontWeight="600" fontFamily="system-ui">D2</text>
            <text x={n.cx} y={n.cy + 21} textAnchor="middle" fill="#CBD5E1" fontSize="7" fontFamily="system-ui">{["C","D","E","F"][i]}</text>
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-sleek mt-1">
        {[
          { label: "Total Nodes",  value: "7" },
          { label: "Max Depth",   value: "2" },
          { label: "Viral Factor", value: "2.0×" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-sm font-black text-text-main">{s.value}</div>
            <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const [openFaq, setOpenFaq]             = useState<number | null>(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollHeight - el.clientHeight;
      setScrollProgress(pct > 0 ? (el.scrollTop / pct) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-15% 0% -65% 0%", threshold: 0 },
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEOHead
        title="Documentation — Challenge Loop Platform Guide"
        description="Complete guide to Challenge Loop: how loops work, challenge creation, depth analytics, profiles, and the viral growth engine. Start in 60 seconds."
        canonical="/documentation"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Documentation", url: "/documentation" },
        ])}
      />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 border-b border-border-sleek bg-card-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 right-0 w-[700px] h-[500px] bg-accent/[0.04] rounded-full blur-[140px] pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #22C55E 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-text-main">Documentation</span>
          </nav>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="badge-green">Resources · Docs</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-text-muted uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                v1.0 · Live
              </span>
            </div>

            <h1 className="text-4xl lg:text-[52px] font-black tracking-tight text-primary leading-[1.05] mb-4">
              Build your first<br />
              <span className="text-accent">viral loop</span> today.
            </h1>
            <p className="text-text-muted text-[15px] leading-relaxed font-medium max-w-lg mb-8">
              Everything you need to understand, create, and grow recursive challenge loops.
              From a 60-second quick-start to deep-dive analytics.
            </p>

            {/* Search */}
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="search"
                placeholder="Search docs… e.g. 'how loops work'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border-sleek text-[13px] font-medium placeholder:text-text-muted/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted/40 bg-surface border border-border-sleek rounded px-1.5 py-0.5 hidden sm:block">
                /
              </kbd>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-5 mt-10">
            {[
              { icon: BookOpen,    label: "6 sections" },
              { icon: Zap,         label: "60-second quickstart" },
              { icon: TrendingUp,  label: "Viral by design" },
              { icon: CheckCircle2,label: "Always up to date" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-[12px] font-bold text-text-muted">
                <s.icon className="w-3.5 h-3.5 text-accent" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three-column layout ── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="flex gap-10 xl:gap-14">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:block w-[210px] shrink-0">
            <div className="sticky top-[88px] space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2 mb-3">On this page</p>

              {NAV_SECTIONS.map(({ id, label, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-bold transition-all text-left group ${
                      active
                        ? "bg-accent/10 text-accent border border-accent/15"
                        : "text-text-muted hover:bg-surface hover:text-text-main border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-accent" : "text-text-muted group-hover:text-accent transition-colors"}`} />
                    {label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
                  </button>
                );
              })}

              {/* Divider */}
              <div className="pt-5 mt-3 border-t border-border-sleek space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2 mb-3">Platform</p>
                {[
                  { label: "Explore Loops",    to: "/explore", icon: Globe    },
                  { label: "Create Challenge", to: "/create",  icon: Rocket   },
                  { label: "My Performance",  to: "/profile", icon: BarChart3 },
                ].map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold text-text-muted hover:bg-surface hover:text-accent transition-all group border border-transparent"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 group-hover:text-accent transition-colors" />
                    {label}
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                  </Link>
                ))}
              </div>

              {/* CTA card */}
              <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/15 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Rocket className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="text-[11px] font-black text-text-main leading-snug">
                  Ready to build?
                </div>
                <p className="text-[10px] text-text-muted font-medium leading-relaxed">
                  Start your first loop in under 60 seconds.
                </p>
                <Link
                  to="/create"
                  className="flex items-center gap-1 text-[10px] font-black text-accent uppercase tracking-widest hover:gap-2 transition-all"
                >
                  Launch now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 space-y-24">

            {/* ─ Getting Started ─ */}
            <section id="getting-started" className="scroll-mt-28">
              <SectionHeader id="getting-started" icon={Rocket}>Getting Started</SectionHeader>

              <p className="text-text-muted text-[14px] leading-relaxed font-medium mb-8">
                Challenge Loop is a recursive viral growth platform. You launch or join challenges, share unique invite links,
                and watch your network multiply — every node is a real person with their own branch.
              </p>

              {/* Quickstart cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    step: "01", icon: Users, title: "Create Account",
                    desc: "Sign up with Google in one click. Your profile anchors your loop identity and persists across all challenges.",
                    accent: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", iconBg: "bg-blue-500/10", iconColor: "text-blue-500",
                  },
                  {
                    step: "02", icon: Target, title: "Start a Challenge",
                    desc: "Define your loop — a title, description, and your root invite code is auto-generated. You're live instantly.",
                    accent: "from-accent/10 to-accent/5", border: "border-accent/20", iconBg: "bg-accent/10", iconColor: "text-accent",
                  },
                  {
                    step: "03", icon: TrendingUp, title: "Share & Grow",
                    desc: "Post your link anywhere. Each join becomes a new branch. Watch your tree visualize in real-time on your profile.",
                    accent: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-500",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className={`card-main p-5 bg-gradient-to-b ${card.accent} ${card.border} relative overflow-hidden group hover:shadow-lg transition-all`}
                  >
                    <div className={`absolute top-3 right-4 text-[32px] font-black opacity-[0.06] ${card.iconColor}`}>{card.step}</div>
                    <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}>
                      <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <h3 className="font-black text-text-main text-[13.5px] mb-1.5">{card.title}</h3>
                    <p className="text-text-muted text-[12px] leading-relaxed font-medium">{card.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Callout type="tip">
                Already have an account?{" "}
                <Link to="/create" className="text-accent font-black underline underline-offset-2">Launch a Challenge</Link>
                {" "}— a loop can be live in under 60 seconds.
              </Callout>

              {/* API quickstart */}
              <div className="mt-6">
                <p className="text-[12px] font-black text-text-muted uppercase tracking-widest mb-3">Quick API start</p>
                <CodeBlock
                  language="curl · Start a loop"
                  code={`# 1. Create a challenge (requires auth token)
curl -X POST https://api.challengeloop.co/api/challenges \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "title": "30-Day Build", "description": "Ship something every day." }'

# Response → your root code
{ "challenge_id": "ch_abc123", "code": "ROOT_CODE" }

# 2. Your shareable loop URL
https://challengeloop.co/c/ROOT_CODE`}
                />
              </div>
            </section>

            {/* ─ Loop System ─ */}
            <section id="loop-system" className="scroll-mt-28">
              <SectionHeader id="loop-system" icon={GitBranch}>The Loop System</SectionHeader>

              <p className="text-text-muted text-[14px] leading-relaxed font-medium mb-6">
                A Loop is a recursive tree. Every participant gets their own unique invite code — a node in the network.
                When someone joins through your link, they branch from your node and can invite others,
                creating exponential depth.
              </p>

              <LoopDepthDiagram />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 mb-6">
                {[
                  { icon: GitBranch, title: "Depth",         desc: "Hops from the root to your position. Root creator = 0. Their direct invitees = 1. And so on." },
                  { icon: Users,     title: "Reach",         desc: "Total participants across all branches below your node — direct and deeply nested." },
                  { icon: TrendingUp,title: "Viral Score",   desc: "Composite of depth, reach, velocity, and loyalty. Drives Explore page ranking and trending features." },
                  { icon: Award,     title: "Loyalty Index", desc: "Percentage of your chain nodes that passed the loop to at least one new participant." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-surface border border-border-sleek hover:border-accent/30 transition-colors">
                    <item.icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[12.5px] font-black text-text-main mb-1">{item.title}</div>
                      <div className="text-[12px] text-text-muted font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <CodeBlock
                language="GET /api/chains/{code} · Loop detail"
                code={`{
  "challenge_id": "ch_abc123",
  "challenge_title": "30-Day Build Challenge",
  "current_code": "usr_xyz",
  "current_depth": 3,
  "max_depth": 7,
  "viral_score": 94.2,
  "is_trending": true,
  "participants": [
    { "username": "you",   "depth": 0, "viral_score": 94.2 },
    { "username": "alice", "depth": 1, "viral_score": 61.0 },
    { "username": "bob",   "depth": 2, "viral_score": 28.4 }
  ]
}`}
              />
            </section>

            {/* ─ Challenges ─ */}
            <section id="challenges" className="scroll-mt-28">
              <SectionHeader id="challenges" icon={Target}>Challenges</SectionHeader>

              <p className="text-text-muted text-[14px] leading-relaxed font-medium mb-6">
                Challenges are the root containers for loops. A challenge has a title, description, status,
                and a root chain — the starting point of the entire loop tree.
              </p>

              <div className="space-y-4">
                {/* Creating */}
                <div className="card-main p-5 hover:border-accent/30 transition-colors">
                  <h3 className="font-black text-text-main text-[14px] mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Creating a Challenge
                  </h3>
                  <p className="text-text-muted text-[13px] leading-relaxed mb-4">
                    Navigate to{" "}
                    <Link to="/create" className="text-accent font-bold underline underline-offset-2">Create Challenge</Link>.
                    Enter a title and description. Your root invite code is generated automatically.
                    Your loop is immediately live at{" "}
                    <code className="bg-surface border border-border-sleek px-1.5 py-0.5 rounded text-[11.5px] font-mono text-accent">/c/YOUR_CODE</code>.
                  </p>
                  <CodeBlock
                    language="POST /api/challenges"
                    code={`POST /api/challenges
Authorization: Bearer {your_token}

{
  "title": "30-Day Build in Public",
  "description": "Ship one thing every day for 30 days."
}

// ✅ Response
{
  "challenge_id": "ch_xyz789",
  "code": "root_abc"
}`}
                  />
                </div>

                {/* Joining */}
                <div className="card-main p-5 hover:border-accent/30 transition-colors">
                  <h3 className="font-black text-text-main text-[14px] mb-1.5 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-accent" />
                    Joining a Challenge
                  </h3>
                  <p className="text-text-muted text-[13px] leading-relaxed mb-3">
                    Visit any{" "}
                    <code className="bg-surface border border-border-sleek px-1.5 py-0.5 rounded text-[11.5px] font-mono text-accent">/c/CODE</code>{" "}
                    URL. Enter your handle and platform. You immediately receive your own unique code to share forward.
                  </p>
                  <Callout type="info">
                    You can join anonymously (guest mode) or with an account.
                    Account joins are tracked in your profile analytics and build your reputation score.
                  </Callout>
                  <CodeBlock
                    language="POST /api/chains/{code}/join"
                    code={`POST /api/chains/root_abc/join
// Auth optional — works for guests too

{
  "username": "yourhandle",
  "platform": "twitter"
}

// ✅ Response — your new node code
{
  "code": "usr_newcode123",
  "already_joined": false
}`}
                  />
                </div>

                {/* Status */}
                <div className="card-main p-5">
                  <h3 className="font-black text-text-main text-[14px] mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    Challenge Statuses
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { status: "active",   color: "bg-accent/10 text-accent border-accent/20",       desc: "Open — anyone can join via invite link" },
                      { status: "trending", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", desc: "High viral score — featured on Explore" },
                      { status: "closed",   color: "bg-text-muted/10 text-text-muted border-border-sleek",  desc: "No longer accepting new participants" },
                    ].map((s) => (
                      <div key={s.status} className="p-3 rounded-xl bg-surface border border-border-sleek">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2 ${s.color}`}>
                          {s.status}
                        </span>
                        <p className="text-[11px] text-text-muted font-medium leading-snug">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ─ Analytics ─ */}
            <section id="analytics" className="scroll-mt-28">
              <SectionHeader id="analytics" icon={BarChart3}>Analytics & Growth</SectionHeader>

              <p className="text-text-muted text-[14px] leading-relaxed font-medium mb-6">
                The Performance tab in your profile surfaces real metrics computed live from your challenge network graph.
                No vanity numbers — every metric traces directly to participant behavior.
              </p>

              {/* Metric grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { metric: "Total Reach",   def: "All participants across your challenge trees, direct and indirect",   icon: Users      },
                  { metric: "Max Depth",     def: "Deepest chain level reached in any of your loops",                   icon: GitBranch  },
                  { metric: "Loyalty Index", def: "% of nodes that forwarded the loop to ≥ 1 new participant",          icon: Award      },
                  { metric: "Viral Peak",    def: "The single day with the highest new joins in your history",          icon: TrendingUp },
                ].map((m) => (
                  <div key={m.metric} className="p-4 rounded-xl bg-surface border border-border-sleek group hover:border-accent/30 transition-colors">
                    <m.icon className="w-4 h-4 text-accent mb-2" />
                    <div className="text-[11px] font-black text-text-main uppercase tracking-wider mb-1">{m.metric}</div>
                    <div className="text-[11px] text-text-muted font-medium leading-snug">{m.def}</div>
                  </div>
                ))}
              </div>

              <Callout type="tip">
                The Viral Distribution Map (bar chart on your profile) shows daily join counts for the last 30 days.
                Spikes indicate successful shares, press mentions, or platform features.
              </Callout>

              <CodeBlock
                language="GET /api/analytics/my · Requires auth"
                code={`{
  "total_reach": 1420,
  "max_depth": 9,
  "loyalty_index": 73.4,
  "last_viral_peak": {
    "date": "May 6, 2026",
    "joins": 47,
    "days_ago": 4
  },
  "growth_data": [
    { "date": "04/10", "joins": 12 },
    { "date": "04/11", "joins": 34 },
    { "date": "04/12", "joins": 8  }
  ]
}`}
              />

              {/* Growth tips */}
              <div className="mt-6 card-main p-5">
                <h3 className="font-black text-text-main text-[13.5px] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Growth Playbook — What moves the metrics
                </h3>
                <div className="space-y-2.5">
                  {[
                    { n: "01", text: "Share your loop link at the end of a public post or thread — social proof compounds." },
                    { n: "02", text: "Tight, specific challenges (not generic ones) recruit within tight communities — better depth, less churn." },
                    { n: "03", text: "Re-share every time someone notable joins — their audience extends your reach without extra effort." },
                    { n: "04", text: "Check your Viral Distribution Map daily. Spikes tell you which channel is working best." },
                  ].map((tip) => (
                    <div key={tip.n} className="flex gap-3">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest mt-1 w-5 shrink-0">{tip.n}</span>
                      <p className="text-[12.5px] text-text-muted font-medium leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─ Profiles ─ */}
            <section id="profiles" className="scroll-mt-28">
              <SectionHeader id="profiles" icon={Users}>Profiles & Identity</SectionHeader>

              <p className="text-text-muted text-[14px] leading-relaxed font-medium mb-6">
                Your profile is your loop identity. It aggregates every challenge you've created or joined,
                your performance metrics, and your reputation across the entire network.
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  { field: "Handle",       desc: "Your unique @username. It builds reputation across all challenges — choose carefully." },
                  { field: "Avatar",       desc: "Google OAuth photo or custom upload. Appears on every node you occupy in every loop tree." },
                  { field: "Bio",          desc: "Short description visible to challenge participants who inspect your node." },
                  { field: "Loop Verified",desc: "Badge awarded after your first loop reaches ≥ 2 depth levels with ≥ 3 participants." },
                  { field: "Created",      desc: "Challenges you launched — shown on the 'My Challenges' tab with share controls." },
                  { field: "Joined",       desc: "Loops you participated in but didn't create — tracked separately on the 'Joined Loops' tab." },
                ].map((item) => (
                  <div key={item.field} className="flex gap-4 p-4 rounded-xl bg-surface border border-border-sleek hover:border-accent/25 transition-colors">
                    <div className="text-[11px] font-black text-accent uppercase tracking-wider w-28 shrink-0 pt-0.5">{item.field}</div>
                    <div className="text-[13px] text-text-muted font-medium leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>

              <Callout type="warning">
                Guest joins (no account) won't appear in your profile Performance tab. Create an account and join with your authenticated session to see full analytics.
              </Callout>
            </section>

            {/* ─ FAQ ─ */}
            <section id="faq" className="scroll-mt-28">
              <SectionHeader id="faq" icon={BookOpen}>Frequently Asked Questions</SectionHeader>

              <div className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                  <motion.div
                    key={i}
                    layout
                    className="card-main overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start justify-between p-5 text-left gap-4 hover:bg-surface/50 transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <span className="text-[13.5px] font-black text-text-main leading-snug">{item.q}</span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 mt-0.5"
                      >
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-border-sleek">
                            <p className="text-[13px] text-text-muted font-medium leading-relaxed pt-4">{item.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ─ Bottom CTA ─ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative card-main p-8 md:p-12 border-accent/20 overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-black text-primary">Ready to build your loop?</h2>
                <p className="text-text-muted text-[14px] max-w-md mx-auto leading-relaxed">
                  Everything you need is live. Create your first challenge and share it — your network will grow itself.
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <Link to="/create" className="btn-viral flex items-center gap-2">
                    Launch a Challenge <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/explore" className="btn-sleek flex items-center gap-2 bg-surface">
                    Explore Active Loops <Globe className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.section>

          </main>

          {/* ── RIGHT TOC ── */}
          <aside className="hidden xl:block w-[180px] shrink-0">
            <div className="sticky top-[88px] space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Contents</p>

              {NAV_SECTIONS.map(({ id, label }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`block w-full text-left text-[12px] font-bold px-2.5 py-1.5 rounded-lg transition-all border-l-2 ${
                      active
                        ? "text-accent border-accent bg-accent/5"
                        : "text-text-muted hover:text-text-main border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              {/* Feedback */}
              <div className="mt-8 pt-6 border-t border-border-sleek">
                <p className="text-[11px] font-black text-text-main mb-3">Was this helpful?</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-lg bg-accent/10 text-accent text-[11px] font-black hover:bg-accent/20 transition-colors">
                    👍 Yes
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg bg-surface border border-border-sleek text-text-muted text-[11px] font-black hover:border-accent/30 transition-colors">
                    👎 No
                  </button>
                </div>
              </div>

              {/* Version */}
              <div className="mt-4 pt-4 border-t border-border-sleek">
                <p className="text-[10px] text-text-muted font-bold">Docs version</p>
                <p className="text-[10px] text-text-muted/60 font-medium">v1.0 · May 2026</p>
                <p className="text-[10px] text-text-muted/60 font-medium mt-1">
                  Last updated: <span className="text-accent">today</span>
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ── Help / Community section ── */}
      <section className="border-t border-border-sleek bg-surface py-16">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-xl font-black text-primary mb-2">Still have questions?</h2>
            <p className="text-text-muted text-[13px] font-medium">We build in public. Reach out directly — we respond fast.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[640px] mx-auto">
            {[
              { icon: MessageCircle, title: "Community",    desc: "Ask anything in the Discord.",            label: "Join Discord →", href: "#" },
              { icon: Terminal,      title: "API Reference", desc: "Browse the full REST API.",              label: "View API →",     href: "/api-reference" },
              { icon: ExternalLink,  title: "Changelog",    desc: "See what shipped this week.",             label: "Read it →",      href: "/blog" },
            ].map((card) => (
              <div key={card.title} className="card-main p-5 text-center group hover:border-accent transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
                  <card.icon className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="font-black text-text-main text-[13px] mb-1">{card.title}</div>
                <div className="text-text-muted text-[11.5px] font-medium mb-3 leading-snug">{card.desc}</div>
                <Link to={card.href} className="text-accent text-[11px] font-black uppercase tracking-widest hover:underline">
                  {card.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Documentation;
