import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setRegisterLoader } from "./admissionSlice";
export const postAdmission = createAsyncThunk(
  "admission/post",
  async ({ formData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.post("/admissions/add", {
        ...formData, 
      });
      if (response.status === 200) {
        console.log(response, "response data");
        toast.success(
          response.data.message || "Admission submitted successfully."
        );
        return response.data;
      } else {
        throw new Error(
          response.data.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      console.error("Error in postAdmission action:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
