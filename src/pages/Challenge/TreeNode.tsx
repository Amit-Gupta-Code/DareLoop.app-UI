import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/src/utils/cn";
import { getPlatformIcon } from "@/src/utils/helpers";
import GhostNode from "@/src/components/animations/GhostNode";

const TreeNode = ({
  node,
  depth = 0,
  animatedLeafId = null,
}: {
  node: any;
  depth?: number;
  animatedLeafId?: string | null;
  key?: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group cursor-pointer"
      >
        {/* Node Detail Hover Card */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-surface border border-border-sleek p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={`https://picsum.photos/seed/${node.username}/32/32`}
              className="w-8 h-8 rounded-lg shadow-sm"
              alt="handle"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-[11px] font-black text-primary leading-tight lowercase flex items-center gap-1">
                @{node.username}
                <span className="text-accent opacity-50">
                  {getPlatformIcon(node.platform)}
                </span>
              </div>
              <div className="text-[9px] font-bold text-text-muted">
                Linked level: {depth}
              </div>
            </div>
          </div>
          <div className="space-y-1.5 border-t border-border-sleek pt-2">
            <div className="flex justify-between text-[9px]">
              <span className="text-text-muted font-bold">Status:</span>
              <span className="text-accent font-black uppercase tracking-tighter">
                Active 🔥
              </span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-text-muted font-bold">Growth Map:</span>
              <span className="text-primary font-black uppercase tracking-tighter tabular-nums">
                {node.children?.length || 0} nodes
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-b border-r border-border-sleek rotate-45" />
        </div>

        <div
          className={cn(
            "w-14 h-14 md:w-16 md:h-16 bg-surface border-2 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden relative z-10 transition-all",
            isExpanded
              ? "border-border-sleek group-hover:border-accent"
              : "border-accent shadow-[0_0_20px_rgba(34,197,94,0.2)]",
          )}
        >
          <img
            src={`https://picsum.photos/seed/${node.username}/80/80`}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            alt={node.username}
            referrerPolicy="no-referrer"
          />

          {!isExpanded && (
            <div className="absolute inset-0 bg-accent/10 backdrop-blur-[1px] flex items-center justify-center">
              <Plus className="w-6 h-6 text-accent" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm py-0.5 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 gap-1 px-1">
            <span className="text-[7px] font-black text-white uppercase tracking-tighter truncate">
              @{node.username}
            </span>
            {getPlatformIcon(node.platform) && (
              <span className="text-white shrink-0">
                {getPlatformIcon(node.platform)}
              </span>
            )}
          </div>
        </div>

        {/* Connection Light Effect */}
        <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </motion.div>

      {isExpanded && node.children && node.children.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col items-center overflow-hidden"
          >
            <div className="w-0.5 h-8 bg-gradient-to-b from-accent/40 to-accent/10" />
            <div className="flex gap-4 md:gap-8 px-4 relative">
              {node.children.length > 1 && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent/10"
                  style={{ width: `calc(100% - 3.5rem)` }}
                />
              )}
              {node.children.map((child: any) => (
                <div key={child.id} className="relative pt-0">
                  <div className="w-0.5 h-4 bg-accent/10 mx-auto" />
                  <TreeNode
                    node={child}
                    depth={depth + 1}
                    animatedLeafId={animatedLeafId}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ghost Node Animation for Leaf Nodes */}
      {isExpanded &&
        (!node.children || node.children.length === 0) &&
        animatedLeafId === node.id && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-gradient-to-b from-accent/20 to-accent/5" />
            <GhostNode
              platform={
                ["Twitter", "Instagram", "Youtube"][
                  Math.floor(Math.random() * 3)
                ]
              }
            />
          </div>
        )}
    </div>
  );
};

export { TreeNode };