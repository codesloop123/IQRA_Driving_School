import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import {
  setAdmissions,
  setRegisterLoader,
  setFinances,
  setFinancesByDate,
} from "./admissionSlice";

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
export const fetchFinances = createAsyncThunk(
  "finances/get",
  async ({ id = "All", toDate = null, fromDate = null }, { dispatch }) => {
    const params = {};
    if (toDate && fromDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    }
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.get(`/admissions/${id}/finances`, {
        params: params,
      });
      if (response.status) {
        if (toDate && fromDate) dispatch(setFinancesByDate(true));
        else dispatch(setFinancesByDate(false));
        dispatch(setFinances(response.data));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
export const updateAdmission = createAsyncThunk(
  "admission/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRegisterLoader(true));

      if (!id) {
        throw new Error("Admission ID is required");
      }

      // Only include fields that have actually changed
      const updateData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== "") {
          updateData[key] = formData[key];
        }
      });

      // Update endpoint to match backend route
      const response = await axiosInstance.put(
        `/admissions/update/${id}`,
        updateData
      );
      
      if (!response || !response.data) {
        throw new Error("Invalid server response");
      }

      if (response.status === 200) {
        toast.success(
          response.data.message || "Admission updated successfully."
        );
        return response.data;
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error in updateAdmission action:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
