import { NavLink } from "react-router-dom";
import Logout from "../components/Logout.jsx";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarDays,
  GitCompareArrows,
  Upload,
  UserRound,
  Settings,
  ChartNoAxesCombined,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Popular IPOs",
      path: "/popular-ipos",
      icon: TrendingUp,
    },
    {
      name: "Upcoming IPOs",
      path: "/upcoming-ipos",
      icon: CalendarDays,
    },
    {
      name: "Compare IPOs",
      path: "/compare-ipo",
      icon: GitCompareArrows,
    },
    {
      name: "Upload IPO Document",
      path: "/upload-ipo",
      icon: Upload,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
        <div className="rounded-xl bg-blue-600 p-2 text-white">
          <ChartNoAxesCombined size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">IPO Simplifier</h1>
          <p className="text-xs text-slate-500">Smart IPO Insights</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-slate-200 p-4">
        <div className="shrink-0 border-t border-slate-200 p-4">
          <Logout />
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          IPO Simplifier © 2026
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
