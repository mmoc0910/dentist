import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getCategoryByIdAPI } from "../../config/baseAPI"

const initState = {
    choosenCategory: {},
    status: false,
    statusCategory: false,
    statusDeleteCategory: false,
    categoryServiceName: '',
    message: ''


}
const choosenCategorySlice = createSlice({
    name: 'choosenCategory',
    initialState: initState,
    reducers: {
        setChoosenCategory: (state, action) => {
            state.choosenCategory = action.payload
        },
        setCategoryServiceName: (state, action) => {
            state.categoryServiceName = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategory.pending, (state, action) => {
                state.status = true
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.choosenCategory = action.payload;
                state.categoryServiceName = action.payload.categoryServiceName;
               
            })
    }
})
export const fetchCategory = createAsyncThunk('categories/fetchCategory', async (categoryServiceId) => {
    try {
        const res = await axios.get(
            getCategoryByIdAPI + categoryServiceId,
        )
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { setChoosenCategory, setCategoryServiceName, setMessage} = choosenCategorySlice.actions;
export default choosenCategorySlice.reducer;

