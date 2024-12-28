import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setCourses, setCourseLoader } from "./courseSlice";

export const postCourse = createAsyncThunk(
  "course/post",
  async ({ name, duration, vehicle, pricelist }, { dispatch }) => {
    console.log(name, duration, vehicle, pricelist);
    try {
      dispatch(setCourseLoader(true));
      const response = await axiosInstance.post("/courses/add", {
        name,
        duration,
        vehicle,
        pricelist,
      });

      if (response.status) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message)
        toast.error(error?.response?.data?.message);
      else toast.error(error.message);
    } finally {
      dispatch(setCourseLoader(false));
    }
  }
);
export const fetchCourses = createAsyncThunk(
  "course/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setCourseLoader(true));
      const response = await axiosInstance.get("/courses/fetch");

      if (response.status) {
        dispatch(setCourses(response?.data?.courses));
      }
    } catch (error) {
      if (error?.response?.data?.message)
        toast.error(error?.response?.data?.message);
      else toast.error(error.message);
    } finally {
      dispatch(setCourseLoader(false));
    }
  }
);
export const deleteCourse = createAsyncThunk(
  "course/delete",
  async (id, { dispatch }) => {
    try {
      dispatch(setCourseLoader(true));
      const response = await axiosInstance.delete(`/courses/delete/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Something went wrong");
      }
      console.error(error);
    } finally {
      dispatch(setCourseLoader(false));
    }
  }
);
export const updateCourseStatus = createAsyncThunk(
  "course/update",
  async ({ id, status }, { dispatch }) => {
    console.log(id, status);
    try {
      dispatch(setCourseLoader(true));
      const response = await axiosInstance.put(`/courses/update/${id}`, {
        status,
      });
      if (response.status) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      dispatch(setCourseLoader(false));
    }
  }
);
