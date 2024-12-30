import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import {
  setAttendance,
  setAttendanceLoader,
  setStudents,
} from "./attendanceSlice";
export const fetchAttendees = createAsyncThunk(
  "attendance/get",
  async (branchid, { dispatch }) => {
    try {
      dispatch(setAttendanceLoader(true));
      const response = await axiosInstance.get(
        `/attendance/students/${branchid}`
      );
      if (response.status) {
        dispatch(setStudents(response.data));
        toast.success("Attendance Sheet Fetched Successfully");
      }
    } catch (error) {
      if (error.response?.data?.message)
        toast.error(error.response?.data?.message);
      else toast.error(error.message);
    } finally {
      dispatch(setAttendanceLoader(false));
    }
  }
);

export const fetchAttendance = createAsyncThunk(
  "attendance/get",
  async ({ branchid, date }, { dispatch }) => {
    try {
      dispatch(setAttendanceLoader(true));
      const response = await axiosInstance.get(
        `/attendance/${branchid}/${date}`
      );
      if (response.status === 404) dispatch(setStudents([]));
      else if (response.status) {
        console.log(response);
        dispatch(setStudents(response?.data?.attendance));
        toast.success("Attendance Sheet Fetched Successfully");
      }
    } catch (error) {
      if (error.response?.data?.message)
        toast.error(error.response?.data?.message);
      else toast.error(error.message);
      dispatch(setStudents([]));
    } finally {
      dispatch(setAttendanceLoader(false));
    }
  }
);
export const postAttendance = createAsyncThunk(
  "attendance/post",
  async ({ date, attendance, branch }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAttendanceLoader(true));
      const response = await axiosInstance.post(`/attendance/${branch}`, {
        date,
        attendance,
      });
      if (response.status) {
        toast.success(
          response.data.message || "Admission submitted successfully."
        );
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setAttendanceLoader(false));
    }
  }
);
// export const patchAlert = createAsyncThunk(
//   "alert/patch",
//   async ({ id, newAmountReceived }, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setAlertLoader(true));
//       const response = await axiosInstance.patch(`/alerts/complete/${id}`, {
//         newAmountReceived,
//       });
//       if (response.status === 200) {
//         console.log(response, "response data");
//         toast.success(response.data.message || "Payment Updated Successfully.");
//         return response.data;
//       } else {
//         throw new Error(
//           response.data.message || "An unexpected error occurred."
//         );
//       }
//     } catch (error) {
//       console.error("Error in postAlert action:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "An unexpected error occurred. Please try again.";

//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     } finally {
//       dispatch(setAlertLoader(false));
//     }
//   }
// );
