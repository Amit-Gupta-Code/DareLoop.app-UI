import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, Zap } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "./LogoutButton";
import { resolveUserAvatarUrl } from "../../utils/resolveUserAvatarUrl";

const primaryNav = [
  { name: "Home", path: "/" },
  { name: "Explore loops", path: "/explore" },
  { name: "New Challenge", path: "/create" },
  { name: "Insights", path: "/analytics" },
  { name: "Blog", path: "/blog" },
] as const;

// TODO: Next phase — add { name: "API reference", path: "/api-reference" } back when ready
const resourceNav = [
  { name: "Documentation", path: "/documentation" },
  { name: "Growth engine lab", path: "/growth-engine-lab" },
  { name: "Whitepaper", path: "/whitepaper" },
] as const;

function NavLink({
  to,
  children,
  onNavigate,
  className = "",
}: {
  to: string;
  children: ReactNode;
  onNavigate?: () => void;
  className?: string;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`text-[12px] font-bold uppercase tracking-wide transition-colors ${active ? "text-accent" : "text-text-main/75 hover:text-accent"} ${className}`}
    >
      {children}
    </Link>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";
    if (isDarkMode) document.documentElement.classList.add("dark");
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (!resourcesOpen) return;
    const close = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [resourcesOpen]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const closeMobile = () => setMobileOpen(false);
  const avatarUrl = user ? resolveUserAvatarUrl(user.profile_pic || user.avatar) : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-card-bg flex items-center justify-between px-4 lg:px-8 border-b border-border-sleek shadow-lg">
      <Link to="/" className="font-black text-[18px] lg:text-[22px] text-primary shrink-0">
        LOOP<span className="text-accent">IFY</span>
      </Link>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center max-w-3xl mx-4">
        {primaryNav.map((link) =>
          link.path === "/create" ? (
            <Link
              key={link.path}
              to={link.path}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent text-white text-[12px] font-black uppercase tracking-wide shadow-[0_0_10px_2px_rgba(34,197,94,0.35)] hover:shadow-[0_0_16px_4px_rgba(34,197,94,0.55)] hover:scale-105 transition-all duration-200 animate-pulse-subtle"
            >
              <Zap size={13} className="fill-white" />
              {link.name}
            </Link>
          ) : (
            <NavLink key={link.path} to={link.path}>
              {link.name}
            </NavLink>
          )
        )}

        <div className="relative" ref={resourcesRef}>
          <button
            type="button"
            onClick={() => setResourcesOpen((o) => !o)}
            className={`flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
              resourcesOpen ? "text-accent" : "text-text-main/75 hover:text-accent"
            }`}
            aria-expanded={resourcesOpen}
            aria-haspopup="true"
          >
            Resources
            <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {resourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[220px] rounded-xl border border-border-sleek bg-card-bg py-2 shadow-xl"
              >
                {resourceNav.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setResourcesOpen(false)}
                    className="block px-4 py-2.5 text-[13px] font-semibold text-text-main hover:bg-surface hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 hover:bg-surface rounded-full text-accent"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg border border-border-sleek overflow-hidden hover:border-accent/40 transition-colors"
                title="My profile"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-9 h-9 object-cover" />
                ) : (
                  <div className="w-9 h-9 bg-accent/15 flex items-center justify-center text-sm font-black text-accent">
                    {(user?.name || user?.handle || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <Link to="/profile/edit" className="text-[11px] font-bold uppercase tracking-wide text-text-muted hover:text-accent">
                Edit profile
              </Link>
              <LogoutButton className="text-[11px] font-bold uppercase tracking-wide text-text-muted hover:text-red-600 transition-colors px-1" />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[12px] font-bold uppercase tracking-wide text-text-main/80 hover:text-accent px-2"
              >
                Log in
              </Link>
              <Link to="/signup" className="btn-viral px-4 py-2 text-xs">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface text-primary"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 lg:hidden border-t border-border-sleek bg-card-bg shadow-lg overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-1 max-h-[min(70vh,calc(100dvh-64px))] overflow-y-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Menu</p>
              {primaryNav.map((link) =>
                link.path === "/create" ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobile}
                    className="flex items-center gap-2 py-3 text-base font-black text-accent border-b border-border-sleek/60"
                  >
                    <Zap size={16} className="fill-accent" />
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobile}
                    className="py-3 text-base font-bold text-text-main border-b border-border-sleek/60 hover:text-accent"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mt-4 mb-2">Resources</p>
              {resourceNav.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobile}
                  className="py-2.5 text-[15px] font-semibold text-text-muted hover:text-accent"
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-6 pt-4 border-t border-border-sleek flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={closeMobile} className="text-base font-bold hover:text-accent">
                      My profile
                    </Link>
                    <Link to="/profile/edit" onClick={closeMobile} className="text-base font-bold text-text-muted hover:text-accent">
                      Edit profile
                    </Link>
                    <LogoutButton
                      onClick={closeMobile}
                      className="text-left text-base font-bold text-text-muted hover:text-red-600 py-1"
                    />
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobile} className="text-base font-bold text-text-main hover:text-accent">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={closeMobile} className="btn-viral text-center py-3">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
