import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import {
  addSpecimensAPI,
  useSpecimenAPI,
  listSpecimenAPI,
  searchSpecimenAPI,
  updateSpecimensAPI,
  deleteSpecimensAPI,
  reportSpecimenAPI,
  patientSpecimenAPI,
} from "../../config/baseAPI";
import {
  UPDATE_FAIL,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from "../../config/constant";
import axiosInstance from "../../config/customAxios";
import { toastCss } from "../toastCss";

const initState = {
  listSpecimen: [],
  listPatientSpecimens: [],
  index: 0,
  pageSize: 3,
  totalPage: 0,
  totalElements: 0,
  statusUpdateSpecimen: false,
  isUpdateSpecimen: false,
  statusDeleteSpecimen: false,
  isDeleteSpecimen: false,
  statusAddSpecimen: false,
  isAddSpecimen: false,
  statusSearchSpecimen: false,
  isSearchSpecimen: false,
  statusUseSpecimen: false,
  statusFetchPatientSpecimen: false,
  isUseSpecimen: false,
  message: "",
  loading: false,
  statusSpecimen: 0,
};

const listSpecimenSlice = createSlice({
  name: "listSpecimen",
  initialState: initState,
  reducers: {
    setListSpecimen: (state, action) => {
      state.listSpecimen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpecimen.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllSpecimen.fulfilled, (state, action) => {
        state.listSpecimen = action.payload.content;
        state.statusSpecimen = action.payload.status;
        // state.pageSize = action.payload.pageSize
        state.status = false;
        state.totalElements = action.payload.totalElements;
        state.totalPage = action.payload.totalPages;
        state.isAddSpecimen = false;
        state.isDeleteSpecimen = false;
        state.isUpdateSpecimen = false;
        state.isSearchSpecimen = false;
      })
      .addCase(addSpecimen.pending, (state, action) => {
        state.statusAddSpecimen = true;
      })
      .addCase(addSpecimen.fulfilled, (state, action) => {
        state.isAddSpecimen = true;
      })
      .addCase(deleteSpecimen.pending, (state, action) => {
        state.statusDeleteSpecimen = true;
      })
      .addCase(deleteSpecimen.fulfilled, (state, action) => {
        state.isDeleteSpecimen = true;
      })
      .addCase(updateSpecimen.pending, (state, action) => {
        state.statusUpdateSpecimen = true;
      })
      .addCase(updateSpecimen.fulfilled, (state, action) => {
        state.isUpdateSpecimen = true;
      })
      .addCase(reportSpecimen.pending, (state, action) => {
        state.statusUpdateSpecimen = true;
      })
      .addCase(reportSpecimen.fulfilled, (state, action) => {
        state.isUpdateSpecimen = true;
      })
      .addCase(confirmUsedSpecimen.pending, (state, action) => {
        state.statusUseSpecimen = true;
      })
      .addCase(confirmUsedSpecimen.fulfilled, (state, action) => {
        state.isUseSpecimen = true;
      })
      .addCase(searchSpecimen.pending, (state, action) => {
        state.statusSearchSpecimen = true;
      })
      .addCase(fetchPatientSpecimen.pending, (state, action) => {
        state.statusFetchPatientSpecimen = true;
      })
      .addCase(fetchPatientSpecimen.fulfilled, (state, action) => {
        state.listPatientSpecimens = action.payload;
      })
      .addCase(searchSpecimen.fulfilled, (state, action) => {
        state.listSpecimen = action.payload.content;
        state.isSearchSpecimen = true;
        state.totalPage = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.isDeleteSpecimen = false;
        state.isUpdateSpecimen = false;
        state.isAddSpecimen = false;
      });
  },
});

export const fetchAllSpecimen = createAsyncThunk(
  "listSpecimen/fetchAllSpecimen",
  async (paramSearch, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(listSpecimenAPI, {
        params: paramSearch,
      });
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);
export const fetchPatientSpecimen = createAsyncThunk(
  "listSpecimen/fetchPatientSpecimen",
  async (patientId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(patientSpecimenAPI + patientId);
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);

// export const searchSpecimen = createAsyncThunk('listSpecimen/searchSpecimen', async (paramSearch) => {
//     try {
//         // const formValue = {
//         //     name: values.SpecimenName,
//         //     birthdate: values.birthdate,
//         //     gender: values.gender,
//         //     address: values.address,
//         //     phone: values.phone,
//         //     email: values.email,
//         // }
//         const res = await axiosInstance.get(searchSpecimenAPI, {
//             params: paramSearch
//         })
//         console.log(res)
//         return res.data
//     } catch (error) {
//         console.log(error)
//     }
// })
export const searchSpecimen = createAsyncThunk(
  "listSpecimen/searchSpecimen",
  async (paramSearch, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(searchSpecimenAPI, {
        params: paramSearch,
      });
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);

export const updateSpecimen = createAsyncThunk(
  "listSpecimen/updateSpecimen",
  async (data, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.put(
        updateSpecimensAPI + data.specimenId,
        data
      );
      dispatch(setLoading(false))
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false))
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);

export const deleteSpecimen = createAsyncThunk(
  "listSpecimen/deleteSpecimen",
  async (specimenId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
       await axiosInstance.delete(deleteSpecimensAPI + specimenId);
      dispatch(setLoading(false))
      toast.success(DELETE_SUCCESS, toastCss);
      return specimenId;
    } catch (error) {
      dispatch(setLoading(false))
      toast.error(DELETE_FAIL, toastCss);
    }
  }
);

export const addSpecimen = createAsyncThunk(
  "listSpecimen/addSpecimen",
  async (values, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.post(addSpecimensAPI, values);
      toast.success("Thêm thành công !!!!!", toastCss);
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false))
      toast.error("Thêm thất bại :(", toastCss);
    }
  }
);

export const reportSpecimen = createAsyncThunk(
  "listSpecimen/reportSpecimen",
  async (specimenId, values) => {
    try {
      const res = await axiosInstance.post(
        reportSpecimenAPI + specimenId,
        values
      );
      toast.success("Báo cáo thành công !!!!!", toastCss);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("Báo cáo thất bại :(", toastCss);
    }
  }
);

export const confirmUsedSpecimen = createAsyncThunk(
  "listSpecimen/confirmUsedSpecimen",
  async (specimenId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      axiosInstance.post(useSpecimenAPI + specimenId).then(() => {
      dispatch(setLoading(false))
        toast.success("Cập nhật sử dụng mẫu vật thành công");
      });
    } catch (error) {
      dispatch(setLoading(false))
      toast.error("Cập nhật sử dụng mẫu vật không thành công");
    }
  }
);

export const { setListSpecimen, setLoading } = listSpecimenSlice.actions;
export default listSpecimenSlice.reducer;
