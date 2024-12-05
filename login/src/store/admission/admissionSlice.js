import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  admissions: [],
  registerLoading: false,
};

const admissionSlice = createSlice({
  name: "admission",
  initialState,
  reducers: {
    setRegisterLoader: (state, action) => {
      state.registerLoading = action.payload;
    },
    setAdmissions: (state, action) => {
      state.admissions = action.payload;
    },
  },
});

export const { setRegisterLoader, setAdmissions } = admissionSlice.actions;
export default admissionSlice.reducer;
