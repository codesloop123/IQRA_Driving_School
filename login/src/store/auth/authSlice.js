import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  uid: null,
  user: null,
  isSigninLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.user = action.payload;
      state.uid = action.payload.id;
    },
    setSignInLoader: (state, action) => {
      state.isSigninLoading = action.payload;
    },
    resetStore: () => {
      return initialState;
    },
  },
});

export const { setUserCredentials, resetStore, setSignInLoader } =
  authSlice.actions;
export default authSlice.reducer;
