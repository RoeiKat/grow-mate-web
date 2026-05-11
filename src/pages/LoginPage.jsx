import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { loginThunk, registerThunk } from "../features/auth/authThunks";

const LOGO_URL =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1778477218/r2BGYaR01_3_lxjzyg.svg";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  if (token) return <Navigate to="/" replace />;

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
    <div className="min-h-screen bg-[#F9F7F3] font-['Roboto',sans-serif] text-[#323232]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[42px] bg-white p-8 shadow-xl">
          <img src={LOGO_URL} alt="ARO" className="-ml-5 h-20 w-56 object-contain" />

          <div className="mt-10 overflow-hidden rounded-[36px] bg-[#F9F7F3] p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-3xl bg-[#3F826D]/10 p-4 text-[#3F826D]">
                <Leaf size={28} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold">Grow smarter.</h1>
                <p className="mt-1 opacity-60">Control and monitor your ARO G1 devices.</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4">
              {[
                "Pair devices with a live pairing code",
                "Track room temperature, soil temperature, light and moisture",
                "Queue watering and telemetry commands"
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center justify-between rounded-[28px] bg-white px-5 py-4 shadow-sm"
                >
                  <span className="font-semibold">{text}</span>
                  <ArrowRight size={17} className="text-[#3F826D]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[42px] bg-white p-8 shadow-xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#3F826D]">
            User App
          </p>

          <h2 className="mt-4 text-4xl font-extrabold">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>

          <p className="mt-2 opacity-60">
            {mode === "login"
              ? "Sign in to manage your paired ARO devices."
              : "Register and start pairing your devices."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-sm font-bold">Full name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-[10mm] border border-black/10 bg-[#F9F7F3] px-5 py-4 outline-none focus:border-[#3F826D]"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-[10mm] border border-black/10 bg-[#F9F7F3] px-5 py-4 outline-none focus:border-[#3F826D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-[10mm] border border-black/10 bg-[#F9F7F3] px-5 py-4 outline-none focus:border-[#3F826D]"
              />
            </div>

            {error && (
              <div className="rounded-[24px] bg-[#EF2356]/10 px-5 py-4 text-sm font-semibold text-[#EF2356]">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-[10mm] bg-[#3F826D] px-5 py-4 font-extrabold text-[#F9F7F3] transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
            className="mt-6 text-sm font-bold text-[#3F826D]"
          >
            {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        </section>
      </div>
    </div>
  );
}