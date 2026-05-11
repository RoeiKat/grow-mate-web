import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppShell from "../components/AppShell";
import DeviceCard from "../components/DeviceCard";
import { fetchDevicesThunk } from "../features/devices/deviceThunks";

const PAGE_SIZE = 6;

export default function DevicesPage() {
  const dispatch = useDispatch();
  const { list, loadingList } = useSelector((state) => state.devices);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDevicesThunk());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  const visibleDevices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, page]);

  return (
    <AppShell>
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#3F826D]">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-4xl font-extrabold">All devices</h1>
        <p className="mt-2 opacity-60">Browse and manage every paired ARO device.</p>
      </div>

      {loadingList ? (
        <div className="rounded-[32px] bg-white p-8 text-center shadow-sm dark:bg-white/10">
          Loading devices...
        </div>
      ) : visibleDevices.length === 0 ? (
        <div className="rounded-[32px] bg-white p-8 text-center shadow-sm dark:bg-white/10">
          No paired devices yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleDevices.map((device) => (
            <DeviceCard key={device._id} device={device} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full bg-white p-3 shadow-sm disabled:opacity-40 dark:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="text-sm font-bold">
          Page {page} / {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-full bg-white p-3 shadow-sm disabled:opacity-40 dark:bg-white/10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </AppShell>
  );
}