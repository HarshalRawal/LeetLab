import { useState, useEffect } from "react";
import { User, Code, LogOut, Bell, Settings, Shield } from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [location]);

  const navItems = [
    { name: "Problems", href: "/problems", icon: Code },
    { name: "Leaderboard", href: "/leaderboard", icon: Shield },
    { name: "Contests", href: "/contests", icon: Bell },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full ${isScrolled ? "py-2" : "py-4"}`}>
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center border p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 shadow-[0_4px_30px_rgba(0,0,0,0.8)]  border-gray-700/30"
            : "bg-gray-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.6)]  border-gray-700/20"
        }`}
      >
        {/* Logo */}    
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/ChatGPT Image Jun 29, 2025, 08_14_29 AM.png"
            className="h-12 w-12 bg-orange-500/20 border border-orange-500/30  rounded-xl object-fill"
          />
          <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent hidden md:block">
            LeetLab
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === item.href
                  ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                  : "text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Profile Dropdown */}
        {authUser && (
          <div className="relative">
          <button
  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
  className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-800/60 bg-gray-800/40 border border-gray-700/50 transition-all duration-300"
>
  <img
    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
    alt="User Avatar"
    className="w-10 h-10 rounded-xl object-cover border-2 border-orange-500/30"
  />
  <div className="hidden lg:block text-left">
    <p className="text-sm font-medium text-gray-200">{authUser?.name}</p>
  </div>
</button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden z-50">
                <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-gray-700/30 flex items-center gap-3">
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-xl object-cover border border-orange-500/30"
                  />
                  <div>
                    <p className="font-semibold text-gray-200">{authUser?.username}</p>
                    <p className="text-sm text-orange-400 capitalize">{authUser?.role?.toLowerCase()}</p>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 hover:text-orange-400 text-gray-300 border border-transparent hover:border-orange-500/20"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 hover:text-orange-400 text-gray-300 border border-transparent hover:border-orange-500/20"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  {authUser?.role === "ADMIN" && (
                    <Link
                      to="/add-problem"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 hover:text-orange-400 text-gray-300 border border-transparent hover:border-orange-500/20"
                    >
                      <Code className="w-4 h-4" />
                      <span>Add Problem</span>
                      <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">Admin</span>
                    </Link>
                  )}

                  <hr className="border-gray-700/30 my-2" />

                  <LogoutButton className="btn btn-warning btn-block text-gray-800">
                    <LogOut className="w-4 h-4" />
                    <span className="text-bold">Logout</span>
                  </LogoutButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
