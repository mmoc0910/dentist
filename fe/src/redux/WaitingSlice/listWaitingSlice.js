import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { listWaitingAPI, listWaitingInfoAPI, deleteWaitingAPI, callWaitingAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"
import { toast } from "react-toastify"

const initState = {
    listWaiting: [],
    pagination: [],
    status: false,
    index: 0,
    pageSize: 3,
    totalPage: 0,
    totalElements: 0,
    message: '',
    statusDeleteWaiting: false,
    isDeleteWaiting: false,
    statusCallWaiting: false,
    isCallWaiting: false
}

const listWaitingSlice = createSlice({
    name: 'listWaiting',
    initialState: initState,
    reducers: {
        setListWaiting: (state, action) => {
            state.listWaiting = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllWaiting.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchAllWaiting.fulfilled, (state, action) => {
                state.status = false;
                state.listWaiting = action.payload.content;
                state.pageNumber = action.payload.pageNumber;
                state.totalPage = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
                state.message = action.payload.message
                state.isDeleteWaiting = false
                state.isCallWaiting = false
            })
            .addCase(deleteWaiting.pending, (state, action) => {
                state.statusDeleteWaiting = true
            })
            .addCase(deleteWaiting.fulfilled, (state, action) => {
                state.isDeleteWaiting = true
            })
            .addCase(callWaiting.pending, (state, action) => {
                state.statusCallWaiting = true
            })
            .addCase(callWaiting.fulfilled, (state, action) => {
                state.isCallWaiting = true
            })
    }
})

export const fetchAllWaiting = createAsyncThunk('listWaiting/fetchAllWaiting', async (paramsSearch) => {
    try {
        // Use new paginated endpoint
        const res = await axiosInstance.get(listWaitingInfoAPI, {
            params: paramsSearch,
        })
        return res.data
    } catch (error) {
        console.log(error)
        // Fallback to old endpoint if new one fails
        try {
            const fallbackRes = await axiosInstance.get(listWaitingAPI, {
                params: paramsSearch,
            })
            // Transform old format to new format
            return {
                content: fallbackRes.data,
                pageNumber: 0,
                totalPages: 1,
                totalElements: fallbackRes.data.length,
                message: 'Success'
            }
        } catch (fallbackError) {
            console.log(fallbackError)
        }
    }
})

export const callWaiting = createAsyncThunk('listWaiting/callWaiting', async (id) => {
    axiosInstance.post(callWaitingAPI + id)
        .then(res => {
            toast.success("Đăng kí khám thành công");
        })
        .catch(err => {
            toast.error("Đăng kí khám không thành công");
        });
})

export const deleteWaiting = createAsyncThunk('listWaiting/deleteWaiting', async (id) => {
    try {
         await axiosInstance.delete(deleteWaitingAPI + id);
        toast.success("Xóa thành công");
    } catch (error) {
        toast.error("Xóa không thành công");
    }
})

export const { setListWaiting } = listWaitingSlice.actions;
export default listWaitingSlice.reducer;