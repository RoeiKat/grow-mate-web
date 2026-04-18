import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const fetchDevicesThunk = createAsyncThunk("devices/fetchAll", async () => {
  const { data } = await api.get("/devices/me");
  return data.devices;
});

export const pairDeviceThunk = createAsyncThunk(
  "devices/pair",
  async ({ code, deviceName }) => {
    const { data } = await api.post("/devices/pair", { code, deviceName });
    return data;
  }
);

export const fetchDeviceDetailsThunk = createAsyncThunk(
  "devices/fetchOne",
  async (deviceId) => {
    const { data } = await api.get(`/devices/${deviceId}`);
    return data;
  }
);

export const renameDeviceThunk = createAsyncThunk(
  "devices/rename",
  async ({ deviceId, name }) => {
    const { data } = await api.patch(`/devices/${deviceId}`, { name });
    return data.device;
  }
);

export const unpairDeviceThunk = createAsyncThunk(
  "devices/unpair",
  async (deviceId) => {
    await api.delete(`/devices/${deviceId}`);
    return deviceId;
  }
);