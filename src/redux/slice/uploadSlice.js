import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    tableData: [],
    tableColumns: [],
  },
  reducers: {
    setUploadData(state, action) {
      state.tableData = action.payload.tableData;
      state.tableColumns = action.payload.tableColumns;
    },
    clearUploadData(state) {
      state.tableData = [];
      state.tableColumns = [];
    },
  },
});

export const { setUploadData, clearUploadData } = uploadSlice.actions;
export default uploadSlice.reducer;