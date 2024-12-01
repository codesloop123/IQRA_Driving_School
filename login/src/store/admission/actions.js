import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setRegisterLoader } from "./admissionSlice";
export const postAdmission = createAsyncThunk(
  "admission/post",
  async ({ formData }, { dispatch }) => {
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.post("/admissions/add", {
        ...formData,
      });
      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
