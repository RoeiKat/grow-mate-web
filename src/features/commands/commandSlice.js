import { createSlice } from "@reduxjs/toolkit";
import { cancelCommandThunk, fetchCommandsThunk, sendCommandThunk } from "./commandThunks";

const initialState = {
  list: [],
  loading: false,
  error: ""
};

const commandSlice = createSlice({
  name: "commands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommandsThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCommandsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCommandsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendCommandThunk.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(cancelCommandThunk.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      });
  }
});

export default commandSlice.reducer;