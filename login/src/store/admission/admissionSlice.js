import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  admissions: [],
  registerLoading: false,
  finances:[],
  financesByDate:false
};

const admissionSlice = createSlice({
  name: "admission",
  initialState,
  reducers: {
    setRegisterLoader: (state, action) => {
      state.registerLoading = action.payload;
    },
    setAdmissions: (state, action) => {
      state.admissions = action.payload;
    },
    setFinances: (state, action) => {
      state.finances = action.payload;
    },
    setFinancesByDate:(state,action)=>{
      state.financesByDate = action.payload;
    }
  },
});

export const { setRegisterLoader, setAdmissions, setFinances, setFinancesByDate } = admissionSlice.actions;
export default admissionSlice.reducer;
