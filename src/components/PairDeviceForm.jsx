import { useState } from "react";
import { Link2 } from "lucide-react";

export default function PairDeviceForm({ loading, onSubmit }) {
  const [code, setCode] = useState("");
  const [deviceName, setDeviceName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ code, deviceName });
    setCode("");
    setDeviceName("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
          <Link2 size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Pair a device</h2>
          <p className="text-sm text-slate-400">Enter the pairing code shown by the device.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Pairing code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Device name</label>
          <input
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Living room basil"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
          />
        </div>

        <button
          disabled={loading}
          className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Pairing..." : "Pair device"}
        </button>
      </div>
    </form>
  );
}