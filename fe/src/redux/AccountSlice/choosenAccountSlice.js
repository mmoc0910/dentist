import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAccountByIdAPI,
  getListNotifiesAPI,
  readNotiAPI,
} from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";

const initState = {
  choosenAccount: {},
  status: false,
  statusUser: false,
  statusDeleteAccount: false,
  name: "",
  userName: "",
  birthdate: "",
  phone: "",
  salary: "",
  roleId: "",
  roleName: "",
  listNotifies: [],
  isUpdateNoti: false
};
const choosenAccountSlice = createSlice({
  name: "choosenAccount",
  initialState: initState,
  reducers: {
    setChoosenAccount: (state, action) => {
      state.choosenAccount = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setBirthdate: (state, action) => {
      state.birthdate = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setSalary: (state, action) => {
      state.salary = action.payload;
    },
    setRoleName: (state, action) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.choosenAccount = action.payload;
        state.name = action.payload.fullName;
        state.userName = action.payload.userName;
        state.birthdate = action.payload.birthdate;
        state.phone = action.payload.phone;
        state.salary = action.payload.salary;
        state.roleId = action.payload.roleId;
        state.roleName = action.payload.roleName;
        state.status = false;
      })
      .addCase(getListNotifies.pending, (state, action) => {
        state.isUpdateNoti = false;
      })
      .addCase(getListNotifies.fulfilled, (state, action) => {
        state.listNotifies = action.payload;
        state.isUpdateNoti = false;
      })
      .addCase(readNoti.pending, (state, action) => {
        // state.listNotifies = action.payload;
      })
      .addCase(readNoti.fulfilled, (state, action) => {
        state.isUpdateNoti = true;
      });
  },
});
export const fetchAccount = createAsyncThunk(
  "users/fetchAccount",
  async (userId) => {
    try {
      const res = await axios.get(getAccountByIdAPI + userId);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getListNotifies = createAsyncThunk(
  "users/getListNotifies",
  async () => {
    try {
      const res = await axiosInstance.get(getListNotifiesAPI);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const readNoti = createAsyncThunk("users/readNoti", async (notiId) => {
  try {
    await axiosInstance.put(readNotiAPI + notiId);
  } catch (error) {
    console.log(error);
  }
});
export const {
  setChoosenAccount,
  setName,
  setUserName,
  setBirthdate,
  setPhone,
  setMessage,
  setRoleName,
  setSalary,
} = choosenAccountSlice.actions;
export default choosenAccountSlice.reducer;
