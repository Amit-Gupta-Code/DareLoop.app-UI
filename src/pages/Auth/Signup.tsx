import { useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { initGoogleAuth, renderGoogleButton } from "../../services/googleAuth";
import API from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { SEOHead } from "@/src/seo/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Users, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import { DreamDareDone } from "@/src/components/brand/DreamDareDone";
import { BRAND_NAME, ONBOARDING_HOOK, TAGLINE } from "@/src/brand/constants";

const PERKS = [
  { icon: Zap, text: "Turn your dream into today's mission" },
  { icon: Users, text: "Connect with builders worldwide" },
  { icon: TrendingUp, text: "Track streaks & climb leaderboards" },
  { icon: ShieldCheck, text: "Private by default — share only what you choose" },
];
const STATS = [
  { value: "12K+", label: "Active builders" },
  { value: "94%", label: "Streak retention" },
  { value: "47", label: "Countries" },
];

const NODE_COUNT = 18;
const NODES = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 6,
  delay: Math.random() * 4,
  duration: 6 + Math.random() * 8,
}));

function FloatingNodes() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {NODES.map((n, i) => {
        const target = NODES[(i + 3) % NODE_COUNT];
        return (
          <g key={n.id} filter="url(#glow)">
            <motion.line
              x1={`${n.x}%`}
              y1={`${n.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke="#22C55E"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              transition={{ duration: n.duration, delay: n.delay, repeat: Infinity }}
            />
            <motion.circle
              cx={`${n.x}%`}
              cy={`${n.y}%`}
              r={n.size / 2}
              fill="#22C55E"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.7, 0.3, 0.7, 0], scale: [0.5, 1, 1.2, 1, 0.5] }}
              transition={{ duration: n.duration, delay: n.delay, repeat: Infinity }}
            />
          </g>
        );
      })}
    </svg>
  );
}

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/plans/create";
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const completed = useAuthStore.getState().user?.onboarding_completed;
    navigate(completed ? from : "/onboarding", { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    initGoogleAuth(async (credential: string) => {
      setLoading(true);
      try {
        const res = await API.post("/auth/google", { token: credential });
        const { user, access_token } = res.data.data;
        localStorage.setItem("access_token", access_token);
        setAuth(user);
        navigate(user?.onboarding_completed ? from : "/onboarding", { replace: true });
      } catch (err) {
        console.error("Google login failed", err);
      } finally {
        setLoading(false);
      }
    });
    if (googleBtnRef.current) {
      renderGoogleButton(googleBtnRef.current);
    }
  }, []);

  const handleGoogleLogin = () => {
    const btn = googleBtnRef.current?.querySelector<HTMLElement>("div[role='button']");
    btn?.click();
  };

  return (
    <>
      <SEOHead
        title={`Sign Up — ${TAGLINE}`}
        description={ONBOARDING_HOOK}
        canonical="/signup"
        noindex={true}
      />

      <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">

        {/* ── Left panel — onboarding first screen ─────────────────── */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden lg:w-[58%] bg-primary px-14 py-16">
          <FloatingNodes />

          {/* top badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {BRAND_NAME} · {TAGLINE}
            </span>
          </motion.div>

          {/* headline — first onboarding screen */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative z-10 space-y-8"
          >
            <DreamDareDone variant="onboarding" />

            {/* perks */}
            <ul className="space-y-3 pt-2">
              {PERKS.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-slate-300 text-[15px] font-medium"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                  </span>
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="relative z-10 grid grid-cols-3 gap-4 pt-2"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-black text-white tabular-nums">{value}</div>
                <div className="text-slate-500 text-[12px] font-bold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right panel ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 bg-surface">

          {/* mobile-only brand — same onboarding first screen */}
          <div className="lg:hidden mb-10 w-full max-w-[420px]">
            <DreamDareDone variant="onboarding" tone="light" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full max-w-[420px] space-y-8"
          >
            {/* card */}
            <div className="card-main space-y-7 shadow-2xl">

              {/* header */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">Free forever</span>
                </div>
                <h2 className="text-[1.75rem] font-black text-primary leading-tight">
                  Create your account
                </h2>
                <p className="text-text-muted text-[14px] leading-relaxed">
                  {ONBOARDING_HOOK}
                </p>
              </div>

              {/* Google CTA */}
              <div className="space-y-3">
                {/* Hidden Google-rendered button — handles popup auth without FedCM */}
                <div ref={googleBtnRef} className="hidden" />
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.975 }}
                  className="w-full relative flex items-center justify-center gap-3 bg-primary text-white border border-primary p-4 rounded-xl font-bold text-[15px] cursor-pointer shadow-lg shadow-primary/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {loading ? (
                    <span className="flex items-center gap-2.5">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Signing you in…
                    </span>
                  ) : (
                    <>
                      <img
                        src="https://cdn-icons-png.flaticon.com/256/2702/2702602.png"
                        className="w-5 h-5"
                        alt="Google"
                      />
                      Continue with Google
                      <ArrowRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* divider */}
                <div className="flex items-center gap-3 text-text-muted text-[12px] font-medium">
                  <div className="flex-1 h-px bg-border-sleek" />
                  No password required
                  <div className="flex-1 h-px bg-border-sleek" />
                </div>
              </div>

              {/* mini perks (mobile) */}
              <ul className="lg:hidden space-y-2">
                {PERKS.slice(0, 3).map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-[13px] text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>

              {/* trust line */}
              <div className="flex items-center gap-2 text-[12px] text-text-muted border-t border-border-sleek pt-5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span>We never post without permission. Your data stays yours.</span>
              </div>
              <p className="text-center text-[12px] text-text-muted">
                Email account?{" "}
                <Link to="/forgot-password" className="font-bold text-accent hover:underline">
                  Reset password
                </Link>
              </p>
            </div>

            {/* already have account */}
            <p className="text-center text-[13px] text-text-muted">
              Already building?{" "}
              <Link to="/login" className="font-bold text-accent hover:underline underline-offset-2">
                Sign in instead <ArrowRight className="inline w-3.5 h-3.5 mb-0.5" />
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </>
  );
};

export default Signup;
