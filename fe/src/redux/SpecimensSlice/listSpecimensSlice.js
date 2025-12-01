import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import { toastCss } from "../toastCss"
import { UPDATE_SUCCESS, UPDATE_FAIL, DELETE_SUCCESS, DELETE_FAIL } from "../../config/constant"
import axiosInstance from "../../config/customAxios"
import { addSpecimensAPI, updateSpecimensAPI, deleteSpecimensAPI, getLaboByIdAPI, reportSpecimenAPI } from "../../config/baseAPI"


const initState = {
    listSpecimens: [],
    pagination: [],
    status: false,
    index: 0,
    pageSize: 3,
    totalPage: 0,
    statusUpdateSpecimens: false,
    isUpdateSpecimens: false,
    // statusDeleteSpecimens: false,
    // isDeleteSpecimens: false,
    statusAddSpecimens: false,
    isAddSpecimens: false,
}

const listSpecimensSlice = createSlice({
    name: 'listSpecimens',
    initialState: initState,
    reducers: {
        setListSpecimens: (state, action) => {
            state.listSpecimens = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSpecimens.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchAllSpecimens.fulfilled, (state, action) => {
                state.listSpecimens = action.payload;
                state.isUpdateSpecimens = false;
                state.isDeleteSpecimens = false;
                state.isAddSpecimens = false;
            })
            .addCase(updateSpecimens.pending, (state, action) => {
                state.statusUpdateSpecimens = true;
            })
            .addCase(updateSpecimens.fulfilled, (state, action) => {
                state.isUpdateSpecimens = true
            })
            // .addCase(deleteSpecimens.pending, (state, action) => {
            //     state.statusDeleteSpecimens = true
            // })
            // .addCase(deleteSpecimens.fulfilled, (state, action) => {
            //     state.isDeleteSpecimens = true
            // })
            .addCase(addSpecimens.pending, (state, action) => {
                state.statusAddSpecimens = true
            })
            .addCase(addSpecimens.fulfilled, (state, action) => {
                state.isAddSpecimens = true
            })
    }
})


export const fetchAllSpecimens = createAsyncThunk('listSpecimens/fetchAllSpecimens', async ({ paramsSearch, laboId }) => {
    try {
        const res = await axiosInstance.get(getLaboByIdAPI + laboId, {
            params: paramsSearch,
        })
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

export const updateSpecimens = createAsyncThunk('listSpecimens/updateSpecimens', async (data) => {
    try {
        const res = await axiosInstance.put(
            updateSpecimensAPI + data.specimenId, data
        )
        console.log(res)
        toast.success(UPDATE_SUCCESS, toastCss)
        return res.data
    } catch (error) {
        console.log(error)
        toast.error(UPDATE_FAIL, toastCss)

    }
})


// export const deleteSpecimens = createAsyncThunk('listSpecimens/deleteSpecimens', async (specimenId) => {
//     console.log('sss', specimenId)
//     try {
//         const res = await axiosInstance.delete(deleteSpecimensAPI + specimenId)
//         toast.success(DELETE_SUCCESS, toastCss)
//         return specimenId
//     } catch (error) {
//         toast.error(DELETE_FAIL, toastCss)

//     }
// })

export const addSpecimens = createAsyncThunk('listSpecimens/addSpecimens', async (values) => {
    try {

        console.log('body=',values);
        const res = await axiosInstance.post(addSpecimensAPI, values)
        toast.success("Thêm thành công !!!!!", toastCss)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
        toast.error('Thêm thất bại :(', toastCss)
    }
})

export const reportSpecimen = createAsyncThunk('listSpecimens/reportSpecimen', async (specimenId,values) => {
    try {

        console.log('body=',values);
        const res = await axiosInstance.post(reportSpecimenAPI+specimenId, values)
        toast.success("Báo cáo thành công !!!!!", toastCss)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
        toast.error('Báo cáo thất bại :(', toastCss)
    }
})

export const { setListSpecimens } = listSpecimensSlice.actions;
export default listSpecimensSlice.reducer;