import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/src/store/authStore";
import {
  addReaction,
  getReactions,
  ReactionSummary,
  ReactionType,
  removeReaction,
} from "@/src/services/socialService";

const TYPES: { type: ReactionType; label: string }[] = [
  { type: "support", label: "Support" },
  { type: "fire", label: "Fire" },
  { type: "clap", label: "Clap" },
];

export default function ChallengeReactions({
  challengeId,
}: {
  challengeId: string;
}) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [data, setData] = useState<ReactionSummary | null>(null);

  useEffect(() => {
    if (!challengeId) return;
    getReactions(challengeId).then(setData).catch(() => setData(null));
  }, [challengeId]);

  if (!challengeId || !data) return null;

  const mine = new Set(data.my_reactions ?? []);

  const toggle = async (type: ReactionType) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const next = mine.has(type)
        ? await removeReaction(challengeId, type)
        : await addReaction(challengeId, type);
      setData(next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map(({ type, label }) => {
        const active = mine.has(type);
        return (
          <button
            key={type}
            type="button"
            onClick={() => toggle(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              active
                ? "bg-accent/15 border-accent text-accent"
                : "bg-surface border-border-sleek text-text-muted hover:border-accent/40"
            }`}
          >
            {label} {data.counts?.[type] ?? 0}
          </button>
        );
      })}
    </div>
  );
}
