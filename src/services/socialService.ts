import API from "../api/client";

export type ReactionType = "support" | "fire" | "clap";

export interface ReactionSummary {
  counts: Record<ReactionType, number>;
  total: number;
  my_reactions: ReactionType[];
}

export interface LeaderboardChallengeEntry {
  rank: number;
  challenge_id: string;
  title: string;
  banner_image?: string | null;
  root_code?: string | null;
  participant_count: number;
  max_depth: number;
  creator?: {
    username?: string;
    user_id?: number;
    profile_pic?: string | null;
  };
}

export interface LeaderboardCreatorEntry {
  rank: number;
  user_id: number;
  name?: string | null;
  handle?: string | null;
  profile_pic?: string | null;
  challenges_created: number;
}

export interface PublicUser {
  id: number;
  name?: string | null;
  handle?: string | null;
  bio?: string | null;
  profile_pic?: string | null;
  is_following?: boolean;
  is_self?: boolean;
  followers_count?: number;
  following_count?: number;
}

export async function forgotPassword(email: string): Promise<string> {
  const { data } = await API.post("/auth/forgot-password", { email });
  return data.message ?? "If that email exists, a reset code was sent.";
}

export async function resetPassword(payload: {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}): Promise<string> {
  const { data } = await API.post("/auth/reset-password", payload);
  return data.message ?? "Password updated.";
}

export async function getLeaderboard(
  scope: "challenges" | "creators" = "challenges",
  limit = 20,
): Promise<(LeaderboardChallengeEntry | LeaderboardCreatorEntry)[]> {
  const { data } = await API.get("/leaderboard", { params: { scope, limit } });
  return (data.data ?? []) as (LeaderboardChallengeEntry | LeaderboardCreatorEntry)[];
}

export async function getReactions(challengeId: string): Promise<ReactionSummary> {
  const { data } = await API.get(`/challenges/${challengeId}/reactions`);
  return data.data as ReactionSummary;
}

export async function addReaction(
  challengeId: string,
  type: ReactionType,
): Promise<ReactionSummary> {
  const { data } = await API.post(`/challenges/${challengeId}/reactions`, { type });
  return data.data as ReactionSummary;
}

export async function removeReaction(
  challengeId: string,
  type: ReactionType,
): Promise<ReactionSummary> {
  const { data } = await API.delete(`/challenges/${challengeId}/reactions`, {
    data: { type },
  });
  return data.data as ReactionSummary;
}

export async function getPublicUser(userId: number): Promise<PublicUser> {
  const { data } = await API.get(`/users/${userId}`);
  return data.data as PublicUser;
}

export async function followUser(userId: number): Promise<void> {
  await API.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId: number): Promise<void> {
  await API.delete(`/users/${userId}/follow`);
}

export async function updateChallenge(
  id: string,
  payload: { title?: string; description?: string; status?: string },
): Promise<void> {
  await API.post(`/challenges/${id}`, payload);
}

export async function completeChallenge(id: string): Promise<void> {
  await API.post(`/challenges/${id}/complete`);
}
