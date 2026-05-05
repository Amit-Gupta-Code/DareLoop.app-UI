import React, { useMemo } from 'react';
import { motion } from "motion/react";

/**
 * NetworkChainLoader Component
 * A highly polished, tech-forward animated network background or loader.
 * Designed to represent neural connections, growth loops, and recursive systems.
 */

interface NetworkChainLoaderProps {
  /** Total number of nodes in the network */
  dotCount?: number;
  /** Number of connections per node */
  connectionCount?: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Primary color of the network (defaults to current color/accent) */
  color?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Minimum opacity for the lines */
  minLineOpacity?: number;
  /** Maximum opacity for the lines */
  maxLineOpacity?: number;
}

const NetworkChainLoader: React.FC<NetworkChainLoaderProps> = ({
  dotCount = 24,
  connectionCount = 2,
  className = "",
  color = "currentColor",
  speed = 1,
  minLineOpacity = 0.05,
  maxLineOpacity = 0.2
}) => {
  // Generate stable random points using useMemo to prevent re-generation on re-renders
  const points = useMemo(() => {
    return Array.from({ length: dotCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1.2,
      delay: Math.random() * 5,
      duration: (Math.random() * 3 + 4) / speed,
      pulseSpeed: Math.random() * 2 + 3
    }));
  }, [dotCount, speed]);

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {points.map((p, i) => (
          <React.Fragment key={`node-group-${p.id}`}>
            {/* Adaptive Connection Lines */}
            {points.slice(i + 1, i + 1 + connectionCount).map((p2) => (
              <motion.line
                key={`line-${p.id}-${p2.id}`}
                x1={`${p.x}%`}
                y1={`${p.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={color}
                strokeWidth="0.8"
                initial={{ opacity: minLineOpacity }}
                animate={{ 
                  opacity: [minLineOpacity, maxLineOpacity, minLineOpacity],
                }}
                transition={{ 
                  duration: p.duration * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay 
                }}
                style={{ strokeDasharray: "2 4" }}
              />
            ))}

            {/* Glowing Connection Links (Moving Light) */}
            {points.slice(i + 1, i + 1 + connectionCount).map((p2) => (
              <motion.line
                key={`link-glow-${p.id}-${p2.id}`}
                x1={`${p.x}%`}
                y1={`${p.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={color}
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 1],
                  opacity: [0, 0.4, 0],
                  pathOffset: [0, 0, 1]
                }}
                transition={{ 
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: p.delay 
                }}
              />
            ))}
            
            {/* The Main Nodes (Human distributing units) */}
            <motion.circle
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill={color}
              initial={{ opacity: 0.15, scale: 0.9 }}
              animate={{ 
                opacity: [0.15, 0.6, 0.15],
                scale: [0.9, 1.2, 0.9],
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay 
              }}
            />
            
            {/* Atmospheric Core Pulse */}
            <motion.circle
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size * 3}
              fill={color}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.08, 0],
                scale: [0.5, 2.5, 3]
              }}
              transition={{ 
                duration: p.pulseSpeed, 
                repeat: Infinity,
                ease: "easeOut",
                delay: p.delay 
              }}
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default NetworkChainLoader;
