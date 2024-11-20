import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import {
  setSignInLoader,
  setUserCredentials,
  resetStore,
  setRegisterLoader,
  setFetchUserLoader,
  setUsers,
} from "./authSlice";
import { toast } from "react-toastify";

//==================SIGN-IN-USER==================
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { dispatch }) => {
    try {
      dispatch(setSignInLoader(true));
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data) {
        toast.success("Login successfull");
        console.log(response.data.user, "response data");
        dispatch(setUserCredentials(response.data.user));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setSignInLoader(false));
    }
  }
);

//==================SIGN-OUT-USER=====================
export const signOutUser = (history) => async (dispatch) => {
  try {
    localStorage.clear();
    dispatch(resetStore());
    history.push("/login");
  } catch (error) {
    console.error(error.message);
  }
};
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ formData }, { dispatch }) => {
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.post("/user/add_User", {
        ...formData,
      });

      if (response.status) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
export const fetchUsers = createAsyncThunk(
  "auth/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setFetchUserLoader(true));
      const role = "manager";
      const response = await axiosInstance.post("/user/managers", {
        role,
      });

      if (response.status) {
        dispatch(setUsers(response.data.users));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setFetchUserLoader(false));
    }
  }
);
