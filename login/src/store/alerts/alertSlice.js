import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  admissions: [],
  registerLoading: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlertLoader: (state, action) => {
      state.registerLoading = action.payload;
    },
    setAlert: (state, action) => {
      state.admissions = action.payload;
    },
  },
});

export const { setAlertLoader, setAlert } = alertSlice.actions;
export default alertSlice.reducer;
