import { Box, FormControlLabel, Button } from "@mui/material";
import { Radio, Space } from "antd";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { getPatientByIdAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { updatePatient } from "../../../redux/PatienSlice/choosenPatientSlice";
import DatePickerDentist from "../../ui/date-picker/DatePickerDentist";
import InputDentist from "../../ui/input";
import {
  regexEmail,
  regexName,
  regexPhone,
  validationDate,
} from "../../../config/validation";

const BlockUpdatePatient = ({ setIsEdit, userInfo }) => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState(userInfo.gender);
  const [valueDate, setValueDate] = useState(moment(userInfo.birthdate));

  const validationSchema = yup.object({
    patientName: yup
      .string("Nhập họ tên")
      .required("Vui lòng nhập họ tên")
      .matches(regexName, "Họ và tên không được nhập số hoặc kí tự đặc biệt"),
    phone: yup
      .string("Nhập số điện thoại")
      .required("Vui lòng nhập số điện thoại")
      .matches(
        regexPhone,
        "Số điện thoại không được nhập chữ, kí tự, bắt buộc phải 10 số bắt đầu là 03, 05, 07 08, 09."
      ),
    email: yup
      .string("Nhập email")
      .matches(regexEmail, "Email không đúng với định dạng."),
    address: yup
      .string("Nhập địa chỉ")
      .required("Vui lòng nhập địa chỉ")
      .max(255, "Địa chỉ không thể quá 255 kí tự."),
  });

  const formik = useFormik({
    initialValues: userInfo,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const valueForm = { ...values };
      valueForm.birthdate = moment(valueDate).format(validationDate);
      valueForm.gender = gender;
       dispatch(updatePatient(valueForm));
    },
  });

  return (
    <>
      <InputDentist
        id="patientName"
        isFlex
        validate
        label="Họ và tên:"
        value={formik.values.patientName}
        onChange={formik.handleChange}
        error={{
          message: formik.errors.patientName,
          touched: formik.touched.patientName,
        }}
      />
      <Box className="flex items-center mb-2">
        <p className="mb-1 font-bold w-1/3">Ngày sinh:</p>
        <Box className="w-full">
          <DatePickerDentist
            value={valueDate}
            clearIcon={null}
            onChange={(newValue) => {
              setValueDate(newValue);
            }}
          />
        </Box>
      </Box>
      <InputDentist
        id="phone"
        label="Số điện thoại:"
        isFlex
        validate
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={{
          message: formik.errors.phone,
          touched: formik.touched.phone,
        }}
      />
      <Box className="flex items-center gap-3 mb-2">
        <span className="font-bold w-1/3">Giới tính:</span>
        <Radio.Group
          onChange={(e) => setGender(e.target.value)}
          value={gender}
          className="items-center w-full"
        >
          <FormControlLabel value={true} control={<Radio />} label="Nam" />
          <FormControlLabel value={false} control={<Radio />} label="Nữ" />
        </Radio.Group>
      </Box>
      <InputDentist
        id="address"
        isFlex
        validate
        label="Địa chỉ:"
        value={formik.values.address}
        onChange={formik.handleChange}
        error={{
          message: formik.errors.address,
          touched: formik.touched.address,
        }}
      />
      <InputDentist
        id="email"
        isFlex
        label="Email:"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={{
          message: formik.errors.email,
          touched: formik.touched.email,
        }}
      />
      <InputDentist
        id="bodyPrehistory"
        isFlex
        validate
        label="Tiền sử cơ thể:"
        value={formik.values.bodyPrehistory}
        onChange={formik.handleChange}
      />
      <InputDentist
        id="teethPrehistory"
        isFlex
        label="Tiền sử răng miệng:"
        value={formik.values.teethPrehistory}
        onChange={formik.handleChange}
      />
      <Box className="flex justify-end gap-3">
        <Button variant="contained" color="info" onClick={formik.handleSubmit}>
          <span className="leading-none">Lưu</span>
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setIsEdit(false)}
        >
          <span className="leading-none">Hủy</span>
        </Button>
      </Box>
    </>
  );
};

export default BlockUpdatePatient;
