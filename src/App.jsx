import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import DeviceDetailsPage from "./pages/DeviceDetailsPage";
import ForecastPage from "./pages/ForecastPage";
import AuthGuard from "./components/AuthGuard";
import { fetchMeThunk } from "./features/auth/authThunks";

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchMeThunk());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />

      <Route
        path="/devices"
        element={
          <AuthGuard>
            <DevicesPage />
          </AuthGuard>
        }
      />

      <Route
        path="/devices/:deviceId"
        element={
          <AuthGuard>
            <DeviceDetailsPage />
          </AuthGuard>
        }
      />

      <Route
        path="/forecast"
        element={
          <AuthGuard>
            <ForecastPage />
          </AuthGuard>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}