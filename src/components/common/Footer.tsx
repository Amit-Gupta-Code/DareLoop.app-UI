import React, { useCallback, useRef, useState } from "react";
import dareloopLogo from "../../assets/images/dareloop-logo.png";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Facebook, Youtube, Instagram, ArrowRight, Mail, Loader2, X, Rocket, Bell, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "../../services/newsletterService";
import { isAxiosError } from "axios";
import { DreamDareDone } from "../brand/DreamDareDone";
import { BRAND_NAME, BRAND_PROMISE } from "../../brand/constants";

const PlayStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M3.18 23.76c.3.17.64.24.99.2l13.7-11.62L14.4 9l-11.22 14.76zM.54 1.7C.2 2.04 0 2.57 0 3.27v17.46c0 .7.2 1.23.55 1.57l.08.08 9.77-9.77v-.23L.62 1.63l-.08.07zM20.6 10.4l-2.76-1.57-3.27 3.27 3.27 3.27 2.78-1.58c.8-.45.8-1.93-.02-2.39zM4.17.24l13.7 11.62-3.47 3.47L1.14.2C1.64-.1 2.45-.05 4.17.24z" />
  </svg>
);

const AppStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PLATFORM_LINKS = [
  { to: "/explore", label: "Explore Loops" },
  { to: "/create", label: "Launch Challenge" },
  { to: "/analytics", label: "Network Data" },
  { to: "/profile", label: "My Growth Tree" },
] as const;

const RESOURCE_LINKS = [
  { to: "/blog", label: "Blog" },
  { to: "/documentation", label: "Documentation" },
  { to: "/growth-engine-lab", label: "Growth Engine Lab" },
  { to: "/whitepaper", label: "Whitepaper" },
] as const;

const AppComingSoonModal = ({ onClose }: { onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md"
        style={{ perspective: 800 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-2xl" />
        <div className="relative rounded-3xl bg-card-bg border border-border-sleek overflow-hidden shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="p-8 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border-sleek flex items-center justify-center text-text-muted hover:text-primary hover:border-accent/40 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              animate={{ y: [0, -8, 0], rotateY: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_rgba(34,197,94,0.2)]"
            >
              <Rocket className="w-9 h-9 text-accent" />
            </motion.div>
            <h2 className="text-2xl font-black text-primary tracking-tight mb-2">
              Launching <span className="text-accent">Soon</span>
            </h2>
            <p className="text-text-muted text-sm font-medium leading-relaxed mb-6 max-w-xs mx-auto">
              Our mobile app is in the final stages of development. We&apos;re crafting an extraordinary experience for you.
            </p>
            <div className="flex gap-3 justify-center mb-6">
              {[
                { Icon: PlayStoreIcon, label: "Google Play" },
                { Icon: AppStoreIcon, label: "App Store" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border border-border-sleek opacity-50 cursor-not-allowed select-none"
                >
                  <Icon />
                  <div className="text-left">
                    <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider leading-none">
                      Coming to
                    </p>
                    <p className="text-xs font-black text-primary leading-tight">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Bell className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-black text-accent uppercase tracking-widest">
                Be the first to know
              </span>
            </div>
            <p className="text-[10px] text-text-muted font-medium mt-4 opacity-60">
              Subscribe to our newsletter above to get notified at launch.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

function DepthPanel({
  children,
  className = "",
  depth = 0,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, z: -40 - depth * 20, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, z: depth, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 18 }}
      whileHover={{
        y: -6,
        z: depth + 24,
        rotateX: -2,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className={`footer-depth-panel relative rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.07] via-transparent to-accent/[0.04]" />
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-5, 5]);
  const rotateX = useTransform(sy, [-1, 1], [4, -4]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [px, py]
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setFeedback("Please enter your email.");
      return;
    }
    setStatus("loading");
    try {
      const { message } = await subscribeNewsletter(trimmed);
      setStatus("success");
      setFeedback(message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      if (isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string })?.message ??
          (err.response?.data as { errors?: { email?: string[] } })?.errors?.email?.[0];
        setFeedback(msg || "Something went wrong. Try again later.");
      } else {
        setFeedback("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <footer className="footer-3d relative overflow-hidden text-white pt-20 pb-10 border-t border-white/5">
      {/* Deep stage background */}
      <div className="absolute inset-0 bg-[#050A14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(34,197,94,0.18),transparent_50%),radial-gradient(ellipse_at_90%_40%,rgba(56,189,248,0.08),transparent_45%)]" />

      {/* Perspective floor */}
      <div className="footer-floor pointer-events-none absolute inset-x-0 bottom-0 h-[55%] opacity-40" aria-hidden />

      {/* Floating orbital rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full border border-accent/20"
            style={{
              width: `${280 + i * 160}px`,
              height: `${120 + i * 70}px`,
              boxShadow: `0 0 ${30 + i * 10}px rgba(34,197,94,${0.08 - i * 0.02})`,
            }}
            animate={{ rotateZ: [i * 12, i * 12 + 360] }}
            transition={{ duration: 40 + i * 18, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <div className="absolute left-[12%] top-[30%] w-2 h-2 rounded-full bg-accent shadow-[0_0_20px_#22C55E] animate-pulse" />
        <div className="absolute right-[18%] top-[42%] w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_16px_#38BDF8] animate-pulse" />
        <div className="absolute left-[55%] top-[22%] w-1 h-1 rounded-full bg-highlight shadow-[0_0_12px_#F59E0B]" />
      </div>

      <div
        ref={stageRef}
        className="footer-stage relative z-10 max-w-7xl mx-auto px-5 sm:px-6"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ perspective: 1400 }}
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
          {/* Hero strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-accent mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Stay in the loop
              </span>
              <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none">
                {BRAND_NAME}
                <span className="text-accent">.</span>
              </h2>
            </div>
            <p className="text-white/45 text-sm font-medium max-w-sm leading-relaxed">
              A living network under your feet — links, loops, and next missions in 3D space.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 mb-12">
            {/* Brand slab */}
            <DepthPanel className="xl:col-span-4 md:col-span-2" depth={18} delay={0.05}>
              <div className="space-y-5">
                <img src={dareloopLogo} alt="Dareloop" className="h-11 w-auto brightness-0 invert opacity-95" />
                <DreamDareDone variant="footer" />
                <p className="text-white/50 text-sm leading-relaxed font-medium">{BRAND_PROMISE}</p>

                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "https://www.facebook.com/dareloop/" },
                    { icon: Youtube, href: "https://www.youtube.com/@DeveloperBiharWala" },
                    { icon: Instagram, href: "https://www.instagram.com/dareloop.app/" },
                    { icon: WhatsAppIcon, href: "https://whatsapp.com/channel/0029VbCfgLY8F2pBqDpLf51m" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, scale: 1.08, z: 20 }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/55 hover:text-accent hover:border-accent/40 hover:shadow-[0_12px_30px_rgba(34,197,94,0.25)] transition-colors"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Download App</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { Icon: PlayStoreIcon, top: "GET IT ON", bottom: "Google Play" },
                      { Icon: AppStoreIcon, top: "Download on the", bottom: "App Store" },
                    ].map(({ Icon, top, bottom }) => (
                      <motion.button
                        key={bottom}
                        type="button"
                        onClick={() => setShowAppModal(true)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left hover:border-accent/35 hover:bg-accent/10 group transition-colors"
                      >
                        <span className="text-white/50 group-hover:text-accent transition-colors">
                          <Icon />
                        </span>
                        <div>
                          <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider leading-none">
                            {top}
                          </p>
                          <p className="text-sm font-black text-white leading-tight">{bottom}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </DepthPanel>

            {/* Platform */}
            <DepthPanel className="xl:col-span-2" depth={8} delay={0.12}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-5 text-white/40">
                Platform
              </h4>
              <ul className="space-y-3.5 font-bold text-sm">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-2 text-white/55 hover:text-accent transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:scale-150 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </DepthPanel>

            {/* Resources */}
            <DepthPanel className="xl:col-span-2" depth={4} delay={0.18}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-5 text-white/40">
                Resources
              </h4>
              <ul className="space-y-3.5 font-bold text-sm">
                {RESOURCE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-2 text-white/55 hover:text-accent transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-sky-400/40 group-hover:scale-150 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </DepthPanel>

            {/* Newsletter console */}
            <DepthPanel className="xl:col-span-4 md:col-span-2" depth={28} delay={0.22}>
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-5 text-white/40">
                Newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="relative group mb-4">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                    setFeedback(null);
                  }}
                  placeholder="Enter email for loop updates"
                  autoComplete="email"
                  disabled={status === "loading"}
                  className="w-full bg-[#0B1220]/90 border border-white/15 rounded-2xl py-4 pl-5 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all placeholder:text-white/25 text-white disabled:opacity-60 shadow-[inset_0_2px_12px_rgba(0,0,0,0.35)]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white disabled:opacity-60 disabled:hover:scale-100 shadow-[0_8px_24px_rgba(34,197,94,0.45)]"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </form>
              {feedback ? (
                <p className={`text-xs font-bold mb-4 ${status === "success" ? "text-accent" : "text-red-400"}`}>
                  {feedback}
                </p>
              ) : null}

              <div
                className="p-4 rounded-2xl border border-accent/25 bg-accent/10 flex items-start gap-3"
                style={{ transform: "translateZ(16px)" }}
              >
                <div className="w-9 h-9 rounded-xl bg-accent/25 border border-accent/30 flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(34,197,94,0.25)]">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-accent leading-tight">
                    Trending Insight
                  </p>
                  <p className="text-[12px] text-white/55 font-medium mt-0.5">
                    Join 50k+ creators scaling recursively.
                  </p>
                </div>
              </div>
            </DepthPanel>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/35 flex items-center gap-2 text-center md:text-left">
              <span>&copy; {new Date().getFullYear()} DARELOOP TECHNOLOGIES</span>
              <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
              <span className="hidden sm:inline">ALL RIGHTS RESERVED</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[11px] font-bold uppercase tracking-widest text-white/40">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-accent transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {showAppModal && <AppComingSoonModal onClose={() => setShowAppModal(false)} />}
    </footer>
  );
};

export default Footer;
