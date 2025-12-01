import {
  Grid,
  Typography,
  Box,
  TextField,
  Link,
  Avatar,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { toastCss } from "../../../redux/toastCss";
import { loginAPI } from "../../../config/baseAPI";
import { useNavigate } from "react-router-dom";
import { regexPassword } from "../../../config/validation";
import Logo from "../../../img/logo.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchema = yup.object({
  userName: yup
    .string("Nhập tên đăng nhập")
    .required("Trường tên đăng nhập là bắt buộc."),
  password: yup
    .string("Nhập mật khẩu")
    .matches(
      regexPassword,
      "Mật khẩu phải là từ 6 đến 32 ký tự, viết liền, không dấu."
    )
    .required("Trường mật khẩu là bắt buộc."),
});

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const paperStyle = {
    background:
      "linear-gradient(244.89deg, rgb(226, 251, 255) 7.39%, rgb(234, 225, 217) 74.76%, rgb(247, 184, 156) 100%)",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("role")) {
      navigate("/patient-management");
    } else {
      navigate("/login");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
  };
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(loginAPI, values);
      localStorage.setItem("token", res.data.jwt);
      localStorage.setItem("role", res.data.role);
      switch (res.data.role) {
        case "Admin":
        case "Doctor":
        case "LeaderNurse":
        case "Nurse":
        case "Receptionist":
          navigate("/patient-management");
          break;
      }
    } catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng.", toastCss);
    }
    setLoading(false);
  };

  return (
    <Grid container style={paperStyle}>
      <Box
        sx={{
          width: 500,
          padding: 10,
          paddingTop: 5,
          borderRadius: 5,
          boxShadow:
            "0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)",
          backgroundColor: "white",
        }}
      >
        <Box className="text-center font-bold text-2xl">
          <p>Đăng nhập</p>
        </Box>
        <Grid
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            className="cursor-pointer"
            src={Logo}
            width={130}
            style={{ margin: "auto", borderRadius: "10px" }}
            alt=""
          />
        </Grid>
        <p className={`mb-1 font-bold`}>
          Tên đăng nhập <span className="text-red-600">*</span>
        </p>
        <TextField
          required
          fullWidth
          id="userName"
          name="userName"
          autoComplete="username"
          value={formik.values.userName}
          onChange={handleChange}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              formik.handleSubmit();
            }
          }}
        />
        {formik.errors.userName && formik.touched.userName && (
          <Typography color={"red"}>{formik.errors.userName}</Typography>
        )}
        <p className={`mb-1 font-bold mt-3`}>
          Mật khẩu <span className="text-red-600">*</span>
        </p>
        <OutlinedInput
          required
          fullWidth
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          autoComplete="password"
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
          onChange={handleChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              formik.handleSubmit();
            }
          }}
        />
        {formik.errors.password && formik.touched.password && (
          <Typography color={"red"}>{formik.errors.password}</Typography>
        )}
        <Button
          loading={loading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={formik.handleSubmit}
        >
          Đăng nhập
        </Button>
        <Grid item xs sx={{ textAlign: "center" }}>
          <Link href="/forgot-password" variant="body2">
            Quên mật khẩu?
          </Link>
        </Grid>
      </Box>
    </Grid>
  );
};

export default LoginComponent;
