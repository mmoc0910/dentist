import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getMaterialByIdAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"

const initState = {
    choosenMaterial: {},
    status: false,
    statusMaterial: false,
    statusDeleteMaterial: false,
    materialName: '',
    unit: '',
    amount: '',
    price: ''

}
const choosenMaterialSlice = createSlice({
    name: 'choosenMaterial',
    initialState: initState,
    reducers: {
        setChoosenMaterial: (state, action) => {
            state.choosenMaterial = action.payload
        },
        setMaterialName: (state, action) => {
            state.materialName = action.payload
        },
        setUnit: (state, action) => {
            state.unit = action.payload
        },
        setAmount: (state, action) => {
            state.amount = action.payload
        },
        setPrice: (state, action) => {
            state.price = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterial.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchMaterial.fulfilled, (state, action) => {
                state.choosenMaterial = action.payload;
                state.materialName = action.payload.materialName;
                state.unit = action.payload.unit;
                state.amount = action.payload.amount;
                state.price = action.payload.price;
            })
    }
})
export const fetchMaterial = createAsyncThunk('materials/fetchMaterial', async (materialId) => {
    try {
        const res = await axiosInstance.get(
            getMaterialByIdAPI + materialId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenMaterial, setMaterialName, setUnit, setAmount, setPrice, setMessage} = choosenMaterialSlice.actions;
export default choosenMaterialSlice.reducer;

