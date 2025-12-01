import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listAllCategoryAPI,
  addCategoryAPI,
  deleteServiceAPI,
  addServiceAPI,
  updateServiceAPI,
  updateCategoryBySelectIdAPI,
  listServiceByCategoryIdAPI,
  deleteCategoryBySelectIdAPI,
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
  listCategory: [],
  listServiceByCategory: [],
  pagination: [],
  status: false,
  index: 0,
  pageSize: 3,
  totalPage: 0,
  statusUpdateCategory: false,
  isUpdateCategory: false,
  statusDeleteCategory: false,
  isDeleteCategory: false,
  statusAddCategory: false,
  isAddCategory: false,

  statusAddService: false,
  isAddService: false,
  statusDeleteService: false,
  isDeleteService: false,
  statusUpdateService: false,
  isUpdateService: false,
  listServiceDTO: [],
  message: "",
  id: 0,
  loading: false
};

const listCategorySlice = createSlice({
  name: "listCategory",
  initialState: initState,
  reducers: {
    setListCategory: (state, action) => {
      state.listCategory = action.payload;
    },
    setIsAddCategory: (state, action) => {
      state.isAddCategory = action.payload;
    },
    setIsUpdateCategory: (state, action) => {
      state.isUpdateCategory = action.payload;
    },
    setIsDeleteCategory: (state, action) => {
      state.isDeleteCategory = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.listCategory = action.payload;
        state.id = action.payload.categoryServiceId;
        state.status = false;
        state.pageNumber = action.payload.pageNumber;
        state.totalPage = action.payload.totalPages;
        state.isUpdateCategory = false;
        state.isDeleteCategory = false;
        state.message = action.payload.message;
      })
      .addCase(fetchAllServiceByCategory.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAllServiceByCategory.fulfilled, (state, action) => {
        state.listServiceByCategory = action.payload;
        state.isDeleteService = false;
        state.isAddService = false;
        state.isUpdateService = false;
      })

      .addCase(updateCategory.pending, (state, action) => {
        state.statusUpdateCategory = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdateCategory = true;
      })
      .addCase(updateService.pending, (state, action) => {
        state.statusUpdateService = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isUpdateService = true;
      })
      .addCase(deleteService.pending, (state, action) => {
        state.statusDeleteService = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isDeleteService = true;
      })
      .addCase(addCategory.pending, (state, action) => {
        state.statusAddCategory = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isAddCategory = true;
      })
      .addCase(addService.pending, (state, action) => {
        state.statusAddService = true;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.isAddService = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeleteCategory = true;
      });
  },
});

export const fetchAllCategory = createAsyncThunk(
  "listCategory/fetchAllCategory",
  async (paramsSearch, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(listAllCategoryAPI, {
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
export const fetchAllServiceByCategory = createAsyncThunk(
  "listCategory/fetchAllServiceByCategory",
  async (categoryServiceId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.get(
        listServiceByCategoryIdAPI + categoryServiceId
      );
      dispatch(setLoading(false))
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "listCategory/updateCategory",
  async (data, {dispatch}) => {
    // console.log(data.userId)
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.put(
        updateCategoryBySelectIdAPI + data.categoryServiceId,
        data
      );
      dispatch(setLoading(false))
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "listCategory/deleteCategory",
  async (categoryServiceId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.delete(
        deleteCategoryBySelectIdAPI + categoryServiceId
      );
      dispatch(setLoading(false))
      toast.success("Xóa thành công", toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      toast.error("Không thể loại dịch vì khi đã có dịch vụ", toastCss);
    }
  }
);

export const updateService = createAsyncThunk(
  "listCategory/updateService",
  async (data, {dispatch}) => {
    // console.log(data.userId)
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.put(
        updateServiceAPI + data.serviceId,
        data
      );
      dispatch(setLoading(false))
      toast.success(UPDATE_SUCCESS, toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
      toast.error(UPDATE_FAIL, toastCss);
    }
  }
);

export const deleteService = createAsyncThunk(
  "listCategory/deleteService",
  async (serviceId, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.delete(deleteServiceAPI + serviceId);
      dispatch(setLoading(false))
      toast.success("Xóa dịch vụ thành công", toastCss);
      return serviceId;
    } catch (error) {
      dispatch(setLoading(false))
      toast.error("Xóa dịch vụ không thành công", toastCss);
    }
  }
);

export const addCategory = createAsyncThunk(
  "listCategory/addCategory",
  async (values, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.post(addCategoryAPI, values);
      dispatch(setLoading(false))
      toast.success("Thêm loại dịch vụ thành công !!!!!", toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
      toast.error("Thêm mới thất bại :(", toastCss);
    }
  }
);

export const addService = createAsyncThunk(
  "listService/addService",
  async (values, {dispatch}) => {
    try {
      dispatch(setLoading(true))
      const res = await axiosInstance.post(addServiceAPI, values);
      dispatch(setLoading(false))
      toast.success("Thêm dịch vụ thành công !!!!!", toastCss);
      return res.data;
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error);
      toast.error("Dịch vụ đã tồn tại", toastCss);
    }
  }
);
export const { setListCategory, setIsAddCategory, setIsUpdateCategory, setIsDeleteCategory, setLoading } =
  listCategorySlice.actions;
export default listCategorySlice.reducer;
