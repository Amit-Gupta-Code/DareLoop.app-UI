import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap } from "lucide-react";
import React from "react";

const RootGrowthAnimation = () => {
  const [animatedId, setAnimatedId] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedId((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      {/* Central Root Node */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 0px var(--color-accent)",
            "0 0 40px rgba(34,197,94,0.3)",
            "0 0 0px var(--color-accent)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="w-24 h-24 bg-card-bg border-[4px] border-primary rounded-3xl flex items-center justify-center z-20 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="font-black text-primary text-2xl tracking-tighter">
          YOU
        </span>
        <div className="absolute -top-1 -right-1">
          <Zap className="w-4 h-4 text-accent fill-accent animate-pulse" />
        </div>
      </motion.div>

      {/* Branching Ghost Nodes */}
      {[0, 1, 2, 3].map((i) => {
        const isActive = animatedId === i;
        const angle = i * 90 + 45;
        const distance = 120;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
          <React.Fragment key={i}>
            {/* Connection Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.1 }}
              className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-accent to-accent/10 origin-bottom"
              style={{
                height: `${distance}px`,
                transform: `translate(-50%, -100%) rotate(${angle + 90}deg)`,
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
              }}
            />

            {/* The Ghost Node */}
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-card-bg border-2 border-dashed border-accent/40 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                      <Users className="w-5 h-5 text-accent opacity-30" />
                      <div className="absolute inset-0 bg-accent/5 animate-pulse" />
                    </div>
                    <div className="mt-2 text-[6px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10 whitespace-nowrap">
                      NEW CHAIN JOINED
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isActive && (
                <div className="w-8 h-8 rounded-full border-2 border-border-sleek bg-surface opacity-10" />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RootGrowthAnimation;