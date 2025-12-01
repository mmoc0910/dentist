import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getListScheduleAPI,
  addScheduleAPI,
  updateScheduleAPI,
} from "../../config/baseAPI";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from "../../config/constant";
import axiosInstance from "../../config/customAxios";

const initState = {
  listSchedule: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  statusUpdateSchedule: false,
  isUpdateSchedule: false,
  statusAddSchedule: false,
  isAddSchedule: false,
  message: "",
  loading: false,
};

const listScheduleSlice = createSlice({
  name: "listSchedule",
  initialState: initState,
  reducers: {
    setListSchedule: (state, action) => {
      state.listSchedule = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSchedule.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllSchedule.fulfilled, (state, action) => {
        state.listSchedule = action.payload.content;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.isUpdateSchedule = false;
        state.message = action.payload.message;
      })
      .addCase(updateSchedule.pending, (state, action) => {
        state.statusUpdateSchedule = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.isUpdateSchedule = true;
      })
      .addCase(addSchedule.pending, (state, action) => {
        state.statusAddSchedule = true;
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        state.isAddSchedule = true;
      });
  },
});

export const fetchAllSchedule = createAsyncThunk(
  "listSchedule/fetchAllSchedule",
  async (paramsSearch, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(getListScheduleAPI, {
        params: paramsSearch,
      });
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addSchedule = createAsyncThunk(
  "listSchedule/addSchedule",
  async (values, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post(addScheduleAPI, values);
      dispatch(setLoading(false));
      toast.success("Đặt lịch thành công!", toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Đã có lịch ngày " + values.date, toastCss);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "listSchedule/updateSchedule",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.put(
        updateScheduleAPI + data.waitingRoomId,
        data
      );
      dispatch(setLoading(false));
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);

export const { setListSchedule, setLoading } = listScheduleSlice.actions;
export default listScheduleSlice.reducer;
