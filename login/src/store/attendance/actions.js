// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "axiosInstance";
// import {
//   setAttendance,
//   setAttendanceHistory,
//   setAttendanceLoader,
//   setAttendanceError,
// } from "./attendanceSlice";
// import { toast } from "react-toastify";

// // Fetch attendance for a specific branch and date
// export const fetchAttendance = createAsyncThunk(
//   "attendance/fetch",
//   async ({ branch, date }, { dispatch }) => {
//     try {
//       dispatch(setAttendanceLoader(true));
//       const response = await axiosInstance.get(`/attendance/${branch}/${date}`);
//       if (response.status === 200) {
//         dispatch(setAttendance(response.data));
//       }
//     } catch (error) {
//       dispatch(setAttendanceError(error.message));
//       toast.error("Failed to fetch attendance.");
//     } finally {
//       dispatch(setAttendanceLoader(false));
//     }
//   }
// );

// // Post or update attendance for a specific branch and date
// export const saveAttendance = createAsyncThunk(
//   "attendance/save",
//   async ({ branch, date, attendance }, { dispatch }) => {
//     try {
//       dispatch(setAttendanceLoader(true));
//       const response = await axiosInstance.post(`/attendance/${branch}`, {
//         date,
//         attendance,
//       });
//       if (response.status === 201) {
//         toast.success("Attendance saved successfully.");
//         dispatch(fetchAttendance({ branch, date })); // Refresh attendance after saving
//       }
//     } catch (error) {
//       dispatch(setAttendanceError(error.message));
//       toast.error("Failed to save attendance.");
//     } finally {
//       dispatch(setAttendanceLoader(false));
//     }
//   }
// );

// // Fetch attendance history for a specific student by reference ID
// export const fetchAttendanceHistory = createAsyncThunk(
//   "attendance/fetchHistory",
//   async ({ branch, referenceId }, { dispatch }) => {
//     try {
//       dispatch(setAttendanceLoader(true));
//       const response = await axiosInstance.get(
//         `/attendance/${branch}/history/${referenceId}`
//       );
//       if (response.status === 200) {
//         dispatch(setAttendanceHistory(response.data));
//       }
//     } catch (error) {
//       dispatch(setAttendanceError(error.message));
//       toast.error("Failed to fetch attendance history.");
//     } finally {
//       dispatch(setAttendanceLoader(false));
//     }
//   }
// );
