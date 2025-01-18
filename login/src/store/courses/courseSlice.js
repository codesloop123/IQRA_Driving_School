import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  courses: [],
  iscourseLoading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setCourseLoader: (state, action) => {
      state.iscourseLoading = action.payload;
    },
  },
});

export const { setCourseLoader, setCourses } = courseSlice.actions;
export default courseSlice.reducer;
