import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { listServiceByCategoryIdAPI } from "../../config/baseAPI"
import axiosInstance from "../../config/customAxios"

const initState = {
    choosenService: {},
    status: false,
    statusService: false,
    statusDeleteService: false,
    serviceName: '',
    unit: '',
    marketPrice: '',
    price: '',
    message: ''


}
const choosenServiceSlice = createSlice({
    name: 'choosenService',
    initialState: initState,
    reducers: {
        setChoosenService: (state, action) => {
            state.choosenService = action.payload
        },
        setServiceName: (state, action) => {
            state.serviceName = action.payload
        },
        setUnit: (state, action) => {
            state.unit = action.payload
        },
        setMarketPrice: (state, action) => {
            state.marketPrice = action.payload
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
            .addCase(fetchService.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchService.fulfilled, (state, action) => {
                state.choosenService = action.payload;
                state.serviceName = action.payload.serviceName;
                state.unit = action.payload.unit;
                state.marketPrice = action.payload.marketPrice;
                state.price = action.payload.price;
               
            })
    }
})
export const fetchService = createAsyncThunk('categories/fetchService', async (categoryServiceId) => {
    try {
        const res = await axiosInstance.get(
            listServiceByCategoryIdAPI + categoryServiceId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenService, setServiceName,setUnit,setMarketPrice,setPrice, setMessage} = choosenServiceSlice.actions;
export default choosenServiceSlice.reducer;

