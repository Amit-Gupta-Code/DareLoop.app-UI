import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SEOHead } from "@/src/seo/SEOHead";
import { forgotPassword, resetPassword } from "@/src/services/socialService";
import { isAxiosError } from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const msg = await forgotPassword(email.trim());
      setCodeSent(true);
      setMessage(msg);
    } catch (err) {
      setError(
        isAxiosError(err)
          ? (err.response?.data?.message as string) || "Could not send reset code."
          : "Could not send reset code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const msg = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
        password_confirmation: confirm,
      });
      setMessage(msg);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        isAxiosError(err)
          ? (err.response?.data?.message as string) || "Could not reset password."
          : "Could not reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Reset password" canonical="/forgot-password" noindex />
      <div className="max-w-md mx-auto pt-28 pb-16 px-4">
        <h1 className="text-3xl font-black text-text-main mb-2">Reset password</h1>
        <p className="text-text-muted text-sm mb-8">
          Enter your email to receive a 6-digit reset code.
        </p>
        <form
          onSubmit={codeSent ? onReset : onSend}
          className="card-main space-y-4 shadow-lg"
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border-sleek px-4 py-3 bg-surface"
            />
          </label>
          {codeSent && (
            <>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  6-digit code
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-border-sleek px-4 py-3 bg-surface"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  New password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-sleek px-4 py-3 bg-surface"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Confirm password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-border-sleek px-4 py-3 bg-surface"
                />
              </label>
            </>
          )}
          {message && <p className="text-sm text-accent font-medium">{message}</p>}
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-sleek btn-primary font-bold disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : codeSent
                ? "Update password"
                : "Send reset code"}
          </button>
          {codeSent && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onSend({ preventDefault() {} } as FormEvent)}
              className="w-full text-sm font-semibold text-text-muted hover:text-text-main"
            >
              Resend code
            </button>
          )}
          <p className="text-center text-sm text-text-muted">
            <Link to="/login" className="font-bold text-accent hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
