import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAttendanceLoading: false,
  students: [],
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendanceLoader: (state, action) => {
      state.isAttendanceLoading = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
  },
});

export const { setAttendanceLoader, setAttendance, setStudents } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
