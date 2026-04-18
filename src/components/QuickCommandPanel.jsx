import { useState } from "react";
import { Droplets, RefreshCcw } from "lucide-react";

export default function QuickCommandPanel({ deviceId, onSend }) {
  const [amountMl, setAmountMl] = useState(50);

  function sendRefresh() {
    onSend({ deviceId, type: "refresh_telemetry", payload: {} });
  }

  function sendWater() {
    onSend({
      deviceId,
      type: "water_plant",
      payload: {
        amountMl: Number(amountMl) || 0,
        reason: "manual_debug"
      }
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Commands</h2>
        <p className="text-sm text-slate-400">Queue actions for this device.</p>
      </div>

      <div className="grid gap-3">
        <button
          onClick={sendRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-cyan-300 hover:bg-cyan-400/15"
        >
          <RefreshCcw size={16} />
          Refresh telemetry
        </button>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <label className="mb-2 block text-sm text-slate-300">Water amount (mL)</label>
          <input
            type="number"
            min="0"
            value={amountMl}
            onChange={(e) => setAmountMl(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
          />

          <button
            onClick={sendWater}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-300 hover:bg-emerald-400/15"
          >
            <Droplets size={16} />
            Water plant
          </button>
        </div>
      </div>
    </div>
  );
}