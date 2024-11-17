import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import authSlice from "./auth/authSlice";
const reducers = combineReducers({
  auth: authSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
const persistedReducer = persistReducer(persistConfig, reducers);
const rootReducer = (state, action) => {
  if (action.type === "RESET_ALL_SLICES") {
    storage.removeItem("persist:root");
    const { auth, ...resetSlices } = state;
    const resetState = Object.keys(resetSlices).reduce((acc, key) => {
      acc[key] = undefined;
      return acc;
    }, {});
    state = {
      auth,
      ...resetState,
    };
  }
  return persistedReducer(state, action);
};
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
