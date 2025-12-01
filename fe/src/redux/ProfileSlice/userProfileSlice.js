import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { add } from "lodash";
import { profileAPI, changePasswordAPI } from "../../config/baseAPI";
import axiosInstance from "../../config/customAxios";
import { toast } from "react-toastify";
import { toastCss } from "../toastCss";
import {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from "../../config/constant";
import { updateAccount } from "../AccountSlice/listAccountSlice";

const initState = {
  userProfile: {},
  status: false,
  statusUserProfile: false,
  userId: "",
  fullName: "",
  roleName: "",
  birthdate: "",
  phone: "",
  email: "",
  salary: "",
  userName: "",
  isUpdateAccount: false,
  statusDeleteAccount: false,
  isChangePassword: false,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: initState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setIsChangePassword: (state, action) => {
      state.userProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state, action) => {
        state.status = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.fullName = action.payload.fullName;
        state.userId = action.payload.userId;
        state.birthdate = action.payload.birthdate;
        state.phone = action.payload.phone;
        state.email = action.payload.email;
        state.roleName = action.payload.roleName;
        state.salary = action.payload.salary;
        state.userName = action.payload.userName;
        state.isUpdateAccount = false;

        state.status = false;
      })
      .addCase(changePassword.pending, (state, action) => {
        // state.statusUpdateAccount = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isChangePassword = true;
      })
      .addCase(updateAccount.pending, (state, action) => {
        state.statusUpdateAccount = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isUpdateAccount = true;
      });
  },
});

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async () => {
    try {
      const res = await axiosInstance.get(profileAPI);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ userId, oldPassword, newPassword }) => {
    try {
      const res = await axiosInstance.put(
        `${
          changePasswordAPI + userId
        }?oldPassword=${oldPassword}&newPassword=${newPassword}`
      );
      return true;
    } catch (error) {
      return false;
      console.log(error);
    }
  }
);

export const { setUserProfile, setIsChangePassword } = userProfileSlice.actions;
export default userProfileSlice.reducer;
