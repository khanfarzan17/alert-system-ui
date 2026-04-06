import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "../slice/uploadSlice.js";

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
  },
});