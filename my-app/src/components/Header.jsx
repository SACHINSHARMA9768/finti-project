import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { TrendingUp, Settings, Moon, Sun, X } from "lucide-react";

import { useTheme } from "./ThemeToggle.jsx";
import axios from "axios";

const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  const handlelogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      navigate("/login");
    }
  };

  // Close settings when clicking outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Open IPOs", path: "/popular-ipos" },
    { name: "Upcoming IPOs", path: "/upcoming-ipos" },
    { name: "Compare IPOs", path: "/compare-ipo" },
    { name: "Upload IPO Document", path: "/upload-ipo" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <TrendingUp size={24} />
          </div>

          <span className="text-xl font-bold">
            IPO<span className="text-blue-600">Simplifier</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600 dark:text-gray-300"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Settings */}

        <div className="relative" ref={settingsRef}>
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setSettingsOpen((previous) => !previous)}
            aria-expanded={settingsOpen}
            aria-label="Toggle settings"
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
              settingsOpen
                ? "border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950"
                : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          {/* Settings Dropdown */}
          {settingsOpen && (
            <div className="absolute right-0 top-14 z-[60] w-72 rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Settings</h2>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  aria-label="Close settings"
                  className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Theme */}
              <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                    {darkMode ? (
                      <Moon size={20} className="text-blue-500" />
                    ) : (
                      <Sun size={20} className="text-amber-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Change background
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={darkMode}
                  aria-label="Toggle dark mode"
                  onClick={toggleTheme}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    darkMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setSettingsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <span>Profile</span>
                </Link>

                {/* Divider */}
                <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handlelogout}
                  className="w-full rounded-lg px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100 dark:hover:bg-rose-950"
                >
                  Log out
                </button>
              </div>

              {/* Footer */}
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Your appearance preference is saved automatically.
              </p>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
