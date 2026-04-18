import { Link } from "react-router-dom";
import { Cpu, Droplets, Wifi } from "lucide-react";
import { formatDate, getOnlineLabel } from "../utils/format";

export default function DeviceCard({ device }) {
  const moisture = device?.latestData?.moisture ?? device?.latestData?.soilMoisture ?? "—";

  return (
    <Link
      to={`/devices/${device._id}`}
      className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold group-hover:text-emerald-300">
            {device.name || device.serialNumber || "Unnamed device"}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{device.serialNumber || "No serial"}</p>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          {device.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Wifi size={15} />
            <span className="text-xs">Status</span>
          </div>
          <p className="mt-2 text-sm font-medium">{getOnlineLabel(device.lastSeenAt)}</p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets size={15} />
            <span className="text-xs">Moisture</span>
          </div>
          <p className="mt-2 text-sm font-medium">{String(moisture)}</p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu size={15} />
            <span className="text-xs">Firmware</span>
          </div>
          <p className="mt-2 text-sm font-medium">{device.firmwareVersion || "—"}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">Last seen: {formatDate(device.lastSeenAt)}</p>
    </Link>
  );
}