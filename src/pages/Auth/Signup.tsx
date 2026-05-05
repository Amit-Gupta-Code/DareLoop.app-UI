import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initGoogleAuth, triggerGoogleLogin } from "../../services/googleAuth";
import API from "../../api/client";
import { useAuthStore } from "../../store/authStore";

const Signup = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/create", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    initGoogleAuth(async (credential: string) => {
      setLoading(true);
      try {
        const res = await API.post("/auth/google", { token: credential });

        const { user, access_token } = res.data.data;
        localStorage.setItem("access_token", access_token);
        setAuth(user);
        navigate("/");
      } catch (err) {
        console.error("Google login failed", err);
      } finally {
        setLoading(false); // ✅ always runs, success or failure
      }
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6">
      <div className="card-main max-w-[400px] w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Join the Network</h1>
          <p className="text-text-muted text-[15px]">
            Connect instantly and start building your chains.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={triggerGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border p-4 rounded-xl font-bold cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                Signing you in...
              </span>
            ) : (
              <>
                <img
                  src="https://cdn-icons-png.flaticon.com/256/2702/2702602.png"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;