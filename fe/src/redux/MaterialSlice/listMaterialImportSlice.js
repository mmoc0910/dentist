import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { listMaterialImportAPI, updateMaterialImportAPI, deleteMaterialImportAPI, addListMaterialImportAPI } from "../../config/baseAPI"
import { toast } from "react-toastify"
import { toastCss } from "../toastCss"
import { UPDATE_SUCCESS, UPDATE_FAIL, DELETE_SUCCESS, DELETE_FAIL, UPDATE_FAIL_IMPORT_MATERIAL, DELETE_FAIL_IMPORT_MATERIAL } from "../../config/constant"
import axiosInstance from "../../config/customAxios"

const initState = {
    listMaterialImport: [],
    pagination: [],
    status: false,
    index: 0,
    pageSize: 3,
    totalPage: 0,
    totalImportMaterial: 0,
    statusUpdateMaterialImport: false,
    isUpdateMaterialImport: false,
    statusDeleteMaterialImport: false,
    isDeleteMaterialImport: false,
    statusAddMaterialImport: false,
    isAddMaterialImport: false,
    loading: false,
    message: ''
}

const listMaterialImportSlice = createSlice({
    name: 'listMaterialImport',
    initialState: initState,
    reducers: {
        setListMaterialImport: (state, action) => {
            state.listMaterialImport = action.payload
        },
        setIsAddMaterialImport: (state, action) => {
            state.isAddMaterialImport = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMaterialImport.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchAllMaterialImport.fulfilled, (state, action) => {
                state.listMaterialImport = action.payload.content;
                state.status = false;
                state.pageNumber = action.payload.pageNumber;
                state.totalPage = action.payload.totalPages;
                state.isUpdateMaterialImport = false;
                state.isDeleteMaterialImport = false;
                state.isAddMaterialImport = false;
                state.message = action.payload.message
                state.totalImportMaterial = action.payload.totalElements
            })
            .addCase(updateMaterialImport.pending, (state, action) => {
                state.statusUpdateMaterialImport = true
            })
            .addCase(updateMaterialImport.fulfilled, (state, action) => {
                state.isUpdateMaterialImport = true
            })
            .addCase(deleteMaterialImport.pending, (state, action) => {
                state.statusDeleteMaterialImport = true
            })
            .addCase(deleteMaterialImport.fulfilled, (state, action) => {
                state.isDeleteMaterialImport = true
            })
            .addCase(addMaterialImport.pending, (state, action) => {
                state.statusAddMaterialImport = true
            })
            .addCase(addMaterialImport.fulfilled, (state, action) => {
                state.isAddMaterialImport = true
            })
    }
})

export const fetchAllMaterialImport = createAsyncThunk('listMaterialImport/fetchAllMaterialImport', async (paramsSearch, {dispatch}) => {
    try {
        dispatch(setLoading(true))
        const res = await axiosInstance.get(listMaterialImportAPI, {
            params: paramsSearch,
        })
        dispatch(setLoading(false))
        return res.data
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error)
    }
})

export const updateMaterialImport = createAsyncThunk('listMaterialImport/updateMaterialImport', async (data, {dispatch}) => {

    try {
        dispatch(setLoading(true))
        const res = await axiosInstance.put(
            updateMaterialImportAPI + data.materialImportId, data
        )
        dispatch(setLoading(false))
        toast.success(UPDATE_SUCCESS, toastCss)
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
        toast.error(UPDATE_FAIL_IMPORT_MATERIAL, toastCss)

    }
})

export const deleteMaterialImport = createAsyncThunk('listMaterialImport/deleteMaterialImport', async (materialImportId, {dispatch}) => {
    try {
        dispatch(setLoading(true))
        const res = await axiosInstance.delete(deleteMaterialImportAPI + materialImportId)
        dispatch(setLoading(false))
        toast.success(DELETE_SUCCESS, toastCss)
        return materialImportId
    } catch (error) {
        dispatch(setLoading(false))
        toast.error(DELETE_FAIL_IMPORT_MATERIAL, toastCss)

    }
})

export const addMaterialImport = createAsyncThunk('listMaterialImport/addMaterialImport', async (values, {dispatch}) => {
    try {
        dispatch(setLoading(true))
        const res = await axiosInstance.post(addListMaterialImportAPI, values)
        dispatch(setLoading(false))
        toast.success("Thêm vật liệu thành công !!!!!", toastCss)
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(setLoading(false))
        toast.error('Thêm mới thất bại!', toastCss)
    }
})

export const { setListMaterialImport, setIsAddMaterialImport, setLoading } = listMaterialImportSlice.actions;
export default listMaterialImportSlice.reducer;