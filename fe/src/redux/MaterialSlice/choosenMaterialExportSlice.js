import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getMaterialExportByIdAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"

const initState = {
    choosenMaterialExport: {},
    status: false,
    statusMaterial: false,
    statusDeleteMaterial: false,
    materialName: '',
    patientName: '',
    amount: '',
    totalPrice: '',
    date: ''

}
const choosenMaterialExportSlice = createSlice({
    name: 'choosenMaterialExport',
    initialState: initState,
    reducers: {
        setChoosenMaterialExport: (state, action) => {
            state.choosenMaterialExport = action.payload
        },
        setMaterialName: (state, action) => {
            state.materialName = action.payload
        },
        setPatientName: (state, action) => {
            state.patientName = action.payload
        },
        setAmount: (state, action) => {
            state.amount = action.payload
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload
        },
        setDate: (state, action) => {
            state.date = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterialExport.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchMaterialExport.fulfilled, (state, action) => {
                state.choosenMaterialExport = action.payload;
                state.materialName = action.payload.materialName;
                state.patientName = action.payload.patientName;
                state.date = action.payload.date;
                state.amount = action.payload.amount;
                state.totalPrice = action.payload.totalPrice;
            })
    }
})
export const fetchMaterialExport = createAsyncThunk('material_imports/fetchMaterialExport', async (materialExportId) => {
    try {
        const res = await axiosInstance.get(
            getMaterialExportByIdAPI + materialExportId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenMaterialExport, setMaterialName, setPatientName,setDate, setAmount, setTotalPrice, setMessage} = choosenMaterialExportSlice.actions;
export default choosenMaterialExportSlice.reducer;

