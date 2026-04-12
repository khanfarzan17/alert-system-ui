import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    tableData: [],
    tableColumns: [],
    uploadHistory: [],
  },
  reducers: {
    setUploadData(state, action) {
      state.tableData = action.payload.tableData;
      state.tableColumns = action.payload.tableColumns;
    },
    addUploadHistory(state, action) {
      state.uploadHistory = [action.payload, ...state.uploadHistory];
    },
    setUploadHistory(state, action) {
      state.uploadHistory = action.payload;
    },
    clearUploadData(state) {
      state.tableData = [];
      state.tableColumns = [];
    },
  },
});

export const { setUploadData, addUploadHistory, setUploadHistory, clearUploadData } = uploadSlice.actions;
export default uploadSlice.reducer;