import API from "../api/client";

export async function subscribeNewsletter(email: string): Promise<{
  message: string;
}> {
  const { data } = await API.post("/newsletter/subscribe", { email });
  return {
    message: (data?.message as string) ?? "Thanks for subscribing.",
  };
}
