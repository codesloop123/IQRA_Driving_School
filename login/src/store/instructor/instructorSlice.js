import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  instructors: [],
  isInstructorLoading: false,
  slots: [],
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
    setSlots: (state, action) => {
      state.slots = action.payload;
    },
  },
});

export const { setInstructorLoader, setInstructors, setSlots } =
  instructorSlice.actions;
export default instructorSlice.reducer;
