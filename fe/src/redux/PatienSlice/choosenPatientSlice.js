import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getPatientByIdAPI } from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  DELETE_FAIL,
  DELETE_SUCCESS,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
} from "../../config/constant";
import { updatePatientAPI, deletePatientAPI } from "../../config/baseAPI";

const initState = {
  choosenPatient: {},
  status: 0,
  statusUser: false,
  statusDeletePatient: false,
  patientName: "",
  birthdate: "",
  gender: false,
  address: "",
  phone: "",
  email: "",
  bodyPrehistory: "",
  teethPrehistory: "",
  isDeleted: null,
  isUpdatePatient: false,
  loading: false
};
const choosenPatientSlice = createSlice({
  name: "choosenPatient",
  initialState: initState,
  reducers: {
    setChoosenPatient: (state, action) => {
      state.choosenPatient = action.payload;
    },
    setIsUpdatePatient: (state, { payload }) => {
      state.isUpdatePatient = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatient.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchPatient.fulfilled, (state, { payload }) => {
        state.choosenPatient = payload;
        state.patientName = payload.patientName;
        state.birthdate = payload.birthdate;
        state.gender = payload.gender;
        state.address = payload.address;
        state.phone = payload.phone;
        state.email = payload.email;
        state.bodyPrehistory = payload.bodyPrehistory;
        state.teethPrehistory = payload.teethPrehistory;
        state.status = payload.status;
        state.isDeleted = payload.isDeleted;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isUpdatePatient = true;
      });
  },
});
export const fetchPatient = createAsyncThunk(
  "patients/fetchPatient",
  async (patientId, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(getPatientByIdAPI + patientId);
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);
export const deletePatient = createAsyncThunk(
  "listPatient/deletePatient",
  async (patientId, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      await axiosInstance.delete(deletePatientAPI + patientId);
      dispatch(setLoading(false))
      toast.success(DELETE_SUCCESS, toastCss);
      return true;
    } catch (error) {
      toast.error(DELETE_FAIL, toastCss);
      dispatch(setLoading(false))
      return false;
    }
  }
);

export const updatePatient = createAsyncThunk(
  "listPatient/updatePatient",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.put(
        updatePatientAPI + data.patientId,
        data
      );
      dispatch(setLoading(false))
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);
export const { setChoosenPatient, setIsUpdatePatient, setLoading } = choosenPatientSlice.actions;
export default choosenPatientSlice.reducer;
