import API from "../api/client";

export interface TrendingSpotlight {
  id: string;
  title: string;
  subtitle: string | null;
  media_type: "image" | "video";
  media_url: string;
  poster_url: string | null;
  participant_count: number;
  badge_label: string | null;
  challenge_id: string | null;
}

export async function getTrendingSpotlights(): Promise<TrendingSpotlight[]> {
  const { data } = await API.get("/landing/trending-spotlights");
  return (data.data ?? []) as TrendingSpotlight[];
}
