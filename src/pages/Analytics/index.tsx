import React from "react";
import { motion } from "framer-motion";
import MOCK_DATA from "../../data/mockData";
import { cn } from "@/src/utils/cn";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const data = MOCK_DATA.analytics;

  return (
    <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <span className="badge-green">Analytics Dashboard 📊</span>
          <h1 className="text-3xl lg:text-[48px] font-black tracking-tight leading-none text-primary">
            Viral Performance
          </h1>
          <p className="text-text-muted text-[17px] font-medium">
            Real-time tracking of your growth loops and recursive reach.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn-sleek btn-secondary py-3 px-6 text-[12px] font-black">
            EXPORT DATA
          </button>
          <button className="btn-viral py-3 px-6 text-[12px]">
            SYNC ENGINE
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.overview.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-sleek border-l-4 border-l-accent flex flex-col justify-between h-[160px] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="stat-label">{stat.label}</div>
              <div
                className={cn(
                  "p-2 rounded-lg bg-surface",
                  stat.color === "accent"
                    ? "text-accent"
                    : stat.color === "highlight"
                      ? "text-highlight"
                      : "text-primary",
                )}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">
                {stat.value}
              </div>
              <div className="text-[11px] font-black text-accent">
                {stat.trend}{" "}
                <span className="text-text-muted font-bold opacity-60">
                  this loop
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 card-main p-8 space-y-8 shadow-lg border-border-sleek">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Recursive Reach Over Time</h3>
            <select className="bg-surface border-none rounded-lg px-4 py-2 text-[11px] font-black tracking-widest uppercase">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.growthData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#22C55E"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorReach)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Loops Leaderboard */}
        <div className="card-main p-8 space-y-8 shadow-lg border-border-sleek">
          <h3 className="text-xl font-black">Highest Velocity</h3>
          <div className="space-y-6">
            {data.topLoops.map((loop, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border-sleek/50 group hover:border-accent transition-colors"
              >
                <div className="space-y-1">
                  <div className="text-[14px] font-black text-primary group-hover:text-accent transition-colors">
                    {loop.name}
                  </div>
                  <div className="text-[11px] font-bold text-text-muted">
                    {loop.reach} Impressed
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-black text-accent">
                    {loop.growth}
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Velocity
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full btn-sleek btn-secondary !py-4 text-[11px] font-black tracking-widest uppercase italic">
            View All Performance
          </button>
        </div>
      </div>

      {/* Network Health Section */}
        <div className="card-main bg-surface p-10 relative overflow-hidden text-text-main border-none shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-highlight/10 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 text-center lg:text-left">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl lg:text-[42px] font-black leading-tight text-text-main">
              Your growth loop <br />
              is perfectly tuned.
            </h2>
            <p className="text-text-muted text-[17px] font-medium leading-relaxed">
              Based on your current loop sync, your recursive reach is projected
              to hit{" "}
              <span className="text-accent font-black underline decoration-accent/30 underline-offset-4 text-text-main">
                2.4M
              </span>{" "}
              by next week. Keep the momentum high.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tighter text-text-main">
                98.4%
              </div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">
                Health Index <span className="text-accent font-black underline decoration-accent/30 underline-offset-4 text-text-main">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;