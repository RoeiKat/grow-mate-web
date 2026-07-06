import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginThunk, registerThunk } from "../features/auth/authThunks";
import g1LoginImage from "../assets/g1-login.jpg";

const LOGO_URL =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1778477218/r2BGYaR01_3_lxjzyg.svg";

const IMAGE_WIDTH = "48%"; // bigger = cut/image goes further right
const CUT = 60; // bigger = cut starts further right on top
const FORM_OFFSET = "8%"; // smaller = form more left, bigger = more right

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
    <div className="relative min-h-screen overflow-hidden bg-white font-['Roboto',sans-serif] text-[#323232]">
      <div
        className="absolute inset-0"
      />

      <section
        className="absolute bottom-0 left-0 top-0 hidden overflow-hidden lg:block"
        style={{
          width: IMAGE_WIDTH,
          clipPath: `polygon(0 0, ${CUT}% 0, 100% 100%, 0 100%)`
        }}
      >
        <img
          src={g1LoginImage}
          alt="ARO G1"
          className="h-full w-full object-cover"
        />

        <img
          src={LOGO_URL}
          alt="ARO"
          className="absolute left-8 top-8 h-16 w-44 object-contain brightness-0 invert"
        />
      </section>

      <div
        className="relative z-10 flex min-h-screen items-center px-6 py-10"
        style={{
          paddingLeft: `calc(${IMAGE_WIDTH} + ${FORM_OFFSET})`
        }}
      >
        <section className="w-full max-w-xl rounded-[42px] bg-white/90 p-8 shadow-xl backdrop-blur-xl">
          <img src={LOGO_URL} alt="ARO" className="-ml-15 h-20 w-56 object-contain" />


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