import { LogOut, Leaf } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../features/auth/authThunks";

export default function AppShell({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
              <Leaf size={22} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Grow Mate</h1>
              <p className="text-sm text-slate-400">User control panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.fullName || "User"}</p>
              <p className="text-xs text-slate-400">{user?.email || ""}</p>
            </div>

            <button
              onClick={() => dispatch(logoutThunk())}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}