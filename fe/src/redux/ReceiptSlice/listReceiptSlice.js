import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
  ADD_FAIL_RECEIPT,
  ADD_SUCCESS_RECEIPT,
} from "../../config/constant";
import axiosInstance from "../../config/customAxios";
import {
  getListReceiptsByIdAPI,
  addNewReceiptByIdAPI,
} from "../../config/baseAPI";

const initState = {
  listReceipts: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  // statusUpdateSpecimens: false,
  // isUpdateSpecimens: false,
  // statusDeleteSpecimens: false,
  // isDeleteSpecimens: false,
  statusAddNewReceipt: false,
  isAddNewReceipt: false,
  loading: false,
};

const listReceiptsSlice = createSlice({
  name: "listReceipts",
  initialState: initState,
  reducers: {
    setListReceipts: (state, action) => {
      state.listReceipts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReceipts.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllReceipts.fulfilled, (state, action) => {
        state.listReceipts = action.payload;
        // state.isUpdateSpecimens = false;
        // state.isDeleteSpecimens = false;
        state.isAddNewReceipt = false;
      })
      .addCase(addNewReceipt.pending, (state, action) => {
        state.statusAddNewReceipt = true;
      })
      .addCase(addNewReceipt.fulfilled, (state, action) => {
        state.isAddNewReceipt = true;
      });
  },
});

export const fetchAllReceipts = createAsyncThunk(
  "listReceipts/fetchAllReceipts",
  async (treatmentId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getListReceiptsByIdAPI + treatmentId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const addNewReceipt = createAsyncThunk(
  "listReceipts/addNewReceipt",
  async ({ treatmentId, values }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post(
        addNewReceiptByIdAPI + treatmentId,
        values
      );
      dispatch(setLoading(false));
      toast.success(ADD_SUCCESS_RECEIPT, toastCss);
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      toast.error(ADD_FAIL_RECEIPT, toastCss);
    }
  }
);

export const { setListReceipts, setLoading } = listReceiptsSlice.actions;
export default listReceiptsSlice.reducer;
