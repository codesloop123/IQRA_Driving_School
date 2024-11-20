import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  uid: null,
  user: null,
  isSigninLoading: false,
  registerLoading: false,
  users: [],
  fetchLoading: false,
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
    setRegisterLoader: (state, action) => {
      state.registerLoading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFetchUserLoader: (state, action) => {
      state.fetchLoading = action.payload;
    },
    resetStore: () => {
      return initialState;
    },
  },
});

export const {
  setUserCredentials,
  resetStore,
  setSignInLoader,
  setRegisterLoader,
  setUsers,
  setFetchUserLoader,
} = authSlice.actions;
export default authSlice.reducer;
