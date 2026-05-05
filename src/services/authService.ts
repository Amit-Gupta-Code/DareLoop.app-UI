import API from "../api/client";
import { useAuthStore } from "../store/authStore";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  handle?: string;
  bio?: string;
}

export const loginWithGoogle = async (token: string): Promise<AuthUser> => {
  const { data } = await API.post("/auth/google", { token });
  const { user, access_token } = data.data;
  localStorage.setItem("access_token", access_token);
  useAuthStore.getState().setAuth(user);
  return user;
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> => {
  const { data } = await API.post("/auth/register", payload);
  const { user, access_token } = data.data;
  localStorage.setItem("access_token", access_token);
  useAuthStore.getState().setAuth(user);
  return user;
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<AuthUser> => {
  const { data } = await API.post("/auth/login", payload);
  const { user, access_token } = data.data;
  localStorage.setItem("access_token", access_token);
  useAuthStore.getState().setAuth(user);
  return user;
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await API.get("/auth/me");
  return data.data as AuthUser;
};

export const updateProfile = async (payload: Partial<AuthUser>): Promise<AuthUser> => {
  const { data } = await API.post("/auth/profile/update", payload);
  useAuthStore.getState().setAuth(data.data);
  return data.data;
};

export const logout = async (): Promise<void> => {
  try {
    await API.post("/auth/logout");
  } finally {
    localStorage.removeItem("access_token");
    useAuthStore.getState().logout();
  }
};

export const refreshToken = async (): Promise<void> => {
  const { data } = await API.post("/auth/refresh");
  localStorage.setItem("access_token", data.data.access_token);
};
