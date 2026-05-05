// chainloop-ui/src/components/common/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  /** Runs before logout + redirect (e.g. close mobile menu). */
  onClick?: () => void;
};

const LogoutButton = ({ className = "", label = "Logout", onClick }: LogoutButtonProps) => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    onClick?.();
    logout();
    navigate("/");
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {label}
    </button>
  );
};

export default LogoutButton;