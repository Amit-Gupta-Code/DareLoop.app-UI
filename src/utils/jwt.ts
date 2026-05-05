import { useAuthStore } from "../store/authStore";

export const isJwtString = (token: string) => {
    return token.split(".").length === 3;
};

export const isTokenExpired = (token: string) => {
    try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= exp * 1000;
    } catch { return true; }
};

export const useTokenExpiry = () => {
    const { logout } = useAuthStore.getState();
    const token = localStorage.getItem("access_token");
    if (token && isTokenExpired(token)) {
        localStorage.removeItem("access_token");
        logout();
    }
};