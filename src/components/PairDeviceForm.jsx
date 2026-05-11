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
      className="rounded-[32px] bg-white p-6 shadow-2xl dark:bg-[#3b3b3b]"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#3F826D]/10 p-3 text-[#3F826D]">
          <Link2 size={18} />
        </div>

        <div>
          <h2 className="text-lg font-bold">Pair a device</h2>
          <p className="text-sm opacity-60">Enter the pairing code shown by the device.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Pairing code"
          className="rounded-[10mm] border border-black/10 bg-[#F9F7F3] px-4 py-3 outline-none focus:border-[#3F826D] dark:border-white/10 dark:bg-[#323232]"
        />

        <input
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="Device name"
          className="rounded-[10mm] border border-black/10 bg-[#F9F7F3] px-4 py-3 outline-none focus:border-[#3F826D] dark:border-white/10 dark:bg-[#323232]"
        />

        <button
          disabled={loading}
          className="rounded-[10mm] bg-[#3F826D] px-4 py-3 font-bold text-[#F9F7F3] hover:bg-[#356f5d]"
        >
          {loading ? "Pairing..." : "Pair device"}
        </button>
      </div>
    </form>
  );
}