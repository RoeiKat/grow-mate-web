import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const sendCommandThunk = createAsyncThunk(
  "commands/send",
  async ({ deviceId, type, payload }) => {
    const { data } = await api.post("/commands", {
      deviceId,
      type,
      payload
    });
    return data.command;
  }
);

export const fetchCommandsThunk = createAsyncThunk(
  "commands/fetchByDevice",
  async (deviceId) => {
    const { data } = await api.get(`/commands/device/${deviceId}`);
    return data.commands;
  }
);

export const cancelCommandThunk = createAsyncThunk(
  "commands/cancel",
  async (commandId) => {
    const { data } = await api.patch(`/commands/${commandId}/cancel`);
    return data.command;
  }
);