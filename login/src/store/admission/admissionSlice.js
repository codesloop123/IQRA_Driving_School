import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  registerLoading: false,
};

const admissionSlice = createSlice({
  name: "admission",
  initialState,
  reducers: {
    setRegisterLoader: (state, action) => {
      state.registerLoading = action.payload;
    },
  },
});

export const { setRegisterLoader } = admissionSlice.actions;
export default admissionSlice.reducer;
