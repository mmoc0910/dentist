import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Modal, Skeleton } from "antd";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./../style.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import moment from "moment/moment";
import { updateAccount } from "../../../redux/AccountSlice/listAccountSlice";
import {
  regexEmail,
  regexNumber,
  regexPhone,
  validationDate,
} from "../../../config/validation";
import { getAccountByIdAPI, listRoleAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import RoleTag from "../../ui/RoleTag";
import Loading from "../../ui/Loading";
import InputDentist from "../../ui/input";

const ModalUpdateAccount = ({ modalUpdateOpen, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.modal.userId);
  const [loading, setloading] = useState();
  const [value, setValue] = useState(null);
  const [roleIds, setRoleIds] = useState([]);
  const [roleId, setRoleId] = useState();

  const [oldData, setOldData] = useState();

  const validationSchema = yup.object({
    fullName: yup.string("Nhập họ tên").required("Họ tên là bắt buộc."),
    phone: yup
      .string("Nhập số điện thoại")
      .matches(
        regexPhone,
        "Số điện thoại không được nhập chữ, kí tự, bắt buộc phải 10 số bắt đầu là 03, 05, 07 08, 09."
      )
      .required("Số điện thoại là bắt buộc."),
    email: yup
      .string("Nhập email")
      .matches(regexEmail, "Email không đúng với định dạng.")
      .required("Trường email là bắt buộc."),
    salary: yup
      .string("Nhập số lương")
      .matches(regexNumber, "Lương không được nhập chữ, kí tự, số âm.")
      .required("Lương là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.birthdate = moment(value.$d).format(validationDate);
      values.roleId = roleId;
      const roleNameArray = roleIds.filter((el) => {
        if (el.roleId === roleId) {
          return el;
        }
      });

      values.roleName = roleNameArray[0].roleName;
      dispatch(updateAccount(values));
      setModalUpdateOpen(false);
    },
  });

  const fetchAccount = async (userId) => {
    try {
      setloading(true);
      const res = await axiosInstance.get(getAccountByIdAPI + userId);
      setloading(false);
      formik.setValues(res.data);
      setOldData(res.data);
      setRoleId(res.data.roleId);
      setValue(res.data.birthdate);
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId > 0) fetchAccount(userId);
  }, [userId]);

  const loadRole = async () => {
    try {
      const res = await axiosInstance.get(listRoleAPI);
      setRoleId(res.data[0].roleId);
      setRoleIds(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRole();
  }, []);

  const handleCancel = () => {
    formik.values.salary = oldData.salary;
    formik.values.fullName = oldData.fullName;
    formik.values.phone = oldData.phone;
    formik.values.email = oldData.email;
    setValue(oldData.birthdate);
    setRoleId(oldData.roleId);
    setModalUpdateOpen(false);
  };

  return (
    <>
      {/* {loading && <Loading />} */}
      <Modal
        title="Thông tin nhân viên"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        {loading === false ? (
          <>
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
                    <MenuItem
                      className="p-2"
                      key={item.roleId}
                      value={item.roleId}
                    >
                      <RoleTag role={item.roleName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        ) : (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateAccount;
