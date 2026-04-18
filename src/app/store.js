import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import deviceReducer from "../features/devices/deviceSlice";
import commandReducer from "../features/commands/commandSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    commands: commandReducer
  }
});