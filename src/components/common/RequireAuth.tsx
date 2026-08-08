import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/src/store/authStore";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const onOnboarding = location.pathname.startsWith("/onboarding");
  if (!user?.onboarding_completed && !onOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.onboarding_completed && onOnboarding) {
    return <Navigate to="/plans/create" replace />;
  }

  return <>{children}</>;
}
