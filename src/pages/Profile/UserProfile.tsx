import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/src/utils/cn";
import { Eye, Zap, Users, Link as LinkIcon, Rocket, BarChart3, Globe, ChevronRight, TrendingUp, Award, Calendar, Share2, GitBranch } from "lucide-react";
import { getMyLoops, getJoinedLoops, Loop } from "@/src/services/loopService";
import { getMyAnalytics, MyAnalytics } from "@/src/services/analyticsService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import LogoutButton from "@/src/components/common/LogoutButton";
import { useAuthStore } from "@/src/store/authStore";
import API from "@/src/api/client";
import { resolveUserAvatarUrl } from "@/src/utils/resolveUserAvatarUrl";
import { formatDisplayHandle } from "@/src/utils/formatDisplayHandle";
import { SEOHead } from "@/src/seo/SEOHead";

const getInitials = (name: string): string => {
   const words = name.trim().split(/\s+/).filter(Boolean);
   if (words.length === 0) return "?";
   const first = words[0][0].toUpperCase();
   const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
   return first + last;
};

const UserProfile = () => {
   const [activeTab, setActiveTab] = useState<'joined' | 'created' | 'analytics'>('joined');
   const [avatarSrc, setAvatarSrc] = useState("");
   const [avatarError, setAvatarError] = useState(false);
   const [joinedLoops, setJoinedLoops] = useState<Loop[]>([]);
   const [joinedLoading, setJoinedLoading] = useState(false);
   const [createdChallenges, setCreatedChallenges] = useState<Loop[]>([]);
   const [createdLoading, setCreatedLoading] = useState(false);
   const [analytics, setAnalytics] = useState<MyAnalytics | null>(null);
   const [analyticsLoading, setAnalyticsLoading] = useState(false);
   const [copiedId, setCopiedId] = useState<string | null>(null);
   const [idCopied, setIdCopied] = useState(false);
   const [headerAnalytics, setHeaderAnalytics] = useState<{ reach: number; momentum: number; nodes: number } | null>(null);
   const navigate = useNavigate();
   const { user: authUser, setAuth } = useAuthStore();

   useEffect(() => {
      const fromStore = resolveUserAvatarUrl(authUser?.profile_pic || authUser?.avatar) || authUser?.profile_pic || authUser?.avatar || "";
      setAvatarSrc(fromStore);
      setAvatarError(false);
   }, [authUser?.profile_pic, authUser?.avatar]);

   useEffect(() => {
      let cancelled = false;
      (async () => {
         try {
            const res = await API.get("/auth/me");
            const raw = res.data?.data ?? res.data;
            if (cancelled || !raw) return;
            const avatarUrl = resolveUserAvatarUrl(raw.profile_pic || raw.avatar) || raw.profile_pic || raw.avatar || "";
            setAuth({ ...raw, profile_pic: avatarUrl || raw.profile_pic });
            setAvatarSrc(avatarUrl);
            setAvatarError(false);
         } catch {
            /* keep store */
         }
      })();
      return () => {
         cancelled = true;
      };
   }, [setAuth]);

   useEffect(() => {
      getMyAnalytics()
         .then((data) => setHeaderAnalytics({ reach: data.total_reach, momentum: data.max_depth, nodes: data.total_nodes }))
         .catch(() => {});
   }, []);

   useEffect(() => {
      if (activeTab !== 'joined') return;
      setJoinedLoading(true);
      getJoinedLoops()
         .then(setJoinedLoops)
         .catch(() => setJoinedLoops([]))
         .finally(() => setJoinedLoading(false));
   }, [activeTab]);

   useEffect(() => {
      if (activeTab !== 'created') return;
      setCreatedLoading(true);
      getMyLoops()
         .then(setCreatedChallenges)
         .catch(() => setCreatedChallenges([]))
         .finally(() => setCreatedLoading(false));
   }, [activeTab]);

   useEffect(() => {
      if (activeTab !== 'analytics') return;
      setAnalyticsLoading(true);
      getMyAnalytics()
         .then(setAnalytics)
         .catch(() => setAnalytics(null))
         .finally(() => setAnalyticsLoading(false));
   }, [activeTab]);

   const handleShareLoop = (rootCode: string, id: string) => {
      const url = `${window.location.origin}/c/${rootCode}`;
      navigator.clipboard.writeText(url).then(() => {
         setCopiedId(id);
         setTimeout(() => setCopiedId(null), 2000);
      });
   };

   const user = {
      name: authUser?.name || "",
      handle: formatDisplayHandle(authUser?.handle),
      bio: authUser?.bio || "",
      avatar: avatarSrc,
   };

   return (
      <>
        <SEOHead
          title={user.name ? `${user.name} (@${authUser?.handle?.replace(/^@/, "") || "user"})` : "My Profile"}
          description={user.bio || `View ${user.name || "this user"}'s challenge profile on Challenge Loop — completed challenges, streaks, and leaderboard rankings.`}
          canonical="/profile"
          noindex={true}
        />
      <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 space-y-8 animate-in fade-in duration-700">
         {/* Profile Header */}
         <div className="card-main p-8 md:p-12 relative overflow-hidden bg-card-bg shadow-2xl border-border-sleek">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-[6px] border-border-sleek overflow-hidden shadow-2xl bg-surface flex items-center justify-center">
                  {user.avatar && !avatarError ? (
                     <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                     />
                  ) : (
                     <span className="text-3xl md:text-4xl font-black text-accent select-none">
                        {getInitials(user.name)}
                     </span>
                  )}
               </div>
               <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                     <div className="flex flex-col md:flex-row items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-black text-text-main">{user.name}</h1>
                        <span className="badge-green bg-accent text-white shadow-lg shadow-accent/20">Loop Verified</span>
                     </div>
                     {user.handle ? (
                        <p className="text-accent font-black tracking-widest text-sm italic">{user.handle}</p>
                     ) : null}
                  </div>
                  <p className="text-text-muted max-w-xl font-medium leading-relaxed">{user.bio}</p>
                  <div className="flex gap-4 justify-center md:justify-start pt-2">
                     <button
                        type="button"
                        className="btn-viral text-xs py-2 px-6 cursor-pointer"
                        onClick={() => navigate("/profile/edit")}
                     >
                        Edit Profile
                     </button>
                     <button
                        type="button"
                        className="btn-sleek bg-surface text-text-main border-border-sleek text-xs py-2 px-6 hover:bg-card-bg"
                        onClick={() => {
                           const handle = authUser?.handle?.replace(/^@/, "") || authUser?.id;
                           const url = `${window.location.origin}/@${handle}`;
                           navigator.clipboard.writeText(url).then(() => {
                              setIdCopied(true);
                              setTimeout(() => setIdCopied(false), 2000);
                           });
                        }}
                     >
                        {idCopied ? "Copied!" : "Share ID"}
                     </button>
                     <LogoutButton className="btn-sleek bg-surface text-text-main border-border-sleek text-xs py-2 px-6 hover:bg-card-bg" label="Logout" />
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-6 w-full md:w-auto">
                  {[
                     { label: "Reach", val: headerAnalytics?.reach ?? "—", icon: Eye },
                     { label: "Momentum", val: headerAnalytics?.momentum ?? "—", icon: Zap },
                     { label: "Nodes", val: headerAnalytics?.nodes ?? "—", icon: Users },
                  ].map((s, i) => (
                     <div key={i} className="text-center p-4 bg-surface rounded-2xl border border-border-sleek">
                        <s.icon className="w-4 h-4 text-accent mx-auto mb-2" />
                        <div className="text-xl font-black text-text-main">{typeof s.val === "number" ? s.val.toLocaleString() : s.val}</div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{s.label}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Content Tabs */}
         <div className="flex gap-4 border-b border-border-sleek pb-4">
            {[
               { id: 'joined', label: 'Joined Loops', icon: LinkIcon },
               { id: 'created', label: 'My Challenges', icon: Rocket },
               { id: 'analytics', label: 'Performance', icon: BarChart3 },
            ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                     "px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                     activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "text-text-muted hover:bg-surface"
                  )}
               >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
               </button>
            ))}
         </div>

         <div className="space-y-8">
            {activeTab === 'joined' && (
               joinedLoading ? (
                  <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading your loops...</div>
               ) : joinedLoops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                     {joinedLoops.map((loop) => (
                        <Link to={`/c/${loop.root_code}`} key={loop.id} className="card-main p-6 space-y-4 hover:border-accent group">
                           <div className="flex justify-between items-start">
                              <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all">
                                 <Globe className="w-5 h-5" />
                              </div>
                              <span className="badge-green lowercase text-[10px]">Active Loop</span>
                           </div>
                           <h3 className="text-lg font-black">{loop.title}</h3>
                           <p className="text-xs text-text-muted font-medium line-clamp-2">{loop.description}</p>
                           <div className="flex justify-between items-center pt-4 border-t border-border-sleek">
                              <div className="flex items-center gap-2">
                                 <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
                                 </div>
                                 <span className="text-[10px] font-bold text-text-muted">+{loop.participant_count} creators</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-accent" />
                           </div>
                        </Link>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-20 bg-surface rounded-[32px] border-2 border-dashed border-border-sleek">
                     <LinkIcon className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                     <h3 className="text-xl font-black text-text-muted">No Loops Joined Yet</h3>
                     <p className="text-sm text-text-muted/60 mb-6">Find a loop and join the chain to see it here.</p>
                     <Link to="/explore" className="btn-viral inline-flex">Explore Loops</Link>
                  </div>
               )
            )}

            {activeTab === 'created' && (
               <div className="space-y-6">
                  {createdLoading ? (
                     <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading your loops...</div>
                  ) : createdChallenges.length > 0 ? createdChallenges.map((challenge) => (
                     <div key={challenge.id} className="card-main flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-highlight transition-all">
                        <div className="space-y-2 flex-1 min-w-0">
                           <h3 className="text-xl font-black">{challenge.title}</h3>
                           <p className="text-sm text-text-muted line-clamp-2">{challenge.description}</p>
                           <div className="flex items-center gap-6 mt-4">
                              <div className="flex items-center gap-2 bg-highlight/5 px-3 py-1 rounded-full border border-highlight/10">
                                 <Users className="w-3 h-3 text-highlight" />
                                 <span className="text-[10px] font-black text-highlight uppercase">{challenge.participant_count} Nodes</span>
                              </div>
                              <div className="flex items-center gap-2 bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                                 <TrendingUp className="w-3 h-3 text-accent" />
                                 <span className="text-[10px] font-black text-accent uppercase">Viral Tracking</span>
                              </div>
                           </div>
                        </div>
                        <button
                           onClick={() => challenge.root_code && handleShareLoop(challenge.root_code, challenge.id)}
                           disabled={!challenge.root_code}
                           className="btn-sleek btn-secondary px-6 shrink-0 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                           <Share2 className="w-4 h-4" />
                           {copiedId === challenge.id ? "Copied!" : "Share"}
                        </button>
                     </div>
                  )) : (
                     <div className="text-center py-20 bg-surface rounded-[32px] border-2 border-dashed border-border-sleek">
                        <Rocket className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-text-muted">No Challenges Created Yet</h3>
                        <p className="text-sm text-text-muted/60 mb-6">Start your own growth loop and watch it multiply.</p>
                        <Link to="/create" className="btn-viral inline-flex">Launch New Loop</Link>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'analytics' && (
               analyticsLoading ? (
                  <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading performance data...</div>
               ) : !analytics || analytics.total_reach === 0 ? (
                  <div className="text-center py-20 bg-surface rounded-[32px] border-2 border-dashed border-border-sleek">
                     <BarChart3 className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                     <h3 className="text-xl font-black text-text-muted">No Performance Data Yet</h3>
                     <p className="text-sm text-text-muted/60 mb-6">Create a challenge and start inviting people to unlock analytics.</p>
                     <Link to="/create" className="btn-viral inline-flex">Launch New Loop</Link>
                  </div>
               ) : (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card-main p-6 text-center">
                           <Eye className="w-5 h-5 text-accent mx-auto mb-2" />
                           <div className="text-2xl font-black text-text-main">{analytics.total_reach.toLocaleString()}</div>
                           <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Total Reach</div>
                        </div>
                        <div className="card-main p-6 text-center">
                           <GitBranch className="w-5 h-5 text-accent mx-auto mb-2" />
                           <div className="text-2xl font-black text-text-main">{analytics.max_depth}</div>
                           <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Max Depth</div>
                        </div>
                        <div className="card-main p-6 text-center">
                           <Award className="w-5 h-5 text-secondary mx-auto mb-2" />
                           <div className="text-2xl font-black text-text-main">
                              {analytics.loyalty_index !== null ? `${analytics.loyalty_index}%` : '—'}
                           </div>
                           <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Loyalty Index</div>
                        </div>
                        <div className="card-main p-6 text-center">
                           <Calendar className="w-5 h-5 text-highlight mx-auto mb-2" />
                           <div className="text-2xl font-black text-text-main">
                              {analytics.last_viral_peak ? `${analytics.last_viral_peak.days_ago}d ago` : '—'}
                           </div>
                           <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Last Peak</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-main p-8 space-y-6">
                           <h3 className="text-lg font-black flex items-center justify-between">
                              Viral Distribution Map
                              <span className="text-[10px] font-bold text-accent">Last 30 days</span>
                           </h3>
                           <div className="h-[240px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={analytics.growth_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <Tooltip
                                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                       cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                    />
                                    <Bar dataKey="joins" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="card-main p-8 border-l-4 border-l-secondary">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="stat-label">Loyalty Index</div>
                                 <Award className="w-5 h-5 text-secondary" />
                              </div>
                              <div className="stat-value">
                                 {analytics.loyalty_index !== null ? `${analytics.loyalty_index}%` : '—'}
                              </div>
                              <p className="text-[11px] font-medium text-text-muted mt-2">
                                 Percentage of your chains that forwarded to at least one new participant.
                              </p>
                           </div>
                           <div className="card-main p-8 border-l-4 border-l-highlight">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="stat-label">Last Viral Peak</div>
                                 <Calendar className="w-5 h-5 text-highlight" />
                              </div>
                              <div className="stat-value">
                                 {analytics.last_viral_peak ? `${analytics.last_viral_peak.days_ago} Days Ago` : '—'}
                              </div>
                              <p className="text-[11px] font-medium text-text-muted mt-2">
                                 {analytics.last_viral_peak
                                    ? `Peak on ${analytics.last_viral_peak.date} with ${analytics.last_viral_peak.joins} joins.`
                                    : 'No viral peak recorded yet.'}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )
            )}
         </div>
      </div>
      </>
   );
};

export default UserProfile;