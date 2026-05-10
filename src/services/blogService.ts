import API from "../api/client";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string | null;
  published_at: string | null;
  created_at: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export const getBlogs = async (): Promise<BlogPost[]> => {
  const { data } = await API.get("/blog");
  return data.data as BlogPost[];
};

export const getBlog = async (slug: string): Promise<BlogPostDetail> => {
  const { data } = await API.get(`/blog/${slug}`);
  return data.data as BlogPostDetail;
};
