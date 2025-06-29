import { useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { LogOut } from "lucide-react";

const LogoutButton = ({ className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`btn w-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold rounded-xl border-none ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Logging out...
        </>
      ) : (
        <div className="flex items-center gap-2">
          <LogOut children="h-4 w-4"/>
          <span className="text-gray-900">Logout</span>
        </div>
      )}
    </button>
  );
};

export default LogoutButton;
