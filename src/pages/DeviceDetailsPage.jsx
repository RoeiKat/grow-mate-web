import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import AppShell from "../components/AppShell";
import DeviceTelemetryPanel from "../components/DeviceTelemetryPanel";
import QuickCommandPanel from "../components/QuickCommandPanel";
import {
  fetchDeviceDetailsThunk,
  renameDeviceThunk,
  unpairDeviceThunk
} from "../features/devices/deviceThunks";
import {
  cancelCommandThunk,
  fetchCommandsThunk,
  sendCommandThunk
} from "../features/commands/commandThunks";
import { formatDate, getOnlineLabel } from "../utils/format";

export default function DeviceDetailsPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedDevice, telemetry, loadingDetails, recentCommands } = useSelector(
    (state) => state.devices
  );
  const { list: commands } = useSelector((state) => state.commands);

  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    dispatch(fetchDeviceDetailsThunk(deviceId));
    dispatch(fetchCommandsThunk(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    setRenameValue(selectedDevice?.name || "");
  }, [selectedDevice]);

  const commandRows = useMemo(() => {
    return commands.length > 0 ? commands : recentCommands;
  }, [commands, recentCommands]);

  async function handleRename() {
    await dispatch(renameDeviceThunk({ deviceId, name: renameValue }));
    dispatch(fetchDeviceDetailsThunk(deviceId));
  }

  async function handleUnpair() {
    const confirmed = window.confirm("Unpair this device?");
    if (!confirmed) return;

    await dispatch(unpairDeviceThunk(deviceId));
    navigate("/");
  }

  async function handleSendCommand(payload) {
    await dispatch(sendCommandThunk(payload));
    dispatch(fetchCommandsThunk(deviceId));
    dispatch(fetchDeviceDetailsThunk(deviceId));
  }

  async function handleCancel(commandId) {
    await dispatch(cancelCommandThunk(commandId));
    dispatch(fetchCommandsThunk(deviceId));
  }

  if (loadingDetails || !selectedDevice) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Loading device...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {selectedDevice.name || selectedDevice.serialNumber || "Device"}
          </h1>
          <p className="mt-2 text-slate-400">{selectedDevice.serialNumber}</p>
        </div>

        <button
          onClick={handleUnpair}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200 hover:bg-rose-400/15"
        >
          <Trash2 size={16} />
          Unpair
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Connection</p>
              <p className="mt-2 text-xl font-semibold">{getOnlineLabel(selectedDevice.lastSeenAt)}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Last seen</p>
              <p className="mt-2 text-sm font-medium">{formatDate(selectedDevice.lastSeenAt)}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Firmware</p>
              <p className="mt-2 text-xl font-semibold">{selectedDevice.firmwareVersion || "—"}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Auth version</p>
              <p className="mt-2 text-xl font-semibold">{selectedDevice.authVersion || "—"}</p>
            </div>
          </div>

          <DeviceTelemetryPanel telemetry={telemetry} />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Recent commands</h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-slate-900/80 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10 bg-slate-950/40">
                  {commandRows.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                        No commands yet.
                      </td>
                    </tr>
                  ) : (
                    commandRows.map((command) => (
                      <tr key={command._id}>
                        <td className="px-4 py-3">{command.type}</td>
                        <td className="px-4 py-3">{command.status}</td>
                        <td className="px-4 py-3">{formatDate(command.createdAt)}</td>
                        <td className="px-4 py-3">
                          {command.status === "pending" ? (
                            <button
                              onClick={() => handleCancel(command._id)}
                              className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-400/15"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Rename device</h2>

            <div className="mt-4 flex gap-3">
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="New device name"
              />

              <button
                onClick={handleRename}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-slate-950 hover:bg-slate-200"
              >
                <Pencil size={16} />
                Save
              </button>
            </div>
          </div>

          <QuickCommandPanel deviceId={deviceId} onSend={handleSendCommand} />
        </div>
      </div>
    </AppShell>
  );
}