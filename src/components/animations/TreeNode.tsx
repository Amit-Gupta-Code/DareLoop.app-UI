import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Share2 } from "lucide-react";
import { cn } from "@/src/utils/cn";
import { getPlatformIcon } from "@/src/utils/helpers";
import { resolveUserAvatarUrl } from "@/src/utils/resolveUserAvatarUrl";
import GhostNode from "./GhostNode";

function externalImageProps(src: string): { crossOrigin?: "anonymous" } {
  if (typeof window === "undefined") return {};
  try {
    const u = new URL(src, window.location.href);
    if (u.origin !== window.location.origin) return { crossOrigin: "anonymous" };
  } catch {
    /* ignore */
  }
  return {};
}

const TreeNode = ({
  node,
  depth = 0,
  animatedLeafId = null,
  onShareBranch,
  shareDisabled = false,
}: {
  node: any;
  depth?: number;
  animatedLeafId?: string | null;
  onShareBranch?: (rootElement: HTMLElement, node: any) => void;
  shareDisabled?: boolean;
  key?: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const subtreeRef = useRef<HTMLDivElement>(null);
  const resolved = node.avatar?.trim() ? resolveUserAvatarUrl(node.avatar) : "";
  const nodeAvatar = resolved || `https://picsum.photos/seed/${node.username}/80/80`;
  const nodeAvatarSmall = resolved || `https://picsum.photos/seed/${node.username}/32/32`;

  return (
    <div ref={subtreeRef} className="flex flex-col items-center">
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
              src={nodeAvatarSmall}
              className="w-8 h-8 rounded-lg shadow-sm"
              alt="handle"
              {...externalImageProps(nodeAvatarSmall)}
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
            src={nodeAvatar}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            alt={node.username}
            {...externalImageProps(nodeAvatar)}
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

        {onShareBranch && (
          <button
            type="button"
            disabled={shareDisabled}
            aria-label="Share this branch as image"
            title="Share this branch as image"
            onClick={(e) => {
              e.stopPropagation();
              if (subtreeRef.current) onShareBranch(subtreeRef.current, node);
            }}
            className="loop-map-branch-share absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-lg border border-border-sleek bg-surface text-primary shadow-md opacity-0 transition-opacity pointer-events-auto group-hover:opacity-100 hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-40"
          >
            <Share2 className="h-3 w-3" />
          </button>
        )}

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
                    onShareBranch={onShareBranch}
                    shareDisabled={shareDisabled}
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