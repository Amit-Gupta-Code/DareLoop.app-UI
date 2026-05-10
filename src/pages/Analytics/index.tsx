import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MOCK_DATA from "../../data/mockData";
import { cn } from "@/src/utils/cn";
import { useAuthStore } from "@/src/store/authStore";
import { getMyAnalytics, type MyAnalytics } from "@/src/services/analyticsService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Eye, MousePointer2, Zap, GitBranch, Target, TrendingUp, Lock } from "lucide-react";

const formatNum = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
};

const Analytics = () => {
  const { isAuthenticated } = useAuthStore();
  const [userData, setUserData] = useState<MyAnalytics | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingUser(true);
    getMyAnalytics()
      .then(setUserData)
      .catch(() => setUserData(null))
      .finally(() => setLoadingUser(false));
  }, [isAuthenticated]);

  const mockData = MOCK_DATA.analytics;
  const isLive = isAuthenticated && !loadingUser && userData !== null;

  const overviewStats = isLive
    ? [
        {
          label: "Total Reach",
          value: formatNum(userData.total_reach),
          trend: userData.total_reach > 0 ? "Live data" : "No joins yet",
          icon: Eye,
          color: "accent",
        },
        {
          label: "Active Chains",
          value: `${userData.total_nodes}`,
          trend: userData.total_nodes > 0 ? "Your chains" : "—",
          icon: Activity,
          color: "primary",
        },
        {
          label: "Max Depth",
          value: `${userData.max_depth}`,
          trend: userData.max_depth > 0 ? "Levels deep" : "—",
          icon: GitBranch,
          color: "highlight",
        },
        {
          label: "Loyalty Index",
          value: userData.loyalty_index !== null ? `${userData.loyalty_index}%` : "—",
          trend: "Chain share rate",
          icon: Target,
          color: "purple",
        },
      ]
    : mockData.overview;

  const growthData = isLive
    ? userData.growth_data.map((p) => ({ date: p.date, reach: p.joins }))
    : mockData.growthData;

  const hasGrowthData = growthData.length > 0;

  return (
    <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <span className="badge-green">Analytics Dashboard 📊</span>
          <h1 className="text-3xl lg:text-[48px] font-black tracking-tight leading-none text-primary">
            Viral Performance
          </h1>
          <p className="text-text-muted text-[17px] font-medium">
            {isAuthenticated
              ? "Your live growth data — challenges, chains, and recursive reach."
              : "Real-time tracking of your growth loops and recursive reach."}
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

      {/* Guest banner */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-accent/30 bg-accent/5 text-sm font-semibold text-text-muted"
        >
          <Lock className="w-4 h-4 text-accent shrink-0" />
          You're viewing demo data.{" "}
          <Link to="/auth/login" className="text-accent underline underline-offset-2 font-black">
            Log in
          </Link>{" "}
          to see your real analytics.
        </motion.div>
      )}

      {/* Loading skeleton */}
      {isAuthenticated && loadingUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-sleek h-[160px] animate-pulse bg-white/5 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {!loadingUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, i) => (
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
                <div className="text-3xl font-black text-primary">{stat.value}</div>
                <div className="text-[11px] font-black text-accent">
                  {stat.trend}{" "}
                  <span className="text-text-muted font-bold opacity-60">
                    {isLive ? "" : "this loop"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loadingUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 card-main p-8 space-y-8 shadow-lg border-border-sleek">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">
                {isLive ? "Joins Over Time" : "Recursive Reach Over Time"}
              </h3>
              {!isLive && (
                <select className="bg-surface border-none rounded-lg px-4 py-2 text-[11px] font-black tracking-widest uppercase">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              )}
              {isLive && (
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted bg-surface px-3 py-1.5 rounded-lg">
                  Last 30 Days
                </span>
              )}
            </div>

            {isLive && !hasGrowthData ? (
              <div className="h-[350px] flex flex-col items-center justify-center gap-3 text-text-muted">
                <TrendingUp className="w-10 h-10 opacity-20" />
                <p className="text-sm font-black">No join activity yet.</p>
                <p className="text-[12px] font-medium opacity-60">Share your challenge to start growing.</p>
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
            )}
          </div>

          {/* Right panel */}
          <div className="card-main p-8 space-y-8 shadow-lg border-border-sleek">
            {isLive ? (
              <>
                <h3 className="text-xl font-black">Viral Peak</h3>
                {userData.last_viral_peak ? (
                  <div className="space-y-6">
                    <div className="p-5 bg-accent/10 rounded-2xl border border-accent/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-accent">
                          Best Day
                        </span>
                      </div>
                      <div className="text-3xl font-black text-primary">
                        {userData.last_viral_peak.joins}
                        <span className="text-base text-text-muted font-bold ml-1">joins</span>
                      </div>
                      <div className="text-[12px] font-medium text-text-muted">
                        {userData.last_viral_peak.date}
                        {userData.last_viral_peak.days_ago === 0
                          ? " — today!"
                          : ` — ${userData.last_viral_peak.days_ago}d ago`}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Total Participants", value: formatNum(userData.total_reach) },
                        { label: "Chain Depth", value: `${userData.max_depth} levels` },
                        { label: "Share Rate", value: userData.loyalty_index !== null ? `${userData.loyalty_index}%` : "—" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border-sleek/50"
                        >
                          <span className="text-[12px] font-bold text-text-muted">{item.label}</span>
                          <span className="text-[13px] font-black text-primary">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-text-muted">
                    <Zap className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-black text-center">No viral peak yet.</p>
                    <p className="text-[12px] font-medium opacity-60 text-center">
                      Share your challenge to get your first joins.
                    </p>
                    <Link
                      to="/explore"
                      className="mt-2 btn-sleek btn-secondary !py-2.5 !px-5 text-[11px] font-black tracking-widest uppercase"
                    >
                      Explore Challenges
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-xl font-black">Highest Velocity</h3>
                <div className="space-y-6">
                  {mockData.topLoops.map((loop, i) => (
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
                        <div className="text-[14px] font-black text-accent">{loop.growth}</div>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom card */}
      {!loadingUser && (
        <div className="card-main bg-surface p-10 relative overflow-hidden text-text-main border-none shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-highlight/10 rounded-full blur-[100px] -ml-32 -mb-32" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 text-center lg:text-left">
            <div className="space-y-4 max-w-xl">
              {isLive ? (
                <>
                  <h2 className="text-3xl lg:text-[42px] font-black leading-tight text-text-main">
                    {userData.total_reach > 0
                      ? "Your chain is growing."
                      : "Start your first challenge."}
                  </h2>
                  <p className="text-text-muted text-[17px] font-medium leading-relaxed">
                    {userData.total_reach > 0
                      ? <>
                          You've reached{" "}
                          <span className="text-accent font-black underline decoration-accent/30 underline-offset-4 text-text-main">
                            {formatNum(userData.total_reach)} participants
                          </span>{" "}
                          across{" "}
                          <span className="text-accent font-black text-text-main">
                            {userData.total_nodes} chains
                          </span>
                          . Keep sharing to grow deeper.
                        </>
                      : "Create a challenge, share your invite link, and watch your chain grow in real time."}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl lg:text-[42px] font-black leading-tight text-text-main">
                    Your growth loop <br /> is perfectly tuned.
                  </h2>
                  <p className="text-text-muted text-[17px] font-medium leading-relaxed">
                    Based on your current loop sync, your recursive reach is projected to hit{" "}
                    <span className="text-accent font-black underline decoration-accent/30 underline-offset-4 text-text-main">
                      2.4M
                    </span>{" "}
                    by next week. Keep the momentum high.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {isLive ? (
                <div className="text-center">
                  <div className="text-4xl font-extrabold tracking-tighter text-text-main">
                    {userData.loyalty_index !== null ? `${userData.loyalty_index}%` : "—"}
                  </div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">
                    Loyalty Index
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-extrabold tracking-tighter text-text-main">98.4%</div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">
                    Health Index{" "}
                    <span className="text-accent font-black underline decoration-accent/30 underline-offset-4 text-text-main">
                      98.4%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
