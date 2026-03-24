import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogoutButton = ({ 
  className = "", 
  variant = "default",
  size = "default",
  iconOnly = false,
  showToast = true
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("CompanyEmail");
    if (showToast) {
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Redirect to login
    navigate("/login-admin", { replace: true });
  };

  // Style variants
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
    outline: "border border-purple-600 text-purple-600 hover:bg-purple-50",
    ghost: "text-purple-600 hover:bg-purple-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };

  const iconOnlyStyles = iconOnly ? "p-2" : "";

  return (
    <button
      onClick={handleLogout}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${iconOnlyStyles} ${className}`}
      aria-label="Logout"
      title="Logout"
    >
      <LogOut className={`${iconOnly ? "w-5 h-5" : "w-4 h-4"}`} />
      {!iconOnly && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;