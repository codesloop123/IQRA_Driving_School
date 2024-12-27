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
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setCourseLoader(false));
    }
  }
);
// export const fetchBranches = createAsyncThunk(
//   "branch/get",
//   async (_, { dispatch }) => {
//     try {
//       dispatch(setBranchLoader(true));
//       const response = await axiosInstance.get("/branch/branches");

//       if (response.status) {
//         dispatch(setBranches(response.data.branches));
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       dispatch(setBranchLoader(false));
//     }
//   }
// );
// export const deleteBranch = createAsyncThunk(
//   "branch/delete",
//   async ({ id }, { dispatch }) => {
//     try {
//       dispatch(setBranchLoader(true));
//       const response = await axiosInstance.delete(`/branch/${id}`);
//       if (response.status === 200) {
//         toast.success(response.data.message);
//         console.log(response.data, "Response data");
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error(error.message || "Something went wrong");
//       }
//       console.error(error);
//     } finally {
//       dispatch(setBranchLoader(false));
//     }
//   }
// );
