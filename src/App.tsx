import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Landing from "./pages/Landing";
import RequireAuth from "./components/common/RequireAuth";
import { useTokenExpiry } from "./utils/jwt";
import { trackPageView } from "./lib/firebase";
import { requestNotificationPermission, onForegroundMessage } from "./services/notificationService";
import { useAuthStore } from "./store/authStore";

const Signup = lazy(() => import("./pages/Auth/Signup"));
const UserProfile = lazy(() => import("./pages/Profile/UserProfile"));
const Explore = lazy(() => import("./pages/Explore"));
const Analytics = lazy(() => import("./pages/Analytics"));
const ChallengeDetail = lazy(() => import("./pages/Challenge/Detail"));
const CreateChallenge = lazy(() => import("./pages/Challenge/Create"));
const EditProfile = lazy(() => import("./pages/Profile/EditProfile"));
const StaticPage = lazy(() => import("./pages/Static/StaticPage"));
const BlogIndex     = lazy(() => import("./pages/Blog"));
const BlogPost      = lazy(() => import("./pages/Blog/BlogPost"));
const Documentation = lazy(() => import("./pages/Documentation"));

function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function NotificationInit() {
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (!user) return;
    let unsubscribe: (() => void) | undefined;
    requestNotificationPermission().then((token) => {
      if (token) console.info("[FCM] token:", token);
    });
    onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? "Dareloop";
      const body  = payload.notification?.body  ?? "";
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.svg" });
      }
    }).then((unsub) => { unsubscribe = unsub; });
    return () => unsubscribe?.();
  }, [user]);
  return null;
}

function App() {
  useEffect(() => {
    useTokenExpiry();
  }, []);
  return (
    <HelmetProvider>
    <BrowserRouter>
      <RouteTracker />
      <NotificationInit />
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex flex-1 flex-col">
          <Suspense fallback={<div className="flex flex-1 min-h-[50vh]" />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Signup />} />
              <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
              <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/c/:code" element={<ChallengeDetail />} />
              <Route path="/create" element={<RequireAuth><CreateChallenge /></RequireAuth>} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/documentation" element={<Documentation />} />
              {/* TODO: Next phase — API Reference route <Route path="/api-reference" element={<StaticPage pageKey="api-reference" />} /> */}
              <Route path="/growth-engine-lab" element={<StaticPage pageKey="growth-engine-lab" />} />
              <Route path="/whitepaper" element={<StaticPage pageKey="whitepaper" />} />
              <Route path="/privacy-policy" element={<StaticPage pageKey="privacy-policy" />} />
              <Route path="/terms-of-service" element={<StaticPage pageKey="terms-of-service" />} />
              <Route path="/cookies" element={<StaticPage pageKey="cookies" />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
      <VercelAnalytics />
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
