import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import { deleteSpecimensAPI, getSpecimensByIdAPI } from "../../config/baseAPI"
import { DELETE_SPECIMENS_FAIL, DELETE_SUCCESS } from "../../config/constant"
import axiosInstance from "../../config/customAxios"
import { toastCss } from "../toastCss"

const initState = {
    choosenSpecimens: {},
    status: false,
    statusSpecimens: false,
    specimensName: '',
    patientName: '',
    amount: '',
    unitPrice: '',
    receiveDate: '',
    deliveryDate: '',
    dateRecord: '',
    statusDeleteSpecimens: false,
    isDeleteSpecimens: false,

}
const choosenSpecimensSlice = createSlice({
    name: 'choosenSpecimens',
    initialState: initState,
    reducers: {
        setChoosenSpecimens: (state, action) => {
            state.choosenSpecimens = action.payload
        },
        setSpecimensName: (state, action) => {
            state.specimensName = action.payload
        },
        setPatientName: (state, action) => {
            state.patientName = action.payload
        },
        setAmount: (state, action) => {
            state.amount = action.payload
        },
        setUnitPrice: (state, action) => {
            state.unitPrice = action.payload
        },
        setReceiveDate: (state, action) => {
            state.receiveDate = action.payload
        },
        setDeliveryDate: (state, action) => {
            state.deliveryDate = action.payload
        },
        setDateRecord: (state, action) => {
            state.dateRecord = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecimens.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchSpecimens.fulfilled, (state, action) => {
                state.choosenSpecimens = action.payload;
                state.specimensName = action.payload.specimensName;
                state.patientName = action.payload.patientName;
                state.amount = action.payload.amount;
                state.unitPrice = action.payload.unitPrice;
                state.receiveDate = action.payload.receiveDate;
                state.deliveryDate = action.payload.deliveryDate;
                state.dateRecord = action.payload.date;
                state.isDeleteSpecimens = false
            })
            .addCase(deleteSpecimens.pending, (state, action) => {
                state.statusDeleteSpecimens = true
            })
            .addCase(deleteSpecimens.fulfilled, (state, action) => {
                state.isDeleteSpecimens = true
            })
    }
})
export const fetchSpecimens = createAsyncThunk('specimens/fetchSpecimens', async (specimenId) => {
    try {
        const res = await axiosInstance.get(
            getSpecimensByIdAPI + specimenId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

export const deleteSpecimens = createAsyncThunk('listSpecimens/deleteSpecimens', async (specimenId) => {
    try {
        const res = await axiosInstance.delete(deleteSpecimensAPI + specimenId)
        toast.success(DELETE_SUCCESS, toastCss)
        return specimenId
    } catch (error) {
        toast.error(DELETE_SPECIMENS_FAIL, toastCss)

    }
})
export const { setChoosenSpecimens, setSpecimensName, setPatientName, setAmount, setUnitPrice, setReceiveDate, setDeliveryDate, setDateRecord, setMessage } = choosenSpecimensSlice.actions;
export default choosenSpecimensSlice.reducer;

