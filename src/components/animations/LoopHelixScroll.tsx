import { useRef, useState, useEffect, useCallback, type ElementType, type PointerEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { Brain, Camera, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND_NAME } from "../../brand/constants";

type Panel = {
  id: string;
  word: string;
  hint: string;
  title: string;
  body: string;
  accent: string;
  glow: string;
  Icon: ElementType;
  cta?: { label: string; to: string };
};

const PANELS: Panel[] = [
  {
    id: "dream",
    word: "Dream",
    hint: "01 — NAME IT",
    title: "Lock the vision",
    body: "Tell the loop what you want. AI turns fog into a day-by-day mission — you stop inventing the path and start walking it.",
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.35)",
    Icon: Brain,
  },
  {
    id: "dare",
    word: "Dare",
    hint: "02 — EXECUTE",
    title: "Today's mission",
    body: "One clear dare. Public proof. No private claims — Instagram, YouTube, TikTok, X. The gate only opens when the work is real.",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    Icon: Camera,
  },
  {
    id: "done",
    word: "Done",
    hint: "03 — COMPOUND",
    title: "Verified. Shared. Multiplied.",
    body: "Done locks the streak and unlocks the viral chain. Every invite becomes a permanent node — reach compounds under you forever.",
    accent: "#38BDF8",
    glow: "rgba(56,189,248,0.35)",
    Icon: Rocket,
    cta: { label: "Enter the loop", to: "/signup" },
  },
];

const RING_COUNT = 9;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function HelixRing({
  index,
  progress,
  pointerX,
  pointerY,
}: {
  index: number;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const t = index / (RING_COUNT - 1);
  // Each ring peels open along Z as you scroll — möbius twist on rotateZ
  const z = useTransform(progress, [0, 1], [900 - t * 1400, -1100 - t * 200]);
  const scale = useTransform(progress, [0, 1], [0.35 + t * 0.9, 1.6 + t * 0.35]);
  const opacity = useTransform(
    progress,
    [0, 0.08, 0.55, 0.85, 1],
    [0.15, 0.55, 0.9 - t * 0.25, 0.35, 0.08]
  );
  const rotateZ = useTransform(progress, [0, 1], [t * 40, t * 40 + 220 + index * 18]);
  const rotateX = useTransform(pointerY, [-1, 1], [8 + t * 4, -8 - t * 4]);
  const rotateY = useTransform(pointerX, [-1, 1], [-10 - t * 3, 10 + t * 3]);
  const hueShift = index % 3 === 0 ? "#22C55E" : index % 3 === 1 ? "#F59E0B" : "#38BDF8";

  return (
    <motion.div
      className="helix-ring absolute left-1/2 top-1/2"
      style={{
        width: "min(78vw, 640px)",
        height: "min(78vw, 640px)",
        x: "-50%",
        y: "-50%",
        z,
        scale,
        opacity,
        rotateZ,
        rotateX,
        rotateY,
      }}
      aria-hidden
    >
      <div
        className="helix-ring-ellipse absolute inset-0 rounded-[45%]"
        style={{
          border: `1.5px solid ${hueShift}`,
          boxShadow: `0 0 40px ${hueShift}22, inset 0 0 60px ${hueShift}10`,
          transform: "rotateX(68deg) scaleY(0.42)",
        }}
      />
      {/* Chain nodes on the ring */}
      {[0, 1, 2, 3, 4, 5].map((n) => {
        const angle = (n / 6) * Math.PI * 2 + index * 0.35;
        const r = 48;
        return (
          <span
            key={n}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${50 + Math.cos(angle) * r}%`,
              top: `${50 + Math.sin(angle) * r * 0.38}%`,
              background: hueShift,
              boxShadow: `0 0 12px ${hueShift}`,
              opacity: 0.85,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </motion.div>
  );
}

function DepthPanel({
  panel,
  index,
  progress,
  isAuth,
}: {
  panel: Panel;
  index: number;
  progress: MotionValue<number>;
  isAuth: boolean;
}) {
  // Panels arrive from deep Z, peak in focus mid-scroll, then fly past the camera
  const start = index * 0.22;
  const peak = start + 0.18;
  const end = start + 0.42;

  const z = useTransform(progress, [start, peak, end], [780, 0, -900]);
  const opacity = useTransform(progress, [start, peak - 0.04, peak + 0.06, end], [0, 1, 1, 0]);
  const rotateY = useTransform(progress, [start, peak, end], [28 - index * 6, 0, -22]);
  const rotateX = useTransform(progress, [start, peak, end], [14, 0, -10]);
  const y = useTransform(progress, [start, peak, end], ["calc(-50% + 80px)", "calc(-50% + 0px)", "calc(-50% - 60px)"]);
  const scale = useTransform(progress, [start, peak, end], [0.72, 1, 0.88]);

  const ctaTo = panel.cta
    ? isAuth
      ? "/create"
      : panel.cta.to
    : null;

  return (
    <motion.article
      className="helix-panel absolute left-1/2 top-1/2 w-[min(92vw,420px)]"
      style={{
        x: "-50%",
        y,
        z,
        opacity,
        rotateY,
        rotateX,
        scale,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative rounded-[28px] border border-white/10 bg-[#0B1220]/92 backdrop-blur-xl p-7 md:p-9 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px ${panel.accent}33, 0 0 60px ${panel.glow}`,
        }}
      >
        <div
          className="absolute -top-24 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: panel.glow }}
        />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <span
              className="text-[10px] font-black uppercase tracking-[0.22em]"
              style={{ color: panel.accent }}
            >
              {panel.hint}
            </span>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: `${panel.accent}22`, border: `1px solid ${panel.accent}55` }}
            >
              <panel.Icon className="w-5 h-5" style={{ color: panel.accent }} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
              {panel.word}
              <span style={{ color: panel.accent }}>.</span>
            </h3>
            <p className="mt-2 text-lg font-bold text-white/90 tracking-tight">{panel.title}</p>
          </div>
          <p className="text-sm md:text-base text-white/55 font-medium leading-relaxed">{panel.body}</p>
          {ctaTo && (
            <Link
              to={ctaTo}
              className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-transform hover:scale-[1.03]"
              style={{ background: panel.accent, boxShadow: `0 12px 40px ${panel.glow}` }}
            >
              {panel.cta!.label} <Sparkles className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function StaticFallback({ isAuth }: { isAuth: boolean }) {
  return (
    <section className="relative my-16 rounded-[40px] overflow-hidden bg-[#0B1220] border border-border-sleek px-6 py-16 md:px-12">
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
        {PANELS.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3"
            style={{ boxShadow: `0 0 40px ${p.glow}` }}
          >
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: p.accent }}>
              {p.hint}
            </span>
            <h3 className="text-3xl font-black italic text-white">
              {p.word}
              <span style={{ color: p.accent }}>.</span>
            </h3>
            <p className="text-sm text-white/55 leading-relaxed">{p.body}</p>
            {p.cta && (
              <Link
                to={isAuth ? "/create" : p.cta.to}
                className="inline-flex text-sm font-bold mt-2"
                style={{ color: p.accent }}
              >
                {p.cta.label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LoopHelixScroll({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 22 });

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 });

  const hudOpacity = useTransform(progress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);
  const coreScale = useTransform(progress, [0, 0.5, 1], [0.6, 1.15, 1.8]);
  const coreOpacity = useTransform(progress, [0, 0.2, 0.7, 1], [0.4, 0.9, 0.55, 0.15]);
  const titleOpacity = useTransform(progress, [0, 0.08, 0.18], [1, 1, 0]);
  const titleY = useTransform(progress, [0, 0.18], [0, -40]);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerX.set(nx);
      pointerY.set(ny);
    },
    [pointerX, pointerY]
  );

  const onPointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  if (reduced) return <StaticFallback isAuth={isAuthenticated} />;

  return (
    <section
      ref={trackRef}
      className="loop-helix-track relative -mx-6 md:-mx-12"
      style={{ height: "320vh" }}
      aria-label={`${BRAND_NAME} scroll loop experience`}
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#020617]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.14)_0%,transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.07] helix-grid" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface to-transparent z-20" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent z-20" />
        </div>

        {/* Intro title */}
        <motion.div
          className="absolute inset-x-0 top-[18%] z-30 text-center px-6 pointer-events-none"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.25em] mb-5">
            Scroll the loop
          </span>
          <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
            Step inside the <span className="text-accent">chain.</span>
          </h2>
          <p className="mt-4 text-white/45 text-sm md:text-base font-medium max-w-md mx-auto">
            A 3D corridor of recursive growth — Dream, Dare, Done fly through your viewport.
          </p>
        </motion.div>

        {/* 3D stage */}
        <div className="helix-stage absolute inset-0 z-10 flex items-center justify-center">
          <div className="helix-world relative w-full h-full">
            {/* Core energy */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none"
              style={{
                scale: coreScale,
                opacity: coreOpacity,
                background:
                  "radial-gradient(circle, rgba(34,197,94,0.55) 0%, rgba(56,189,248,0.15) 45%, transparent 70%)",
                boxShadow: "0 0 80px rgba(34,197,94,0.35)",
              }}
            />

            {Array.from({ length: RING_COUNT }).map((_, i) => (
              <HelixRing
                key={i}
                index={i}
                progress={progress}
                pointerX={smoothX}
                pointerY={smoothY}
              />
            ))}

            {PANELS.map((panel, i) => (
              <DepthPanel
                key={panel.id}
                panel={panel}
                index={i}
                progress={progress}
                isAuth={isAuthenticated}
              />
            ))}
          </div>
        </div>

        {/* HUD progress */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[min(90vw,360px)] pointer-events-none"
          style={{ opacity: hudOpacity }}
        >
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
            <span>Loop depth</span>
            <span>Dream → Dare → Done</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent via-highlight to-sky-400"
              style={{ width: progressWidth }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
