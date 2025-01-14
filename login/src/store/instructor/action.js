import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setInstructorLoader, setInstructors } from "./instructorSlice";
export const postInstructor = createAsyncThunk(
  "instructor/post",
  async ({ formData }, { dispatch }) => {
    try {
      dispatch(setInstructorLoader(true));
      const response = await axiosInstance.post("/instructors/add", {
        ...formData,
      });

      if (response.status) {
        console.log(response.data, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setInstructorLoader(false));
    }
  }
);
export const fetchInstructors = createAsyncThunk(
  "instructor/get",
  async (id, { dispatch }) => {
    try {
      dispatch(setInstructorLoader(true));
      const response = await axiosInstance.get(`/instructors/fetch/${id}`);

      if (response.status) {
        console.log(response.data, "response data");
        dispatch(setInstructors(response.data.instructors));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setInstructorLoader(false));
    }
  }
);

export const fetchAllInstructors = createAsyncThunk(
  "instructor/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setInstructorLoader(true));
      const response = await axiosInstance.get(`/instructors/fetch`);

      if (response.status) {
        console.log(response.data, "response data");
        dispatch(setInstructors(response.data.instructors));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setInstructorLoader(false));
    }
  }
);
export const deleteInstructor = createAsyncThunk(
  "instructor/delete",
  async ({ id }, { dispatch }) => {
    try {
      dispatch(setInstructorLoader(true));
      const response = await axiosInstance.delete(`/instructors/${id}`);

      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setInstructorLoader(false));
    }
  }
);
export const updateInstructorStatus = createAsyncThunk(
  "instructor/update",
  async ({ id, status }, { dispatch }) => {
    try {
      dispatch(setInstructorLoader(true));
      const response = await axiosInstance.put(`/instructors/${id}`, {
        status,
      });
      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setInstructorLoader(false));
    }
  }
);
