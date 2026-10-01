import API from "../api/client";

export interface Proof {
  id: number;
  type: string;
  url: string | null;
  caption: string | null;
  verification_status: string;
  visibility: string;
  proofable_type: string;
  proofable_id: number;
  uploaded_at: string;
}

export const getMyProofs = async (): Promise<Proof[]> => {
  const { data } = await API.get("/proofs/my");
  return data.data as Proof[];
};
