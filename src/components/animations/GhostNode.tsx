import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { getPlatformIcon } from "@/src/utils/helpers";
import { Platform } from "@/src/utils/helpers";

const GhostNode = ({ platform }: { platform: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.9],
        y: [10, 0, 0, -5],
      }}
      transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
      className="flex flex-col items-center"
    >
      <div className="w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-dashed border-accent/20 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner group">
        <div className="absolute inset-0 bg-accent/5 animate-pulse" />
        <Users className="w-6 h-6 text-accent opacity-20" />
        <div className="absolute top-1 right-1">
          <div className="bg-accent/20 px-1 py-0.5 rounded text-[5px] font-black text-accent uppercase animate-bounce">
            LINKING
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-accent/10 backdrop-blur-sm py-0.5 flex items-center justify-center translate-y-0 gap-1 px-1">
          <span className="text-[7px] font-black text-accent/60 uppercase tracking-tighter truncate">
            @creator_loop
          </span>
          <span className="text-accent opacity-40">
            {getPlatformIcon(platform as Platform)}
          </span>
        </div>
      </div>
      <div className="mt-2 text-[8px] font-black text-accent uppercase tracking-[0.3em] animate-pulse">
        Growing Chain...
      </div>
    </motion.div>
  );
};

export default GhostNode;