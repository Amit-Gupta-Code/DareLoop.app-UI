import API from "../api/client";

export interface LoopOrganization {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Loop {
  id: string;
  title: string;
  description: string;
  banner_image: string | null;
  status: string;
  root_code: string;
  participant_count: number;
  visibility?: string;
  organization_id?: number | null;
  organization?: LoopOrganization | null;
}

export const getLoops = async (): Promise<Loop[]> => {
  const { data } = await API.get("/challenges");
  return data.data as Loop[];
};

export const getMyLoops = async (): Promise<Loop[]> => {
  const { data } = await API.get("/challenges/my");
  return data.data as Loop[];
};

export const getJoinedLoops = async (): Promise<Loop[]> => {
  const { data } = await API.get("/challenges/joined");
  return data.data as Loop[];
};

export const createLoop = async (title: string, description: string, bannerImage?: File | null) => {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);
  if (bannerImage) form.append("banner_image", bannerImage);

  const { data } = await API.post("/challenges", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data as { challenge_id: string; code: string };
};

export interface LoopParticipantNode {
  id: string;
  code: string;
  parentId: string | null;
  username: string;
  platform: string | null;
  userId?: number | null;
  avatar?: string | null;
  profile_pic?: string | null;
  depth: number;
  is_trending: boolean;
  viral_score: number;
}

export interface LoopDetail {
  challenge_id: string;
  challenge_title: string;
  challenge_description: string;
  challenge_banner_image: string | null;
  challenge_visibility?: string;
  organization?: LoopOrganization | null;
  current_code: string;
  current_depth: number;
  is_trending: boolean;
  viral_score: number;
  max_depth: number;
  participants: LoopParticipantNode[];
}

export const getLoopDetail = async (code: string): Promise<LoopDetail> => {
  const { data } = await API.get(`/chains/${code}`);
  return data.data as LoopDetail;
};

export const joinLoop = async (
  code: string,
  payload: { username: string; platform: string }
): Promise<{ code: string; already_joined?: boolean }> => {
  const { data } = await API.post(`/chains/${code}/join`, payload);
  return data.data as { code: string; already_joined?: boolean };
};
