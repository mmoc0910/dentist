import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getMaterialImportByIdAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"

const initState = {
    choosenMaterialImport: {},
    status: false,
    statusMaterial: false,
    statusDeleteMaterial: false,
    materialName: '',
    supplyName: '',
    amount: '',
    totalPrice: '',
    date: ''

}
const choosenMaterialImportSlice = createSlice({
    name: 'choosenMaterialImport',
    initialState: initState,
    reducers: {
        setChoosenMaterialImport: (state, action) => {
            state.choosenMaterialImport = action.payload
        },
        setMaterialName: (state, action) => {
            state.materialName = action.payload
        },
        setSupplyName: (state, action) => {
            state.supplyName = action.payload
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
            .addCase(fetchMaterialImport.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchMaterialImport.fulfilled, (state, action) => {
                state.choosenMaterialImport = action.payload;
                state.materialName = action.payload.materialName;
                state.supplyName = action.payload.supplyName;
                state.date = action.payload.date;
                state.amount = action.payload.amount;
                state.totalPrice = action.payload.totalPrice;
            })
    }
})
export const fetchMaterialImport = createAsyncThunk('material_imports/fetchMaterialImport', async (materialImportId) => {
    try {
        const res = await axiosInstance.get(
            getMaterialImportByIdAPI + materialImportId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenMaterialImport, setMaterialName, setSupplyName,setDate, setAmount, setTotalPrice, setMessage} = choosenMaterialImportSlice.actions;
export default choosenMaterialImportSlice.reducer;

