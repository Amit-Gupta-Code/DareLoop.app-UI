import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Twitter, Disc as Discord, Github, ArrowRight, Instagram, Linkedin, Mail, Loader2 } from "lucide-react";
import NetworkChainLoader from "./NetworkChainLoader";
import { subscribeNewsletter } from "../../services/newsletterService";
import { isAxiosError } from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setFeedback("Please enter your email.");
      return;
    }
    setStatus("loading");
    try {
      const { message } = await subscribeNewsletter(trimmed);
      setStatus("success");
      setFeedback(message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      if (isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string })?.message ??
          (err.response?.data as { errors?: { email?: string[] } })?.errors?.email?.[0];
        setFeedback(msg || "Something went wrong. Try again later.");
      } else {
        setFeedback("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <footer className="relative bg-card-bg text-text-main pt-24 pb-12 overflow-hidden border-t border-border-sleek">
      {/* Background Sync */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <NetworkChainLoader dotCount={40} connectionCount={2} color="#22C55E" />
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Segment */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-primary">
              LOOP<span className="text-accent">IFY</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs font-medium">
              Revolutionizing digital growth through recursive node-based scaling. 
              Join the evolution of creator ecosystems.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Discord, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -4, color: "#22C55E" }}
                  className="w-10 h-10 rounded-xl bg-surface border border-border-sleek flex items-center justify-center transition-colors text-text-muted hover:border-accent/40"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-text-muted italic opacity-70">Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/explore" className="text-text-muted hover:text-accent transition-colors">Explore Loops</Link></li>
              <li><Link to="/create" className="text-text-muted hover:text-accent transition-colors">Launch Challenge</Link></li>
              <li><Link to="/analytics" className="text-text-muted hover:text-accent transition-colors">Network Data</Link></li>
              <li><Link to="/profile" className="text-text-muted hover:text-accent transition-colors">My Growth Tree</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-text-muted italic opacity-70">Resources</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/documentation" className="text-text-muted hover:text-accent transition-colors">Documentation</Link></li>
              <li><Link to="/api-reference" className="text-text-muted hover:text-accent transition-colors">API Reference</Link></li>
              <li><Link to="/growth-engine-lab" className="text-text-muted hover:text-accent transition-colors">Growth Engine Lab</Link></li>
              <li><Link to="/whitepaper" className="text-text-muted hover:text-accent transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          {/* Special Trending Multi-Component: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-text-muted italic opacity-70">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                  setFeedback(null);
                }}
                placeholder="Enter email for loop updates"
                autoComplete="email"
                disabled={status === "loading"}
                className="w-full bg-surface border border-border-sleek rounded-2xl py-4 pl-5 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all placeholder:text-text-muted/40 text-text-main disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label="Subscribe to newsletter"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </form>
            {feedback ? (
              <p
                className={`text-xs font-bold ${
                  status === "success" ? "text-accent" : "text-red-500"
                }`}
              >
                {feedback}
              </p>
            ) : null}
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-accent leading-tight">Trending Insight</p>
                <p className="text-[12px] text-text-muted font-medium">Join 50k+ creators scaling recursively.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border-sleek flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
            <span className="opacity-60">&copy; 2024 LOOP<span className="text-accent/60">IFY</span> TECHNOLOGIES</span>
            <span className="w-1 h-1 bg-border-sleek rounded-full" />
            <span className="opacity-60">ALL RIGHTS RESERVED</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[11px] font-bold uppercase tracking-widest text-text-muted">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
