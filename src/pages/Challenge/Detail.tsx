import { TreeNode } from "@/src/components/animations/TreeNode";
import defaultBanner from "@/src/assets/images/facebook-banner-dareloop.png";
import { motion } from "framer-motion";
import { CheckCircle, Share2, X, Rocket } from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLoopDetail, joinLoop, LoopDetail, LoopParticipantNode } from "@/src/services/loopService";
import { useAuthStore } from "@/src/store/authStore";
import { toPng } from "html-to-image";
import { SEOHead } from "@/src/seo/SEOHead";
import { challengeSchema, breadcrumbSchema } from "@/src/seo/schema";
import ChallengeReactions from "@/src/components/challenge/ChallengeReactions";
import {
  completeChallenge,
  updateChallenge,
} from "@/src/services/socialService";
import { isAxiosError } from "axios";

const SITE_URL = import.meta.env.VITE_APP_URL || "https://challengeloop.app";

function normalizeHandle(value: string): string {
  return value.trim().toLowerCase().replace(/^@+/, "");
}

function dataUrlToFile(dataUrl: string, fileName: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

const ChallengeDetail = () => {
  const { code } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [chain, setChain] = useState<LoopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [userData, setUserData] = useState({
    username: user?.handle?.replace(/^@/, "") || user?.name || "",
    platform: "Twitter",
  });
  const [nextCode, setNextCode] = useState<string | null>(null);
  const [animatedLeafId, setAnimatedLeafId] = useState<string | null>(null);
  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    setLoadError(null);

    getLoopDetail(code)
      .then(setChain)
      .catch(() => setLoadError("Could not load this loop right now."))
      .finally(() => setLoading(false));
  }, [code]);

  const tree = useMemo(() => {
    if (!chain?.participants) return [];
    const buildTree = (participants: LoopParticipantNode[], parentId: string | null = null): any[] =>
      participants
        .filter((p) => p.parentId === parentId)
        .map((p) => ({
          ...p,
          children: buildTree(participants, p.id),
        }));

    return buildTree(chain.participants);
  }, [chain]);

  const alreadyInThisLoop = useMemo(() => {
    if (!chain?.participants?.length) return false;
    if (user?.id != null && String(user.id) !== "") {
      return chain.participants.some(
        (p) => p.userId != null && String(p.userId) === String(user.id),
      );
    }
    const uname = normalizeHandle(userData.username);
    const plat = (userData.platform || "").trim().toLowerCase();
    if (!uname) return false;
    return chain.participants.some((p) => {
      if (p.userId != null) return false;
      const pu = normalizeHandle(p.username || "");
      const pp = (p.platform || "").trim().toLowerCase();
      return pu === uname && pp === plat;
    });
  }, [chain, user?.id, userData.username, userData.platform]);

  const isOwner = useMemo(() => {
    if (!chain?.participants?.length || user?.id == null) return false;
    return chain.participants.some(
      (p) =>
        p.userId != null &&
        String(p.userId) === String(user.id) &&
        (p.parentId == null || p.parentId === ""),
    );
  }, [chain, user?.id]);

  // Real-time Growth Animation Simulator
  useEffect(() => {
    if (!tree.length) return;

    const getLeafNodes = (nodes: any[]): any[] => {
      let leaves: any[] = [];
      nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
          leaves.push(node);
        } else {
          leaves = leaves.concat(getLeafNodes(node.children));
        }
      });
      return leaves;
    };

    const interval = setInterval(() => {
      const leaves = getLeafNodes(tree);
      if (leaves.length > 0) {
        const randomLeaf = leaves[Math.floor(Math.random() * leaves.length)];
        setAnimatedLeafId(randomLeaf.id);

        // Hide ghost node after animation duration
        setTimeout(() => setAnimatedLeafId(null), 4000);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [tree]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/signup", { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    if (!code || alreadyInThisLoop) return;
    setJoining(true);
    try {
      const result = await joinLoop(code, userData);
      setNextCode(result.code);
    } catch {
      alert("Unable to join this loop. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const isAbortError = (err: unknown) =>
    err !== null &&
    typeof err === "object" &&
    "name" in err &&
    (err as { name: string }).name === "AbortError";

  const captureElementToPng = useCallback(
    async (
      el: HTMLElement,
      opts?: { omitBranchShareButtons?: boolean; mapPanelStyle?: boolean },
    ) => {
      const mapPanelStyle = opts?.mapPanelStyle ?? false;
      let backgroundColor: string;
      if (mapPanelStyle) {
        // Match the original Share Map export: clean white card (dot grid + nodes read clearly).
        backgroundColor = "#ffffff";
      } else {
        const computedBg = getComputedStyle(el).backgroundColor;
        const transparent =
          !computedBg ||
          computedBg === "transparent" ||
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/.test(computedBg);
        const themeSurface =
          getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() ||
          "#F8FAFC";
        backgroundColor = transparent ? themeSurface : computedBg;
      }

      const filter =
        opts?.omitBranchShareButtons === true
          ? (domNode: HTMLElement) => !domNode.classList?.contains("loop-map-branch-share")
          : undefined;

      // Do not pass width/height: forcing scroll dimensions re-lays out the clone and breaks the
      // framed “loop map” look users had with the earlier working export.
      return toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor,
        ...(filter ? { filter } : {}),
        fetchRequestInit: { mode: "cors", credentials: "omit" },
      });
    },
    [],
  );

  const sharePngDataUrl = useCallback(
    async (dataUrl: string, fileName: string, shareUrl: string) => {
      if (!chain) return;
      const file = dataUrlToFile(dataUrl, fileName);
      const shareText = `🔥 Join the "${chain.challenge_title}" challenge chain and pass it forward!\n${shareUrl}`;

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: chain.challenge_title,
          text: shareText,
          url: shareUrl,
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();
        await navigator.clipboard.writeText(shareText);
        alert("Image downloaded. Challenge link copied to clipboard!");
      }
    },
    [chain],
  );

  const handleShareMap = async () => {
    if (!treeContainerRef.current || !chain || !code) return;

    const shareUrl = `${window.location.origin}/c/${code}`;
    const fileName = `loop-${code}.png`;

    setAnimatedLeafId(null);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    setSharing(true);
    try {
      const dataUrl = await captureElementToPng(treeContainerRef.current, {
        mapPanelStyle: true,
        omitBranchShareButtons: true,
      });
      await sharePngDataUrl(dataUrl, fileName, shareUrl);
    } catch (err) {
      if (isAbortError(err)) return;

      if (navigator.share) {
        try {
          await navigator.share({
            title: chain.challenge_title,
            text: `🔥 Join the "${chain.challenge_title}" challenge chain and pass it forward!\n${shareUrl}`,
            url: shareUrl,
          });
          return;
        } catch (e2) {
          if (isAbortError(e2)) return;
        }
      }

      try {
        const shareText = `🔥 Join the "${chain.challenge_title}" challenge chain and pass it forward!\n${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
        alert(
          "Challenge link and message copied to your clipboard!",
        );
      } catch {
        alert("Unable to share loop map right now.");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleShareBranch = async (branchRoot: HTMLElement, node: { username?: string }) => {
    if (!chain || !code) return;
    const shareUrl = `${window.location.origin}/c/${code}`;
    const safe = (node.username || "branch").replace(/[^\w.-]/g, "_").slice(0, 48);
    const fileName = `loop-${code}-${safe}.png`;

    setAnimatedLeafId(null);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    setSharing(true);
    try {
      const dataUrl = await captureElementToPng(branchRoot);
      await sharePngDataUrl(dataUrl, fileName, shareUrl);
    } catch (err) {
      if (isAbortError(err)) return;
      try {
        const shareText = `🔥 Join the "${chain.challenge_title}" challenge chain and pass it forward!\n${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
        alert("Could not capture this branch as an image. Challenge link and message copied to clipboard!");
      } catch {
        alert("Unable to share this branch right now.");
      }
    } finally {
      setSharing(false);
    }
  };

  if (loading) return (
    <>
      <SEOHead title="Loading Challenge..." noindex={true} />
      <div className="pt-32 text-center text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Synchronizing loop engine...</div>
    </>
  );
  if (loadError || !chain) return (
    <>
      <SEOHead title="Challenge Not Found" noindex={true} />
      <div className="pt-32 text-center text-red-500 font-black uppercase tracking-[0.2em]">{loadError || "Loop not found"}</div>
    </>
  );

  if (nextCode) {
    const shareUrl = `${window.location.origin}/c/${nextCode}`;
    return (
      <div className="pt-24 pb-20 px-6 max-w-[640px] mx-auto animate-in zoom-in-95 duration-500">
        <motion.div className="card-main text-center space-y-8 border-accent/20 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-accent" />
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto shadow-xl shadow-accent/20">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black italic">Loop Connected! 😏</h2>
            <p className="text-text-muted text-[15px] font-medium">Next creator is waiting... Share your loop link <br />to keep the momentum exploding 🔥</p>
          </div>

          <div className="share-link-box font-medium cursor-default border-accent/40 bg-accent/5 font-mono">
            <span className="truncate mr-2 font-bold text-primary">{shareUrl}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Growth link copied!");
              }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-[11px] font-black tracking-widest uppercase hover:bg-slate-800 transition-colors shrink-0"
            >
              COPY LINK
            </button>
          </div>

          <Link to="/" className="inline-block text-[13px] font-black text-accent hover:underline decoration-accent/30 underline-offset-8 uppercase tracking-widest">
            ← Back to Growth Engine
          </Link>
        </motion.div>
      </div>
    );
  }

  const challengeUrl = `${SITE_URL}/c/${code}`;
  const participantCount = chain.participants?.length ?? 0;

  return (
    <>
      <SEOHead
        title={chain.challenge_title}
        description={`${chain.challenge_description || `Join the ${chain.challenge_title} challenge on Challenge Loop.`} ${participantCount} participants. Track your streak and compete on the leaderboard.`}
        keywords={`${chain.challenge_title}, challenge tracker, accountability challenge, streak challenge, join challenge`}
        canonical={`/c/${code}`}
        ogType="website"
        schema={[
          challengeSchema({
            name: chain.challenge_title,
            description: chain.challenge_description || `Join the ${chain.challenge_title} challenge.`,
            url: challengeUrl,
            participantCount,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Explore", url: "/explore" },
            { name: chain.challenge_title, url: `/c/${code}` },
          ]),
        ]}
      />
    <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 animate-in slide-in-from-bottom-4 duration-500 space-y-8">

      {/* Banner Hero — always shown; falls back to logo placeholder */}
      <div className="relative w-full h-52 md:h-72 rounded-[28px] overflow-hidden shadow-2xl">
        {chain.challenge_banner_image ? (
          <img
            src={chain.challenge_banner_image}
            alt={chain.challenge_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={defaultBanner} alt="DareLoop" className="w-full h-full object-cover" draggable={false} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-green !bg-white/20 !text-white backdrop-blur-sm">Loop Map ⚡</span>
              <span className="text-[10px] font-black text-highlight animate-pulse uppercase tracking-widest">Live Pulse</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg leading-tight max-w-2xl">
              {chain.challenge_title}
            </h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleShareMap}
              disabled={sharing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/30 transition-all disabled:opacity-60"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <Link to="/explore" className="p-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all flex items-center">
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <aside className="space-y-4 md:space-y-6 order-2 lg:order-1">
          <div className="card-sleek bg-slate-900 border-none relative overflow-hidden h-[160px] md:h-[180px] flex flex-col items-center justify-center text-center shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            <div className="stat-label text-text-muted">Current Depth</div>
            <div className="text-5xl md:text-7xl font-black text-text-main tracking-tighter tabular-nums">{chain.max_depth}</div>
            <div className="stat-trend text-accent bg-accent/10 px-3 py-1 rounded-full mt-3 text-[10px] font-black uppercase tracking-widest">Leveling Up</div>
          </div>
          <div className="card-sleek border-l-4 border-l-accent shadow-sm">
            <div className="stat-label">Live Participants</div>
            <div className="text-2xl md:text-3xl font-black text-text-main leading-tight">{chain.participants.length}</div>
            <div className="stat-trend text-accent font-bold">Linked Connections</div>
          </div>
          <div className="card-sleek bg-surface border-dashed border-border-sleek">
            <div className="stat-label">Viral Trigger</div>
            <div className="text-sm font-black text-highlight italic leading-tight">"This loop is spreading faster than the algorithm can track"</div>
          </div>
        </aside>

        <section className="card-main flex flex-col space-y-10 shadow-lg order-1 lg:order-2 px-6 md:px-10 border-border-sleek transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-black text-text-main">{chain.challenge_title}</h2>
              <p className="text-text-muted text-[15px] leading-relaxed max-w-[500px] font-medium">
                {chain.challenge_description}
              </p>
              <ChallengeReactions challengeId={chain.challenge_id} />
              {isOwner && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border-sleek hover:border-accent"
                    onClick={async () => {
                      const title = window.prompt("Challenge title", chain.challenge_title);
                      if (!title) return;
                      const description = window.prompt(
                        "Challenge description",
                        chain.challenge_description || "",
                      );
                      if (description == null) return;
                      try {
                        await updateChallenge(chain.challenge_id, { title, description });
                        const refreshed = await getLoopDetail(code!);
                        setChain(refreshed);
                      } catch (err) {
                        window.alert(
                          isAxiosError(err)
                            ? (err.response?.data?.message as string) || "Update failed"
                            : "Update failed",
                        );
                      }
                    }}
                  >
                    Edit challenge
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border-sleek text-text-muted hover:text-text-main"
                    onClick={async () => {
                      if (!window.confirm("Mark this challenge completed?")) return;
                      try {
                        await completeChallenge(chain.challenge_id);
                        window.alert("Challenge marked completed");
                      } catch (err) {
                        window.alert(
                          isAxiosError(err)
                            ? (err.response?.data?.message as string) || "Action failed"
                            : "Action failed",
                        );
                      }
                    }}
                  >
                    Mark completed
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleShareMap}
              disabled={sharing}
              className="btn-sleek btn-secondary font-black text-[11px] uppercase tracking-widest shadow-none hover:shadow-lg border-border-sleek italic !text-text-main disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto shrink-0"
            >
              <Share2 className="w-4 h-4" /> Share Map
            </button>
          </div>

          <div ref={treeContainerRef} className="flex-1 min-h-[450px] bg-surface border border-border-sleek rounded-[32px] overflow-x-auto overflow-y-auto relative p-8 md:p-12 shadow-inner group scrollbar-hide">
            <div className="min-w-max flex justify-center py-4">
              {tree.map((rootNode: any) => (
                <TreeNode
                  key={rootNode.id}
                  node={rootNode}
                  animatedLeafId={animatedLeafId}
                  shareDisabled={sharing}
                  onShareBranch={handleShareBranch}
                />
              ))}
            </div>

            <div className="absolute bottom-6 right-8 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-sleek shadow-sm">
              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-ping" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Real-time growth active</span>
            </div>

            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2">
              <div className="stat-label">Entry Point</div>
              <h3 className="text-2xl font-black italic text-text-main">Join the System 😏</h3>
              <p className="text-text-muted text-[15px] font-medium max-w-sm mx-auto">Connect your handle and we'll place you at the edge of the growth frontier.</p>
            </div>
            {alreadyInThisLoop && (
              <p className="text-center text-sm font-bold text-accent max-w-md mx-auto">
                You are already linked in this loop. Share your branch from the map above, or open your loop link from when you joined.
              </p>
            )}
            <form onSubmit={handleJoin} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  required
                  disabled={alreadyInThisLoop}
                  className="w-full px-5 py-5 rounded-xl border border-border-sleek bg-surface focus:bg-card-bg focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all font-bold text-[16px] placeholder:opacity-40 !text-text-main disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="@yourhandle"
                  value={userData.username}
                  onChange={e => setUserData({ ...userData, username: e.target.value })}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent font-black text-[10px] tracking-widest bg-accent/5 px-2 py-1 rounded">VERIFIED</div>
              </div>
              <button
                type="submit"
                disabled={joining || alreadyInThisLoop}
                className="btn-viral py-5 px-12 text-lg shadow-2xl group"
              >
                {joining ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" /> :
                  <span className="flex items-center gap-2 italic">Connect <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /></span>
                }
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default ChallengeDetail