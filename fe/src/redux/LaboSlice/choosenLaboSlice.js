import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getLaboByIdAPI,
  getListPrepareByIdAPI,
  getListReceiveByIdAPI,
  updatePrepareAPI,
  updateReceiveAPI,
} from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";
import { toast } from "react-toastify";

const initState = {
  choosenLabo: {},
  status: false,
  statusLabo: false,
  statusDeleteLabo: false,
  laboName: "",
  phone: "",
  totalMoney: "",
  specimensDTOS: [],
  prepareSample: [],
  receiveSamples: [],
  isUpdatePrepareSample: false,
  isUpdateReceiveSample: false,
  isDeleteSpecimens: false,
  loading: false,
};
const choosenLaboSlice = createSlice({
  name: "choosenLabo",
  initialState: initState,
  reducers: {
    setChoosenLabo: (state, action) => {
      state.choosenLabo = action.payload;
    },
    setLaboName: (state, action) => {
      state.laboName = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setTotalMoney: (state, action) => {
      state.totalMoney = action.payload;
    },
    setIsDeleteSpecimens: (state, action) => {
      state.isDeleteSpecimens = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabo.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchPrepareSample.pending, (state, action) => {
        state.status = true;
      })
      .addCase(updatePrepareSample.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchListReceive.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchLabo.fulfilled, (state, action) => {
        state.choosenLabo = action.payload;
        state.laboName = action.payload.laboName;
        state.phone = action.payload.phone;
        state.totalMoney = action.payload.totalMoney;
        state.specimensDTOS = action.payload.specimensDTOS;
        state.isDeleteSpecimens = false;
      })
      .addCase(fetchPrepareSample.fulfilled, (state, action) => {
        state.isUpdatePrepareSample = false;
        state.prepareSample = action.payload;
      })
      .addCase(updatePrepareSample.fulfilled, (state, action) => {
        state.isUpdatePrepareSample = true;
      })
      .addCase(updateReceiveSample.fulfilled, (state, action) => {
        state.isUpdateReceiveSample = true;
      })
      .addCase(fetchListReceive.fulfilled, (state, action) => {
        state.isUpdateReceiveSample = false;
        state.receiveSamples = action.payload;
      });
  },
});

export const fetchLabo = createAsyncThunk(
  "labos/fetchLabo",
  async (laboId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getLaboByIdAPI + laboId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const fetchPrepareSample = createAsyncThunk(
  "labos/fetchPrepareSample",
  async (laboId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getListPrepareByIdAPI + laboId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const fetchListReceive = createAsyncThunk(
  "labos/fetchListReceive",
  async (laboId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(getListReceiveByIdAPI + laboId);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const updatePrepareSample = createAsyncThunk(
  "labos/updatePrepareSample",
  async (payload, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.put(updatePrepareAPI, payload);
      dispatch(setLoading(false));

      toast.success("Gửi mẫu vật thành công!");
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Gửi mẫu vật thất bại!");
      console.log(error);
    }
  }
);

export const updateReceiveSample = createAsyncThunk(
  "labos/updateReceiveSample",
  async (payload, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.put(updateReceiveAPI, payload);
      dispatch(setLoading(false));
      toast.success("Nhận mẫu vật thành công");
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Nhận mẫu vật thất bại!");
      console.log(error);
    }
  }
);

export const {
  setChoosenLabo,
  setLaboName,
  setPhone,
  setTotalMoney,
  setMessage,
  setIsDeleteSpecimens,
  setLoading
} = choosenLaboSlice.actions;

export default choosenLaboSlice.reducer;
