// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   attendance: [], // Stores attendance data keyed by date or student
//   attendanceHistory: [], // Stores history for a specific student
//   isAttendanceLoading: false, // Loader for attendance actions
//   error: null, // Error state for handling errors
// };

// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState,
//   reducers: {
//     setAttendance: (state, action) => {
//       state.attendance = action.payload;
//     },
//     setAttendanceHistory: (state, action) => {
//       state.attendanceHistory = action.payload;
//     },
//     setAttendanceLoader: (state, action) => {
//       state.isAttendanceLoading = action.payload;
//     },
//     setAttendanceError: (state, action) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const {
//   setAttendance,
//   setAttendanceHistory,
//   setAttendanceLoader,
//   setAttendanceError,
// } = attendanceSlice.actions;

// export default attendanceSlice.reducer;
