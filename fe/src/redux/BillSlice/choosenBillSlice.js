import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBillByIdAPI } from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";

const initState = {
  choosenBill: {},
  status: false,
  statusBill: false,
  loading: false,
  patientName: "",
  patientId: "",
  treatmentServiceMapDTOList: [],
};

const choosenBillSlice = createSlice({
  name: "choosenBill",
  initialState: initState,
  reducers: {
    setChoosenBill: (state, action) => {
      state.choosenBill = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBill.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchBill.fulfilled, (state, action) => {
        state.choosenBill = action.payload;
        state.patientName = action.payload.patientName;
        state.patientId = action.payload.patientId;

        state.treatmentServiceMapDTOList =
          action.payload.treatmentServiceMapDTOList;
        state.status = false;
      });
  },
});

export const fetchBill = createAsyncThunk(
  "bills/fetchBill",
  async (treatmentId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getBillByIdAPI + treatmentId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const { setChoosenBill, setLoading } = choosenBillSlice.actions;
export default choosenBillSlice.reducer;
