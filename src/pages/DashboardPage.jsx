import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppShell from "../components/AppShell";
import PairDeviceForm from "../components/PairDeviceForm";
import DeviceCard from "../components/DeviceCard";
import StatCard from "../components/StatCard";
import { fetchDevicesThunk, pairDeviceThunk } from "../features/devices/deviceThunks";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { list, pairing, loadingList, error } = useSelector((state) => state.devices);

  useEffect(() => {
    dispatch(fetchDevicesThunk());
  }, [dispatch]);

  async function handlePairDevice(payload) {
    await dispatch(pairDeviceThunk(payload));
    dispatch(fetchDevicesThunk());
  }

  const onlineCount = list.filter((device) => {
    if (!device.lastSeenAt) return false;
    return Date.now() - new Date(device.lastSeenAt).getTime() < 60_000;
  }).length;

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.95fr]">
        <div className="space-y-6">
          <PairDeviceForm loading={pairing} onSubmit={handlePairDevice} />

          {error ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard
              label="Paired devices"
              value={list.length}
              hint="Devices currently assigned to your account"
            />
            <StatCard
              label="Online now"
              value={onlineCount}
              hint="Seen within the last minute"
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">My devices</h2>
            <p className="text-sm text-slate-400">
              Open a device to inspect telemetry and queue commands.
            </p>
          </div>

          {loadingList ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
              Loading devices...
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
              No paired devices yet.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {list.map((device) => (
                <DeviceCard key={device._id} device={device} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}