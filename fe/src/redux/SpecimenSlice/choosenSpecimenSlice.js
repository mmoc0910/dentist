import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getSpecimenByIdAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"

const initState = {
    choosenSpecimen: {},
    status: false,
    // statusUser: false,
    isDeleteSpecimen: false,
    specimenName: '',
    receiveDate: '',
    deliveryDate: '',
    usedDate: '',
    amount: 0,
    unitPrice: 0,
    specimenStatus: 0,
    serviceName: '',
    laboName: '',
    patientName: '',
    buttonUseEnable: false,
    buttonReportEnable: false

}
const choosenSpecimenSlice = createSlice({
    name: 'choosenSpecimen',
    initialState: initState,
    reducers: {
        setChoosenSpecimen: (state, action) => {
            state.choosenSpecimen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecimen.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchSpecimen.fulfilled, (state, action) => {
                state.choosenSpecimen = action.payload;
                state.specimenName = action.payload.specimenName;
                state.receiveDate = action.payload.receiveDate;
                state.deliveryDate = action.payload.deliveryDate;
                state.usedDate = action.payload.usedDate;
                state.amount = action.payload.amount;
                state.unitPrice = action.payload.unitPrice;
                state.specimenStatus = action.payload.status;
                state.serviceName = action.payload.serviceName;
                state.laboName = action.payload.laboName;
                state.patientName = action.payload.patientName;
                state.buttonReportEnable = action.payload.buttonReportEnable;
                state.buttonUseEnable = action.payload.buttonUseEnable;
                state.status = false
            })
    }
})
export const fetchSpecimen = createAsyncThunk('specimens/fetchSpecimen', async (specimenId) => {
    try {
        const res = await axiosInstance.get(
            getSpecimenByIdAPI + specimenId,
        )
        console.log('specimen = ',res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenSpecimen } = choosenSpecimenSlice.actions;
export default choosenSpecimenSlice.reducer;

