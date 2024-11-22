import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  instructors: [],
  isInstructorLoading: false,
};

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    setInstructors: (state, action) => {
      state.instructors = action.payload;
    },
    setInstructorLoader: (state, action) => {
      state.isInstructorLoading = action.payload;
    },
  },
});

export const { setInstructorLoader, setInstructors } = instructorSlice.actions;
export default instructorSlice.reducer;
