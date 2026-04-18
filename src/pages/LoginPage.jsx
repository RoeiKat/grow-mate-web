import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { loginThunk, registerThunk } from "../features/auth/authThunks";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (mode === "login") {
      dispatch(loginThunk({ email: form.email, password: form.password }));
      return;
    }

    dispatch(registerThunk(form));
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/75 shadow-2xl shadow-black/30 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-emerald-500/20 via-cyan-400/10 to-slate-950 p-10 lg:block">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
              <Leaf size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Grow Mate</h1>
              <p className="text-slate-300">Smart plant care dashboard</p>
            </div>
          </div>

          <div className="mt-12 space-y-5 text-slate-300">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              Pair devices with a live pairing code
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              Inspect telemetry from the backend
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              Send watering and refresh commands for debugging
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">User app</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-slate-400">
              {mode === "login"
                ? "Sign in to manage your paired Grow Mate devices."
                : "Register a user account for pairing and debugging your devices."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" ? (
              <div>
                <label className="mb-2 block text-sm text-slate-300">Full name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
            className="mt-5 text-sm text-slate-400 hover:text-slate-200"
          >
            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}