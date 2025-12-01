import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  listMaterialExportAPI,
  updateMaterialExportAPI,
  addMaterialExportAPI,
  deleteMaterialExportAPI,
  patientMaterialExportAPI,
} from "../../config/baseAPI";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
  DELETE_FAIL_EXPORT_MATERIAL,
  UPDATE_FAIL_EXPORT_MATERIAL,
} from "../../config/constant";
import axiosInstance from "../../config/customAxios";

const initState = {
  listMaterialExport: [],
  listPatientMaterialExport: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  totalExportMaterial: 0,
  statusPatientMaterialExport: false,
  statusUpdateMaterialExport: false,
  isUpdateMaterialExport: false,
  statusDeleteMaterialExport: false,
  isDeleteMaterialExport: false,
  statusAddMaterialExport: false,
  isAddMaterialExport: false,
  message: "",
  loading: false
};

const listMaterialExportSlice = createSlice({
  name: "listMaterialExport",
  initialState: initState,
  reducers: {
    setListMaterialExport: (state, action) => {
      state.listMaterialExport = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaterialExport.pending, (state, action) => {
        state.status = true;
      })

      .addCase(fetchAllMaterialExport.fulfilled, (state, action) => {
        state.listMaterialExport = action.payload.content;
        state.status = false;
        state.totalExportMaterial = action.payload.totalElements;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.isUpdateMaterialExport = false;
        state.isDeleteMaterialExport = false;
        state.isAddMaterialExport = false;
        state.message = action.payload.message;
      })
      .addCase(fetchPatientMaterialExport.pending, (state, action) => {
        state.statusPatientMaterialExport = true;
      })
      .addCase(fetchPatientMaterialExport.fulfilled, (state, action) => {
        state.listPatientMaterialExport = action.payload;
      })
      .addCase(updateMaterialExport.pending, (state, action) => {
        state.statusUpdateMaterialExport = true;
      })
      .addCase(updateMaterialExport.fulfilled, (state, action) => {
        state.isUpdateMaterialExport = true;
      })
      .addCase(deleteMaterialExport.pending, (state, action) => {
        state.statusDeleteMaterialExport = true;
      })
      .addCase(deleteMaterialExport.fulfilled, (state, action) => {
        state.isDeleteMaterialExport = true;
      })
      .addCase(addMaterialExport.pending, (state, action) => {
        state.statusAddMaterialExport = true;
      })
      .addCase(addMaterialExport.fulfilled, (state, action) => {
        state.isAddMaterialExport = true;
      });
  },
});

export const fetchAllMaterialExport = createAsyncThunk(
  "listMaterialExport/fetchAllMaterialExport",
  async (paramsSearch, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(listMaterialExportAPI, {
        params: paramsSearch,
      });
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);

export const fetchPatientMaterialExport = createAsyncThunk(
  "listMaterialExport/fetchPatientMaterialExport",
  async (patientId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(patientMaterialExportAPI + patientId);
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);

export const updateMaterialExport = createAsyncThunk(
  "listMaterialExport/updateMaterialExport",
  async (data, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.put(
        updateMaterialExportAPI + data.materialExportId,
        data
      );
      dispatch(setLoading(false))
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
      toast.error(UPDATE_FAIL_EXPORT_MATERIAL, toastCss);
    }
  }
);

export const deleteMaterialExport = createAsyncThunk(
  "listMaterialExport/deleteMaterialExport",
  async (materialExportId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.delete(
        deleteMaterialExportAPI + materialExportId
      );
      dispatch(setLoading(false))
      toast.success(DELETE_SUCCESS, toastCss);
      return materialExportId;
    } catch (error) {
      dispatch(setLoading(false))
      toast.error(DELETE_FAIL_EXPORT_MATERIAL, toastCss);
    }
  }
);

export const addMaterialExport = createAsyncThunk(
  "listMaterialExport/addMaterialExport",
  async (values, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.post(addMaterialExportAPI, values);
      dispatch(setLoading(false))
      toast.success("Thêm vật liệu thành công !!!!!", toastCss);
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false))
      toast.error("Thêm mới thất bại :(", toastCss);
    }
  }
);
export const { setListMaterialExport, setLoading } = listMaterialExportSlice.actions;
export default listMaterialExportSlice.reducer;
