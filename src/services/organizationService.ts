import API from "../api/client";
import type { Loop } from "./loopService";

export interface GymCommunity {
  public_challenge_count: number;
  participant_count: number;
}

export interface GymPublicProfile {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  status: string;
  active_public_challenges: Loop[];
  community: GymCommunity;
}

export const getGymProfile = async (slug: string): Promise<GymPublicProfile> => {
  const { data } = await API.get(`/organizations/${slug}`);
  return data.data as GymPublicProfile;
};
