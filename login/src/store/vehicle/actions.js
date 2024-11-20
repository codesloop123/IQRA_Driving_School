import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { toast } from "react-toastify";
import { setVehicleLoader, setVehicles } from "./vehicleSlice";
export const postVehicle = createAsyncThunk(
  "vehicle/post",
  async ({ formData }, { dispatch }) => {
    try {
      dispatch(setVehicleLoader(true));
      const response = await axiosInstance.post("/vehicle/add_vehicle", {
        ...formData,
      });

      if (response.status) {
        console.log(response.data, "response data");
        toast.success(response.data.message);
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

      if (response.status) {
        console.log(response.data, "response data");
        dispatch(setVehicles(response.data.vehicles));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setVehicleLoader(false));
    }
  }
);
export const deleteVehicle = createAsyncThunk(
  "vehicle/delete",
  async ({ id }, { dispatch }) => {
    try {
      dispatch(setVehicleLoader(true));
      const response = await axiosInstance.delete(`/vehicle/${id}`);

      if (response.status) {
        console.log(response, "response data");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setVehicleLoader(false));
    }
  }
);
