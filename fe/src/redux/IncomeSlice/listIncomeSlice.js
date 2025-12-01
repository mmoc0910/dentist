import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  listIncomeAPI,
  listNetIncomeAPI,
  listTotalSpendIncomeAPI,
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
  listIncome: [],
  listNetIncome: [],
  listTotalSpendIncome: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  totalIncome: 0,
  totalNetIncome: 0,
  totalSpendIncome: 0,

  message: "",
};

const listIncomeSlice = createSlice({
  name: "listIncome",
  initialState: initState,
  reducers: {
    setListIncome: (state, action) => {
      state.listIncome = action.payload;
    },
    // setListNetIncome: (state, action) => {
    //     state.listNetIncome = action.payload
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIncome.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllIncome.fulfilled, (state, action) => {
        state.listIncome = action.payload.incomeDetailDTOS;
        state.totalIncome = action.payload.totalIncome;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.message = action.payload.message;
      })
      .addCase(fetchAllNetIncome.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllNetIncome.fulfilled, (state, action) => {
        state.listNetIncome = action.payload.incomeDetailDTOS;
        state.totalNetIncome = action.payload.totalIncome;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.message = action.payload.message;
      })
      .addCase(fetchAllTotalSpendIncome.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllTotalSpendIncome.fulfilled, (state, action) => {
        state.listTotalSpendIncome = action.payload.incomeDetailDTOS;
        state.totalSpendIncome = action.payload.totalIncome;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.message = action.payload.message;
      });
  },
});

export const fetchAllIncome = createAsyncThunk(
  "listIncome/fetchAllIncome",
  async (paramsSearch) => {
    try {
      const res = await axiosInstance.get(listIncomeAPI, {
        params: paramsSearch,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchAllNetIncome = createAsyncThunk(
  "listIncome/fetchAllNetIncome",
  async (paramsSearch) => {
    try {
      const res = await axiosInstance.get(listNetIncomeAPI, {
        params: paramsSearch,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchAllTotalSpendIncome = createAsyncThunk(
  "listIncome/fetchAllTotalSpendIncome",
  async (paramsSearch) => {
    try {
      const res = await axiosInstance.get(listTotalSpendIncomeAPI, {
        params: paramsSearch,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const { setListIncome } = listIncomeSlice.actions;

// export const { setListNetIncome } = listIncomeSlice.actions;
export default listIncomeSlice.reducer;
