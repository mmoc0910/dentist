import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/customAxios";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  addPatientAPI,
  listPatientAPI,
  searchPatientAPI,
} from "../../config/baseAPI";

const initState = {
  listPatient: [],
  index: 0,
  pageSize: 13,
  totalPage: 0,
  totalElements: 0,
  // statusUpdatePatient: false,
  // isUpdatePatient: false,
  // statusDeletePatient: false,
  // isDeletePatient: false,
  statusAddPatient: false,
  isAddPatient: false,
  statusSearchPatient: false,
  isSearchPatient: false,
  message: "",
  statusPatient: 0,
  loading: false,
};

const listPatientSlice = createSlice({
  name: "listPatient",
  initialState: initState,
  reducers: {
    setListPatient: (state, action) => {
      state.listPatient = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPatient.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllPatient.fulfilled, (state, action) => {
        state.listPatient = action.payload.content;
        state.statusPatient = action.payload.status;
        // state.pageSize = action.payload.pageSize
        state.status = false;
        state.totalElements = action.payload.totalElements;
        state.totalPage = action.payload.totalPages;
        state.isAddPatient = false;
        state.isDeletePatient = false;
        state.isUpdatePatient = false;
        state.isSearchPatient = false;
      })
      .addCase(addPatient.pending, (state, action) => {
        state.statusAddPatient = true;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.isAddPatient = true;
      })
      // .addCase(deletePatient.pending, (state, action) => {
      //   state.statusDeletePatient = true;
      // })
      // .addCase(deletePatient.fulfilled, (state, action) => {
      //   state.isDeletePatient = true;
      // })
      // .addCase(updatePatient.pending, (state, action) => {
      //   state.statusUpdatePatient = true;
      // })
      // .addCase(updatePatient.fulfilled, (state, action) => {
      //   state.isUpdatePatient = true;
      // })
      .addCase(searchPatient.pending, (state, action) => {
        state.statusSearchPatient = true;
      })
      .addCase(searchPatient.fulfilled, (state, action) => {
        state.listPatient = action.payload.content;
        state.isSearchPatient = true;
        state.totalPage = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.isDeletePatient = false;
        state.isUpdatePatient = false;
        state.isAddPatient = false;
      });
  },
});

export const fetchAllPatient = createAsyncThunk(
  "listPatient/fetchAllPatient",
  async (paramSearch, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.get(listPatientAPI, {
        params: paramSearch,
      });
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const searchPatient = createAsyncThunk(
  "listPatient/searchPatient",
  async (paramSearch, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(searchPatientAPI, {
        params: paramSearch,
      });
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }
);

export const addPatient = createAsyncThunk(
  "listPatient/addPatient",
  async (values, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const formValue = {
        patientName: values.patientName,
        birthdate: values.birthdate,
        gender: values.gender,
        address: values.address,
        phone: values.phone,
        email: values.email,
        bodyPrehistory: values.bodyPrehistory,
        teethPrehistory: values.teethPrehistory,
      };
      const res = await axiosInstance.post(addPatientAPI, formValue);
      toast.success("Thêm mới thành công !!!!!", toastCss);
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Thêm mới thất bại :(", toastCss);
    }
  }
);

export const { setListPatient, setLoading } = listPatientSlice.actions;
export default listPatientSlice.reducer;
