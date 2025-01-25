import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: JSON.parse(localStorage.getItem("notifications")) || [], // Parse the string back into an array
  isNotificationLoading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      console.log(action.payload);
      state.notifications = [...state.notifications, ...action.payload];
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
    setNotificationLoader: (state, action) => {
      state.isNotificationLoading = action.payload;
    },
    updateNotifications: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
  },
});

export const { setNotificationLoader, setNotification, updateNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
