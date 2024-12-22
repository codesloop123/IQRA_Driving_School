import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  alerts: [],
  isAlertLoading: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlertLoader: (state, action) => {
      state.isAlertLoading = action.payload;
    },
    setAlert: (state, action) => {
      state.alerts = action.payload;
    },
  },
});

export const { setAlertLoader, setAlert } = alertSlice.actions;
export default alertSlice.reducer;
