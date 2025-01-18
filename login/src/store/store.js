import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import authSlice from "./auth/authSlice";
import branchSlice from "./branch/branchSlice";
import vehicleSlice from "./vehicle/vehicleSlice";
import instructorSlice from "./instructor/instructorSlice";
import admissionSlice from "./admission/admissionSlice";
import alertSlice from "./alerts/alertSlice";
import Admission from "views/admin/Admission";
import attendanceSlice from "./attendance/attendanceSlice";
import courseSlice from "./courses/courseSlice";
import notificationSlice from "./notifications/notificationSlice";
const reducers = combineReducers({
  auth: authSlice,
  branch: branchSlice,
  vehicle: vehicleSlice,
  instructor: instructorSlice,
  admission: admissionSlice,
  alert: alertSlice,
  course: courseSlice,
  attendance: attendanceSlice,
  finance: admissionSlice,
  notification: notificationSlice,
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
