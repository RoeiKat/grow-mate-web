import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import { clearAuth, saveAuth } from "../../utils/storage";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveAuth(data.token, data.user);
    return data;
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    saveAuth(data.token, data.user);
    return data;
  }
);

export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async () => {
    const { data } = await api.get("/auth/me");
    return data.user;
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  clearAuth();
  return true;
});