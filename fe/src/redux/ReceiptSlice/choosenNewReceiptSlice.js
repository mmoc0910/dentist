import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { add } from "lodash";
import {
  getNewReceiptByIdAPI,
  addNewReceiptByIdAPI,
} from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from "../../config/constant";

const initState = {
  choosenNewReceipt: {},
  status: false,
  statusNewReceipt: false,
  debit: "",
  oldDebit: 0,
  loading: false,
  newServices: [],
};

const choosenNewReceiptSlice = createSlice({
  name: "choosenNewReceipt",
  initialState: initState,
  reducers: {
    setChoosenNewReceipt: (state, action) => {
      state.choosenNewReceipt = action.payload;
    },
    setLoading: (state, action) => {
        state.loading = action.payload;
      },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewReceipt.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchNewReceipt.fulfilled, (state, action) => {
        state.choosenNewReceipt = action.payload;
        state.debit = action.payload.debit;
        state.oldDebit = action.payload.oldDebit;
        // state.patientId = action.payload.patientId;
        state.newServices = action.payload.newServices;
        state.status = false;
      });
  },
});

export const fetchNewReceipt = createAsyncThunk(
  "receipts/fetchNewReceipt",
  async (treatmentId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getNewReceiptByIdAPI + treatmentId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

// export const addNewReceipt = createAsyncThunk('receipts/addNewReceipt', async (patientId,values) => {
//     try {

//         console.log(values)
//         const res = await axiosInstance.post(addNewReceiptByIdAPI + patientId, values)
//         toast.success("Thêm vật liệu thành công !!!!!", toastCss)
//         console.log(res.data)
//         return res.data
//     } catch (error) {
//         console.log(error)
//         toast.error('Thêm mới thất bại :(', toastCss)
//     }
// })

export const { setChoosenNewReceipt, setLoading } = choosenNewReceiptSlice.actions;
export default choosenNewReceiptSlice.reducer;
