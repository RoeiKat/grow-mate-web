import { prettyJson } from "../utils/format";

export default function DeviceTelemetryPanel({ telemetry }) {
  const entries = Object.entries(telemetry || {});

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Latest telemetry</h2>
        <p className="text-sm text-slate-400">Raw device data currently stored on the backend.</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">
          No telemetry yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
                <p className="mt-2 break-words text-base font-medium">{String(value)}</p>
              </div>
            ))}
          </div>

          <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-emerald-300">
            {prettyJson(telemetry)}
          </pre>
        </>
      )}
    </div>
  );
}