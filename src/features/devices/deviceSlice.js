import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDeviceDetailsThunk,
  fetchDevicesThunk,
  pairDeviceThunk,
  renameDeviceThunk,
  unpairDeviceThunk
} from "./deviceThunks";

const initialState = {
  list: [],
  selectedDevice: null,
  telemetry: {},
  recentCommands: [],
  loadingList: false,
  loadingDetails: false,
  pairing: false,
  error: ""
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    clearSelectedDevice(state) {
      state.selectedDevice = null;
      state.telemetry = {};
      state.recentCommands = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevicesThunk.pending, (state) => {
        state.loadingList = true;
        state.error = "";
      })
      .addCase(fetchDevicesThunk.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchDevicesThunk.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message;
      })
      .addCase(pairDeviceThunk.pending, (state) => {
        state.pairing = true;
        state.error = "";
      })
      .addCase(pairDeviceThunk.fulfilled, (state) => {
        state.pairing = false;
      })
      .addCase(pairDeviceThunk.rejected, (state, action) => {
        state.pairing = false;
        state.error = action.error.message;
      })
      .addCase(fetchDeviceDetailsThunk.pending, (state) => {
        state.loadingDetails = true;
        state.error = "";
      })
      .addCase(fetchDeviceDetailsThunk.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedDevice = action.payload.device;
        state.telemetry = action.payload.telemetry || action.payload.device?.latestData || {};
        state.recentCommands = action.payload.recentCommands || [];
      })
      .addCase(fetchDeviceDetailsThunk.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.error.message;
      })
      .addCase(renameDeviceThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((item) =>
          item._id === updated._id ? updated : item
        );

        if (state.selectedDevice?._id === updated._id) {
          state.selectedDevice = updated;
        }
      })
      .addCase(unpairDeviceThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);

        if (state.selectedDevice?._id === action.payload) {
          state.selectedDevice = null;
          state.telemetry = {};
          state.recentCommands = [];
        }
      });
  }
});

export const { clearSelectedDevice } = deviceSlice.actions;
export default deviceSlice.reducer;