import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  branches: [],
  isbranchLoading: false,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setBranchLoader: (state, action) => {
      state.isbranchLoading = action.payload;
    },
  },
});

export const { setBranchLoader, setBranches } = branchSlice.actions;
export default branchSlice.reducer;
