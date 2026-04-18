import { createSlice } from "@reduxjs/toolkit";
import { fetchMeThunk, loginThunk, logoutThunk, registerThunk } from "./authThunks";
import { getStoredUser, getToken } from "../../utils/storage";

const initialState = {
  token: getToken(),
  user: getStoredUser(),
  loading: false,
  error: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.token = "";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = "";
        state.error = "";
      });
  }
});

export default authSlice.reducer;