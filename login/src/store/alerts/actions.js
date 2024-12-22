import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setAlert, setAlertLoader } from "./alertSlice";
export const fetchAlert = createAsyncThunk(
  "alert/get",
  async (branches, { dispatch }) => {
    try {
      dispatch(setAlertLoader(true));
      const response = await axiosInstance.get(
        `/alerts/payments/${branches._id}`,
        {
          branches,
        }
      );
      if (response.status) {
        dispatch(setAlert(response.data));
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      dispatch(setAlertLoader(false));
    }
  }
);
