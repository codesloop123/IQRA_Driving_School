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

      if (response.status) {
        toast.success(response.data.message);
        console.log(response.data.user, "response data");
        dispatch(setUserCredentials(response.data.user));
      }
    } catch (error) {
      // Check if response exists
      if (error.response) {
        // API responded with a status other than 2xx
        const errorMessage =
          error.response.data?.msg ||
          error.response.data?.message ||
          "Something went wrong!";
        toast.error(errorMessage);
        console.error("API Error:", error.response.data);
      } else if (error.request) {
        // No response received from the server
        toast.error("No response from the server. Please try again later.");
        console.error("Request Error:", error.request);
      } else {
        // Some other error occurred while setting up the request
        toast.error(error.message || "An unexpected error occurred.");
        console.error("Unexpected Error:", error.message);
      }
    } finally {
      dispatch(setSignInLoader(false));
    }
  }
);

export const changeManagerPassword = createAsyncThunk(
  "auth/changePassword",
  async ({ id, newPassword }, { dispatch }) => {
    try {
      dispatch(setRegisterLoader(true)); // reuse existing loader
      const response = await axiosInstance.put(`/user/${id}/password`, {
        password: newPassword,
      });

      if (response.status) {
        toast.success(response.data.message || "Password updated successfully.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update password"
      );
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);

//==================SIGN-OUT-USER=====================
export const signOutUser = (history) => async (dispatch) => {
  try {
    localStorage.setItem("notifications", JSON.stringify([]));
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

export const deleteManager = createAsyncThunk(
  "auth/delete",
  async ({ id }, { dispatch }) => {
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.delete(`/user/${id}`);

      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
export const updateManagerStatus = createAsyncThunk(
  "auth/update",
  async ({ id, status }, { dispatch }) => {
    try {
      dispatch(setRegisterLoader(true));
      const response = await axiosInstance.put(`/user/${id}`, {
        status,
      });
      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setRegisterLoader(false));
    }
  }
);
