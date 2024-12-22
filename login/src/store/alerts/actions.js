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
      console.log(response.status);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setAlertLoader(false));
    }
  }
);

export const postAlert = createAsyncThunk(
  "alert/post",
  async ({ id, newAmountReceived }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAlertLoader(true));
      const response = await axiosInstance.post(`/alerts/complete/${id}`, {
        newAmountReceived,
      });
      if (response.status === 200) {
        console.log(response, "response data");
        toast.success(response.data.message || "Payment Updated Successfully.");
        return response.data;
      } else {
        throw new Error(
          response.data.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      console.error("Error in postAlert action:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setAlertLoader(false));
    }
  }
);
