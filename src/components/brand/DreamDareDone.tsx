import { motion } from "framer-motion";
import { TAGLINE, TAGLINE_WORDS, ONBOARDING_HOOK } from "../../brand/constants";
import { cn } from "../../utils/cn";

type Variant = "inline" | "hero" | "steps" | "onboarding" | "footer";

const WORD_HINTS: Record<(typeof TAGLINE_WORDS)[number], string> = {
  Dream: "Name what you want",
  Dare: "Take today's mission",
  Done: "Prove it. Lock it in",
};

interface DreamDareDoneProps {
  variant?: Variant;
  className?: string;
  /** Show the onboarding hook under the tagline */
  showHook?: boolean;
  animate?: boolean;
  /** For onboarding: dark panel (default) or light surface (mobile signup) */
  tone?: "dark" | "light";
}

export function DreamDareDone({
  variant = "inline",
  className,
  showHook = false,
  animate = true,
  tone = "dark",
}: DreamDareDoneProps) {
  if (variant === "steps") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6", className)}>
        {TAGLINE_WORDS.map((word, i) => (
          <motion.div
            key={word}
            initial={animate ? { opacity: 0, y: 20 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="relative text-center space-y-2 py-6 px-4 rounded-2xl bg-surface/60 border border-border-sleek"
          >
            <span className="absolute top-3 left-4 text-[10px] font-black text-text-muted/50 tabular-nums">
              0{i + 1}
            </span>
            <div className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">
              {word}
              <span className="text-accent">.</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-text-muted">{WORD_HINTS[word]}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <motion.div
        initial={animate ? { opacity: 0, y: 12 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.25, duration: 0.55 }}
        className={cn("space-y-3", className)}
      >
        <p
          className="text-xl md:text-3xl font-black tracking-[0.08em] uppercase text-accent"
          aria-label={TAGLINE}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <span key={word}>
              {i > 0 && <span className="text-text-muted/40 mx-1.5 md:mx-2">·</span>}
              <span className="inline-block">{word}</span>
            </span>
          ))}
        </p>
        {showHook && (
          <p className="text-text-muted text-base md:text-lg font-medium max-w-xl mx-auto">
            {ONBOARDING_HOOK}
          </p>
        )}
      </motion.div>
    );
  }

  if (variant === "onboarding") {
    const titleColor = tone === "light" ? "text-primary" : "text-white";
    const hookColor = tone === "light" ? "text-text-muted" : "text-slate-300";
    const align = tone === "light" ? "text-center" : "text-center lg:text-left";

    return (
      <div className={cn("space-y-5", align, className)}>
        <motion.h1
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55 }}
          className={cn(
            "text-[clamp(2.4rem,5vw,3.75rem)] font-black leading-[1.05] tracking-tight",
            titleColor
          )}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <span key={word} className="block">
              <span className={i === 1 ? "text-accent" : undefined}>{word}</span>
              <span className="text-accent">.</span>
            </span>
          ))}
        </motion.h1>
        <motion.p
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={cn(
            "text-lg md:text-xl leading-relaxed max-w-md font-medium",
            tone === "light" && "mx-auto",
            hookColor
          )}
        >
          {ONBOARDING_HOOK}
        </motion.p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <p
        className={cn(
          "text-sm font-black tracking-wide text-accent uppercase",
          className
        )}
      >
        {TAGLINE}
      </p>
    );
  }

  // inline
  return (
    <span
      className={cn("font-black tracking-wide text-accent", className)}
      aria-label={TAGLINE}
    >
      {TAGLINE}
    </span>
  );
}

export default DreamDareDone;
