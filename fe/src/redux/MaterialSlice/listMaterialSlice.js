import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  listMaterialAPI,
  updateMaterialAPI,
  deleteMaterialAPI,
  addMaterialAPI,
} from "../../config/baseAPI";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
  DELETE_FAIL_MATERIAL,
  ADD_FAIL_MATERIAL,
} from "../../config/constant";
import axiosInstance from "../../config/customAxios";

const initState = {
  listMaterial: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  totalMaterials: 0,
  statusUpdateMaterial: false,
  isUpdateMaterial: false,
  statusDeleteMaterial: false,
  isDeleteMaterial: false,
  statusAddMaterial: false,
  isAddMaterial: false,
  loading: false,
  message: "",
};

const listMaterialSlice = createSlice({
  name: "listMaterial",
  initialState: initState,
  reducers: {
    setListMaterial: (state, action) => {
      state.listMaterial = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaterial.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllMaterial.fulfilled, (state, action) => {
        state.listMaterial = action.payload.content;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.totalMaterials = action.payload.totalElements;
        state.isUpdateMaterial = false;
        state.isDeleteMaterial = false;
        state.isAddMaterial = false;
        state.message = action.payload.message;
      })
      .addCase(updateMaterial.pending, (state, action) => {
        state.statusUpdateMaterial = true;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.isUpdateMaterial = true;
      })
      .addCase(deleteMaterial.pending, (state, action) => {
        state.statusDeleteMaterial = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.isDeleteMaterial = true;
      })
      .addCase(addMaterial.pending, (state, action) => {
        state.statusAddMaterial = true;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.isAddMaterial = true;
      });
  },
});

export const fetchAllMaterial = createAsyncThunk(
  "listMaterial/fetchAllMaterial",
  async (paramsSearch, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(listMaterialAPI, {
        params: paramsSearch,
      });
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateMaterial = createAsyncThunk(
  "listMaterial/updateMaterial",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.put(
        updateMaterialAPI + data.materialId,
        data
      );
      dispatch(setLoading(false));
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);

export const deleteMaterial = createAsyncThunk(
  "listMaterial/deleteMaterial",
  async (materialId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.delete(deleteMaterialAPI + materialId);
      dispatch(setLoading(false));
      toast.success(DELETE_SUCCESS, toastCss);
      return materialId;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(DELETE_FAIL_MATERIAL, toastCss);
    }
  }
);

export const addMaterial = createAsyncThunk(
  "listMaterial/addMaterial",
  async (values, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const formValue = {
        materialName: values.materialName,
        unit: values.unit,
        amount: values.amount,
        price: values.price,
      };
      const res = await axiosInstance.post(addMaterialAPI, formValue);
      dispatch(setLoading(false));
      toast.success("Thêm vật liệu thành công !!!!!", toastCss);
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      toast.error(ADD_FAIL_MATERIAL, toastCss);
    }
  }
);
export const { setListMaterial, setLoading } = listMaterialSlice.actions;
export default listMaterialSlice.reducer;
