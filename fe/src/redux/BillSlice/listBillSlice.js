import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listBillAPI } from "../../config/baseAPI";
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
  listBill: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 0,
  totalPage: 0,
  totalElements: 0,
  statusUpdateBill: false,
  isUpdateBill: false,
  message: "",
  loading: false,
};

const listBillSlice = createSlice({
  name: "listBill",
  initialState: initState,
  reducers: {
    setListBill: (state, action) => {
      state.listBill = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBill.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllBill.fulfilled, (state, action) => {
        state.listBill = action.payload.content;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.size;
        state.totalPage = action.payload.totalPages;
        state.message = action.payload.message;
        state.totalElements = action.payload.totalElements;
      });
  },
});
export const fetchAllBill = createAsyncThunk(
  "listBill/fetchAllBill",
  async (paramsSearch, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(listBillAPI, {
        params: paramsSearch,
      });
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const { setListBill, setLoading } = listBillSlice.actions;
export default listBillSlice.reducer;
