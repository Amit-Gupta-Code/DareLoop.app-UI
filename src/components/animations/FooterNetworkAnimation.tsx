import React, { useMemo } from "react";
import { motion } from "framer-motion";

type Point = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const FooterNetworkAnimation = () => {
  const points = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
      <svg width="100%" height="100%" className="absolute inset-0">
        {points.map((p, i) => (
          <React.Fragment key={p.id}>
            {/* Draw lines to nearby points */}
            {points.slice(i + 1, i + 4).map((p2) => (
              <motion.line
                key={`${p.id}-${p2.id}`}
                x1={`${p.x}%`}
                y1={`${p.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                }}
                className="text-accent/30"
              />
            ))}
            <motion.circle
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill="currentColor"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }}
              className="text-accent/40"
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default FooterNetworkAnimation;