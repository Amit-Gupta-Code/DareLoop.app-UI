import API from "../api/client";

export interface GrowthPoint {
  date: string;
  joins: number;
}

export interface ViralPeak {
  date: string;
  joins: number;
  days_ago: number;
}

export interface MyAnalytics {
  total_reach: number;
  total_nodes: number;
  max_depth: number;
  loyalty_index: number | null;
  last_viral_peak: ViralPeak | null;
  growth_data: GrowthPoint[];
}

export const getMyAnalytics = async (): Promise<MyAnalytics> => {
  const { data } = await API.get("/analytics/my");
  return data.data as MyAnalytics;
};
