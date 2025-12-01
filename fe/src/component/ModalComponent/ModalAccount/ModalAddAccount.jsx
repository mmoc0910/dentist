import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  regexEmail,
  regexNumber,
  regexPassword,
  regexPhone,
  regexPositiveNumber,
  validationDate,
} from "../../../config/validation";
import axios from "axios";
import { listRoleAPI } from "../../../config/baseAPI";
import moment from "moment/moment";
import { addAccount } from "../../../redux/AccountSlice/listAccountSlice";
import axiosInstance from "../../../config/customAxios";
import RoleTag from "../../ui/RoleTag";
import InputDentist from "../../ui/input";

const ModalAddAcount = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [roleIds, setRoleIds] = useState([]);
  const [roleId, setRoleId] = useState();
  const [error, setError] = useState([]);

  const validationSchema = yup.object({
    fullName: yup.string("Nhập họ tên").required("Họ tên là bắt buộc."),
    phone: yup
      .string("Nhập số điện thoại")
      .matches(
        regexPhone,
        "Số điện thoại không được nhập chữ, kí tự, bắt buộc phải 10 số bắt đầu là 03, 05, 07 08, 09."
      )
      .required("Số điện thoại là bắt buộc."),
    password: yup
      .string("Enter your password")
      .matches(
        regexPassword,
        "Mật khẩu phải là từ 6 đến 32 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      )
      .required("Trường mật khẩu là bắt buộc."),
    email: yup
      .string("Nhập email")
      .matches(regexEmail, "Email không đúng với định dạng.")
      .required("Trường email là bắt buộc."),
    salary: yup
      .string("Nhập số lương")
      .matches(regexNumber, "Lương không được nhập chữ, kí tự, số âm.")
      .required("Lương là bắt buộc."),
  });

  const loadRole = async () => {
    try {
      const res = await axiosInstance.get(listRoleAPI);
      console.log(res);
      setRoleId(res.data[0].roleId);
      setRoleIds(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRole();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      salary: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.birthdate = moment(value.$d).format(validationDate);
      values.roleId = roleId;
      dispatch(addAccount(values));
      setModalAddOpen(false);
      formik.handleReset();
    },
  });

  const handleCancel = () => {
    setModalAddOpen(false);

    // formik.values.fullName = ""
    // formik.errors.fullName = ""

    // formik.values.password = ""
    // formik.errors.password = ""

    // formik.values.phone = ""
    // formik.errors.phone = ""

    // formik.values.email = ""
    // formik.errors.email = ""

    // formik.values.salary = ""
    // formik.errors.salary = ""

    setValue(null);
    formik.resetForm();
  };

  return (
    <>
      <Modal
        title="Thêm Tài Khoản"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <InputDentist
          id="fullName"
          required
          label="Họ và tên"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.fullName,
            touched: formik.touched.fullName,
          }}
        />
        <Box className="mb-2">
          <p className={`mb-1 font-bold`}>
            Mật khẩu <span className="text-red-600">*</span>
          </p>
          <TextField
            required
            fullWidth
            id="password"
            label=""
            name="password"
            autoComplete="password"
            value={formik.values.password}
            type={"password"}
            onChange={formik.handleChange}
          />
          {formik.errors.password && formik.touched.password && (
            <Typography
              style={{ color: "red", fontStyle: "italic", fontSize: "14px" }}
            >
              {formik.errors.password}
            </Typography>
          )}
        </Box>

        <InputDentist
          id="phone"
          required
          label="Số điện thoại"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.phone,
            touched: formik.touched.phone,
          }}
        />
        <InputDentist
          id="email"
          required
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.email,
            touched: formik.touched.email,
          }}
        />
        <p className={`mb-1 font-bold`}>Ngày sinh</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-2"
            label="Ngày sinh"
            name="birthdate"
            value={value}
            inputFormat="DD/MM/YYYY"
            disableFuture={true}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <InputDentist
          id="salary"
          required
          label="Lương"
          value={formik.values.salary}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.salary,
            touched: formik.touched.salary,
          }}
        />
        <Box sx={{ minWidth: 120 }} className="w-full mt-0">
          <FormControl fullWidth>
          <p className={`mb-2 font-bold`}>
            Quyền hạn <span className="text-red-600">*</span>
          </p>
            <Select
              labelId="permisstion"
              id="permisstionSelect"
              value={roleId}
              className="min-h-[56px] min-w-[200px]"
              onChange={(e) => setRoleId(e.target.value)}
            >
              {roleIds?.map((item) => (
                <MenuItem className="p-2" key={item.roleId} value={item.roleId}>
                  <RoleTag role={item.roleName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddAcount;
