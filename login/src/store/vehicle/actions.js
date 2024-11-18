import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setVehicleLoader, setVehicles } from "./vehicleSlice";
export const postVehicle = createAsyncThunk(
  "vehicle/post",
  async ({ name, number, AutoMan, branch_id }, { dispatch }) => {
    try {
      dispatch(setVehicleLoader(true));
      const response = await axiosInstance.get("/vehicle/add_vehicle", {
        name,
        number,
        AutoMan,
        branch_id,
      });

      if (response.status === 200 && response.data) {
        console.log(response.data, "response data");
        toast.success("Vehicle add successfully");
        //   dispatch(setVehicles(response.data.user));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setVehicleLoader(false));
    }
  }
);
export const fetchVehicles = createAsyncThunk(
  "vehicle/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setVehicleLoader(true));
      const response = await axiosInstance.get("/vehicle/get_vehicles");

      if (response.status === 200 && response.data) {
        console.log(response.data, "response data");
        //   dispatch(setVehicles(response.data.user));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setVehicleLoader(false));
    }
  }
);
