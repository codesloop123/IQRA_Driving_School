import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setAdmissions, setRegisterLoader } from "./admissionSlice";


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
export const fetchAdmissions = createAsyncThunk(
  "branch/get",
  async (id, { dispatch }) => {
    console.log("inside fetch>>>>>>>");
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.get(`/admissions/${id}`);

      if (response.status) {
        dispatch(setAdmissions(response.data.admissions));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
