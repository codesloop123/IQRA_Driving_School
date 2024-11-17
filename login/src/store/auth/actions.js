import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { setSignInLoader, setUserCredentials, resetStore } from "./authSlice";
import { toast } from "react-toastify";

//==================SIGN-IN-USER==================
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { dispatch }) => {
    try {
      dispatch(setSignInLoader(true));
      const response = await axiosInstance.post("/auth/login", {
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
