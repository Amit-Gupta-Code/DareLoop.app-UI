import API from "../api/client";

export const startChain = async (challenge_id: string) => {
  return await API.post("/chains/start", {
    challenge_id,
  });
};

export const joinChain = async (
  code: string,
  payload: {
    username: string;
    platform: string;
  }
) => {
  return await API.post(`/chains/${code}/join`, payload);
};

export const getChain = async (code: string) => {
  return await API.get(`/chains/${code}`);
};