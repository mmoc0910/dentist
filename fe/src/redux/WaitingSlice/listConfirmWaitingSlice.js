import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { listConfirmWaitingAPI,confirmWaitingAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"
import { toast } from 'react-toastify';

const initState = {
    listConfirmWaiting: [],
    // pagination: [],
    status: false,
    // index: 0,
    // pageSize: 3,
    // totalPage: 0,
    // totalElements: 0,
    message: '',
    isConfirmed: false,
    statusConfirmed: false,
    totalElements:0
}

const listConfirmWaitingSlice = createSlice({
    name: 'listConfirmWaiting',
    initialState: initState,
    reducers: {
        setListConfirmWaiting: (state, action) => {
            state.listConfirmWaiting = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllConfirmWaiting.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchAllConfirmWaiting.fulfilled, (state, action) => {
                state.listConfirmWaiting = action.payload;
                state.status = false;
                // state.pageNumber = action.payload.pageNumber;
                // state.totalPage = action.payload.totalPages;
                // state.totalElements = action.payload;
                state.message = action.payload.message;
                state.isConfirmed = false;
                state.statusConfirmed = false;
            })
            .addCase(confirmWaiting.pending, (state, action) => {
                state.statusConfirmed = true
            })
            .addCase(confirmWaiting.fulfilled, (state, action) => {
                state.isConfirmed = true
            })
    }
})

export const fetchAllConfirmWaiting = createAsyncThunk('listConfirmWaiting/fetchAllConfirmWaiting', async () => {
    try {
        const res = await axiosInstance.get(listConfirmWaitingAPI);
        return res.data
    } catch (error) {
        console.log('error = ',error)
    }
})

export const confirmWaiting = createAsyncThunk('listConfirmWaiting/confirmWaiting', async (data) => {
    await axiosInstance.post(confirmWaitingAPI + data.id + '?isAttend=' + data.isAttend)
    .then(res => {
        toast("Xác nhận khám thành công");
    })
    .catch(err => {
        toast("Xác nhận khám không thành công");
    });
})

export const { setListConfirmWaiting } = listConfirmWaitingSlice.actions;
export default listConfirmWaitingSlice.reducer;