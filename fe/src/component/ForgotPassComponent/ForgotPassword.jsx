import { Avatar, Box, Button, Grid, Link, TextField } from "@mui/material";
import React, { useState } from "react";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { useHref } from "react-router-dom";
import axiosInstance from "../../config/customAxios";
import { forgotPassword } from "../../config/baseAPI";
import { regexEmail } from "../../config/validation";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { Alert } from "antd";

const validationSchema = yup.object({
  username: yup.string("Enter username").required("Username is required"),
});

const ForgotPassword = () => {
  const paperStyle = {
    background:
      "linear-gradient(244.89deg, rgb(226, 251, 255) 7.39%, rgb(234, 225, 217) 74.76%, rgb(247, 184, 156) 100%)",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    formik.handleChange(event);
  };
  const handleForgot = async (values) => {
    // setLoading(true)
    try {
      const res = await axios.post(forgotPassword + values.username, values);
      setMessage({
        ...message,
        type: "success",
        message: "Thành công, vui lòng kiểm tra email",
      });
    } catch (error) {
      setMessage({
        ...message,
        type: "error",
        message: error.response.data.message + "kiểm tra lại tên đăng nhập",
      });
    }
    // setLoading(false)
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      // code: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleForgot(values);
    },
  });

  return (
    <>
      <Grid container style={paperStyle}>
        <Box
          sx={{
            width: 500,
            padding: 10,
            borderRadius: 5,
            boxShadow:
              "0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)",
            backgroundColor: "white",
          }}
        >
          <Grid style={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", alignItems: "center" }}
            >
              <PsychologyAltIcon />
            </Avatar>
          </Grid>

          <label>Vui lòng nhập tài khoản để gửi yêu cầu đổi mật khẩu</label>
          {/* <form onSubmit={formik.handleSubmit}> */}
          {message.message !== "" && (
            <Alert description={message.message} type={message.type} showIcon />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nhập tài khoản cần gửi yêu cầu"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={handleChange}
          />
          {/* {formik.errors.password && <Typography color={'red'}>{formik.errors.password}</Typography>} */}
          <div style={{ display: "flex", width: "100%" }}>
            <Button
              // loading={loading}
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              href="/login"
              style={{ marginRight: "5px" }}
            >
              Login
            </Button>
            <Button
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={formik.handleSubmit}
            >
              Gửi yêu cầu
            </Button>
          </div>
          {/* </form> */}
        </Box>
      </Grid>
    </>
  );
};

export default ForgotPassword;
