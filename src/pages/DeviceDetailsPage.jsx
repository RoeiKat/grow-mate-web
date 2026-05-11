import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  X,
  Trash2
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { formatDate, isOnline } from "../utils/format";

const DEVICE_IMG =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1778489591/sprout-tree-svgrepo-com_pfwl8p.svg";

const COMMANDS_PER_PAGE = 5;

export default function DeviceDetailsPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedDevice, telemetry, loadingDetails, recentCommands } = useSelector(
    (state) => state.devices
  );
  const { list: commands } = useSelector((state) => state.commands);

  const [editing, setEditing] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [commandsPage, setCommandsPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDeviceDetailsThunk(deviceId));
    dispatch(fetchCommandsThunk(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    setRenameValue(selectedDevice?.name || "");
  }, [selectedDevice]);

  const commandRows = useMemo(
    () => (commands.length > 0 ? commands : recentCommands || []),
    [commands, recentCommands]
  );

  const totalCommandPages = Math.max(1, Math.ceil(commandRows.length / COMMANDS_PER_PAGE));

  const visibleCommands = useMemo(() => {
    const start = (commandsPage - 1) * COMMANDS_PER_PAGE;
    return commandRows.slice(start, start + COMMANDS_PER_PAGE);
  }, [commandRows, commandsPage]);

  useEffect(() => {
    setCommandsPage(1);
  }, [commandRows.length]);

  function cancelRename() {
    setRenameValue("");
    setEditing(false);
  }

  async function handleRename() {
    if (!renameValue.trim()) return;

    await dispatch(renameDeviceThunk({ deviceId, name: renameValue.trim() }));
    setEditing(false);
    setRenameValue("");
    dispatch(fetchDeviceDetailsThunk(deviceId));
  }

  async function handleUnpair() {
    if (!window.confirm("Unpair this device?")) return;
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
        <div className="rounded-[32px] bg-white p-8 shadow-sm dark:bg-white/10">
          Loading device...
        </div>
      </AppShell>
    );
  }

  const online = isOnline(selectedDevice.lastSeenAt);

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-6">
          <div className="rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                {!editing ? (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold">
                      {selectedDevice.name || selectedDevice.serialNumber || "Device"}
                    </h1>

                    <button
                      onClick={() => setEditing(true)}
                      className="rounded-full bg-white p-2 shadow-sm hover:bg-[#F9F7F3] dark:bg-white/10 dark:hover:bg-white/15"
                      title="Edit name"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      placeholder={selectedDevice.name || "Device name"}
                      className="rounded-[10mm] border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#3F826D] dark:border-white/10 dark:bg-black/20"
                    />

                    <button
                      onClick={handleRename}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3F826D] text-white hover:bg-[#356f5d]"
                      title="Save"
                    >
                      <Check size={20} strokeWidth={3} />
                    </button>

                    <button
                      onClick={cancelRename}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EF2356] text-white hover:bg-[#d91f4d]"
                      title="Cancel"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>
                )}

                <p className="mt-2 text-sm opacity-60">
                  {online ? "Online" : "Offline"} • Last seen{" "}
                  {formatDate(selectedDevice.lastSeenAt)}
                </p>
              </div>

              <span
                className={`h-4 w-4 rounded-full ${
                  online ? "bg-[#3F826D]" : "bg-[#EF2356]"
                }`}
              />
            </div>

            <div className="my-8 flex justify-center">
              <img src={DEVICE_IMG} alt="Device" className="h-52 object-contain" />
            </div>

            <details className="rounded-[24px] bg-[#F9F7F3] p-4 dark:bg-black/20">
              <summary className="flex cursor-pointer items-center justify-between font-semibold">
                Device info <ChevronDown size={16} />
              </summary>

              <div className="mt-4 space-y-2 text-sm opacity-70">
                <p>Firmware: {selectedDevice.firmwareVersion || "—"}</p>
                <p>S/N: {selectedDevice.serialNumber || "—"}</p>
                <p>Auth: {selectedDevice.authVersion || "—"}</p>
              </div>
            </details>

            <button
              onClick={handleUnpair}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10mm] bg-[#EF2356] px-4 py-3 font-semibold text-white hover:bg-[#d91f4d]"
            >
              <Trash2 size={16} />
              Unpair
            </button>
          </div>

          <QuickCommandPanel deviceId={deviceId} onSend={handleSendCommand} />
        </aside>

        <section className="space-y-6">
          <DeviceTelemetryPanel telemetry={telemetry} />

          <div className="rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Recent Commands</h2>

              {commandRows.length > COMMANDS_PER_PAGE && (
                <p className="text-sm font-semibold opacity-60">
                  Page {commandsPage} / {totalCommandPages}
                </p>
              )}
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-black/5 dark:border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-[#F9F7F3] text-left dark:bg-black/20">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {commandRows.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center opacity-50">
                        No commands yet.
                      </td>
                    </tr>
                  ) : (
                    visibleCommands.map((command) => (
                      <tr
                        key={command._id}
                        className="border-t border-black/5 dark:border-white/10"
                      >
                        <td className="px-4 py-3">{command.type}</td>
                        <td className="px-4 py-3">{command.status}</td>
                        <td className="px-4 py-3">{formatDate(command.createdAt)}</td>
                        <td className="px-4 py-3">
                          {command.status === "pending" ? (
                            <button
                              onClick={() => handleCancel(command._id)}
                              className="rounded-full bg-[#C7C6BC] px-3 py-1.5 text-xs font-bold text-[#323232] hover:bg-[#b9b8ae]"
                            >
                              Cancel
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {commandRows.length > COMMANDS_PER_PAGE && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  disabled={commandsPage === 1}
                  onClick={() => setCommandsPage((page) => Math.max(1, page - 1))}
                  className="rounded-full bg-[#F9F7F3] p-3 shadow-sm hover:bg-[#ece8df] disabled:opacity-40 dark:bg-black/20 dark:hover:bg-black/30"
                  title="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-bold">
                  {commandsPage} / {totalCommandPages}
                </span>

                <button
                  disabled={commandsPage === totalCommandPages}
                  onClick={() =>
                    setCommandsPage((page) => Math.min(totalCommandPages, page + 1))
                  }
                  className="rounded-full bg-[#F9F7F3] p-3 shadow-sm hover:bg-[#ece8df] disabled:opacity-40 dark:bg-black/20 dark:hover:bg-black/30"
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}