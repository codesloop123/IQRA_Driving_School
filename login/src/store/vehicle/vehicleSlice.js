import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  vehicles: [],
  isVehicleLoading: false,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    setVehicleLoader: (state, action) => {
      state.isVehicleLoading = action.payload;
    },
  },
});

export const { setVehicleLoader, setVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;
