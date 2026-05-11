import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, LogOut, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../features/auth/authThunks";

const LOGO_URL =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1778477218/r2BGYaR01_3_lxjzyg.svg";

function getInitialTheme() {
  const saved = localStorage.getItem("aro_theme");
  if (saved === "dark" || saved === "light") return saved;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function AppShell({
  children,
  logoHeight = 58,
  logoWidth = 180,
  logoMargin = "-20px",
  logoClassName = ""
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("aro_theme", next);
  }

  return (
    <div className="min-h-screen bg-[#F9F7F3] font-['Roboto',sans-serif] text-[#323232] transition dark:bg-[#323232] dark:text-[#F9F7F3]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F9F7F3]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#323232]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img
              src={LOGO_URL}
              alt="ARO"
              style={{ height: logoHeight, width: logoWidth, margin: logoMargin }}
              className={`object-contain ${logoClassName}`}
            />
          </Link>

          <nav className="hidden rounded-full bg-white p-1 shadow-sm md:flex dark:bg-white/10">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-full px-6 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-[#3F826D] text-[#F9F7F3]" : "opacity-70 hover:opacity-100"
                }`
              }
            >
              Devices
            </NavLink>

            <NavLink
              to="/forecast"
              className={({ isActive }) =>
                `rounded-full px-6 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-[#3F826D] text-[#F9F7F3]" : "opacity-70 hover:opacity-100"
                }`
              }
            >
              Forecast
            </NavLink>
          </nav>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm hover:bg-[#F9F7F3] dark:bg-white/10 dark:hover:bg-white/15"
            >
              <div className="text-right">
                <p className="text-sm font-bold">{user?.fullName || "User"}</p>
                <p className="text-xs opacity-60">{user?.email || ""}</p>
              </div>
              <ChevronDown size={16} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 rounded-[24px] bg-white p-3 shadow-xl dark:bg-[#3b3b3b]">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                    Theme
                  </span>

                  <span className="rounded-full bg-[#C7C6BC] px-3 py-1 text-xs font-bold text-[#323232]">
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>

                <button
                  onClick={() => dispatch(logoutThunk())}
                  className="mt-1 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm text-[#EF2356] hover:bg-[#EF2356]/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}