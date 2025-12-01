import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import InputDentist from "../ui/input";
import * as yup from "yup";
import { useMemo } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  setIsChangePassword,
} from "../../redux/ProfileSlice/userProfileSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastCss } from "../../redux/toastCss";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const userId = useSelector((state) => state.userProfile.userId);

  const validationSchema = yup.object().shape({
    oldPass: yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPass: yup.string().min(6, "Mật khẩu phải có 6 kí tự").required("Vui lòng nhập mật khẩu mới"),
    reEnter: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu mới")
      .oneOf(
        [yup.ref("newPass"), null],
        "Mật khẩu mới phải trùng với mật khẩu cũ"
      ),
  });

  const formik = useFormik({
    initialValues: {
      oldPass: "",
      newPass: "",
      reEnter: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
       const res = await dispatch(
          changePassword({
            userId,
            oldPassword: values.oldPass,
            newPassword: values.newPass,
          })
        );
        if(res.payload){
          toast.success("Đổi mật khẩu thành công", toastCss);
          navigate("/profile");
          return 
        }
        toast.error("Đổi mật khẩu thất bại", toastCss);
    },
  });

  return (
    <div>
      <Box className="py-5 mx-auto w-1/2">
        <Box className="bg-white rounded-lg shadow-md p-3">
          <Box className="text-center mb-5">
            <h2 className="font-bold"> Đổi mật khẩu </h2>
          </Box>
          <Box className="mb-3">
            <p className={`mb-1 font-bold`}>
              Mật khẩu cũ <span className="text-red-600">*</span>
            </p>
            <OutlinedInput
              id="oldPass"
              className="w-full"
              placeholder="Nhập mật khẩu cũ"
              type={showOldPassword ? "text" : "password"}
              value={formik.values.oldPass}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.oldPass && formik.touched.oldPass && (
              <Typography
                style={{ color: "red", fontStyle: "italic", fontSize: "14px" }}
              >
                {formik.errors.oldPass}
              </Typography>
            )}
          </Box>
          <Box className="mb-3">
            <p className={`mb-1 font-bold`}>
              Mật khẩu mới <span className="text-red-600">*</span>
            </p>
            <OutlinedInput
              id="newPass"
              className="w-full"
              placeholder="Nhập mật khẩu"
              type={showPassword ? "text" : "password"}
              value={formik.values.newPass}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.newPass && formik.touched.newPass && (
              <Typography
                style={{ color: "red", fontStyle: "italic", fontSize: "14px" }}
              >
                {formik.errors.newPass}
              </Typography>
            )}
          </Box>
          <Box className="mb-3">
            <p className={`mb-1 font-bold`}>
              Nhập lại mật khẩu <span className="text-red-600">*</span>
            </p>
            <OutlinedInput
              id="reEnter"
              className="w-full"
              placeholder="Nhập lại mật khẩu"
              type={showRePassword ? "text" : "password"}
              value={formik.values.reEnter}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowRePassword(!showRePassword)}
                    edge="end"
                  >
                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.reEnter && formik.touched.reEnter && (
              <Typography
                style={{ color: "red", fontStyle: "italic", fontSize: "14px" }}
              >
                {formik.errors.reEnter}
              </Typography>
            )}
          </Box>
          <Box className="text-right">
            <Button
              variant="contained"
              color="success"
              className=""
              onClick={formik.handleSubmit}
            >
              Thay đổi
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
