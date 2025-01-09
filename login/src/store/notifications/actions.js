import {
  setNotification,
  setNotificationLoader,
  updateNotifications,
} from "./notificationSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
export const fetchNotifications = createAsyncThunk(
  "notifications/get",
  async (role, { dispatch }) => {
    try {
      dispatch(setNotificationLoader(true));
      const response = await axiosInstance.post("/notifications/fetch", {
        role,
      });

      if (response.status) {
        console.log(response.data, "response data");
        dispatch(setNotification(response.data.notifications));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      dispatch(setNotificationLoader(false));
    }
  }
);
export const mutateNotifications = createAsyncThunk(
  "notifications/update",
  async (id, { dispatch }) => {
    try {
      dispatch(setNotificationLoader(true));

      dispatch(updateNotifications(id));
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      dispatch(setNotificationLoader(false));
    }
  }
);
