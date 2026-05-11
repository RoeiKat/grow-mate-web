import { Droplets, RefreshCcw } from "lucide-react";

export default function QuickCommandPanel({ deviceId, onSend }) {
  function sendRefresh() {
    onSend({ deviceId, type: "refresh_telemetry", payload: {} });
  }

  function sendWater() {
    onSend({
      deviceId,
      type: "water_plant",
      payload: { reason: "manual_debug" }
    });
  }

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-white/10">
      <h2 className="text-lg font-bold">Commands</h2>

      <div className="mt-5 grid gap-3">
        <button
          onClick={sendRefresh}
          className="flex items-center justify-center gap-2 rounded-[10mm] bg-[#3F826D] px-4 py-3 font-semibold text-[#F9F7F3] hover:bg-[#356f5d]"
        >
          <RefreshCcw size={16} />
          Refresh telemetry
        </button>

        <button
          onClick={sendWater}
          className="flex items-center justify-center gap-2 rounded-[10mm] bg-[#C7C6BC] px-4 py-3 font-semibold text-[#323232] hover:bg-[#b9b8ae]"
        >
          <Droplets size={16} />
          Water plant
        </button>
      </div>
    </div>
  );
}