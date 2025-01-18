import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: [],
  isNotificationLoading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notifications = action.payload;
    },
    setNotificationLoader: (state, action) => {
      state.isNotificationLoading = action.payload;
    },
    updateNotifications: (state, action) => {
      const id = action.payload;

      const filteredNotification = state.notifications.filter(
        (notification) => notification._id !== id
      );
      state.notifications = filteredNotification;
    },
  },
});

export const { setNotificationLoader, setNotification, updateNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
