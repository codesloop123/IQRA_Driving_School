import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setBranches, setBranchLoader } from "./branchSlice";

export const postBranch = createAsyncThunk(
  "branch/post",
  async ({ name }, { dispatch }) => {
    try {
      dispatch(setBranchLoader(true));
      const response = await axiosInstance.post("/branch/add_branch", {
        name,
      });

      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setBranchLoader(false));
    }
  }
);
export const fetchBranches = createAsyncThunk(
  "branch/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setBranchLoader(true));
      const response = await axiosInstance.get("/branch/branches");

      if (response.status) {
        dispatch(setBranches(response.data.branches));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setBranchLoader(false));
    }
  }
);
