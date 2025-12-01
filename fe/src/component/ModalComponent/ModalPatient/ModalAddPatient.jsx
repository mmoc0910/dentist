import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField, Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Radio } from "antd";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch, useSelector } from "react-redux";
import DatePickerDentist from "../../ui/date-picker/DatePickerDentist";
import InputDentist from "../../ui/input";
import * as yup from "yup";
import {
  regexEmail,
  regexName,
  regexPhone,
  validationDate,
} from "../../../config/validation";
import { useFormik } from "formik";
import moment from "moment";
import { addPatient } from "../../../redux/PatienSlice/listPatientSlice";

const ModalAddPatient = ({ modalAddOpen, setModalAddOpen, isSubmitForm }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [gender, setGender] = useState(true);

  const validationSchema = yup.object({
    patientName: yup
      .string("Nhập họ tên")
      .matches(
        // regexName,
        "Họ và tên không được nhập số hoặc kí tự đặc biệt, nhập từ 8 đến 32 ký tự."
      )
      .required("Họ tên là bắt buộc."),
    phone: yup
      .string("Nhập số điện thoại")
      .matches(
        regexPhone,
        "Số điện thoại không được nhập chữ, kí tự, bắt buộc phải 10 số bắt đầu là 03, 05, 07 08, 09."
      )
      .required("Số điện thoại là bắt buộc."),
    email: yup
      .string("Nhập email")
      .matches(regexEmail, "Email không đúng với định dạng."),
    address: yup
      .string("Nhập địa chỉ")
      .max(255, "Địa chỉ không thể quá 255 kí tự.")
      .required("Địa chỉ là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      patientName: "",
      phone: "",
      email: "",
      address: "",
      bodyPrehistory: "",
      teethPrehistory: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.birthdate = moment(value).format(validationDate);
      values.gender = gender;
      dispatch(addPatient(values));
      setModalAddOpen(false);
      isSubmitForm(true);
      setValue(null);
      formik.handleReset();
    },
  });

  const handleCancel = () => {
    setModalAddOpen(false);
    isSubmitForm(false);
    setGender(true);
    setValue(null);
    formik.resetForm();
  };

  return (
    <>
      <Modal
        title="Thêm Bệnh Nhân"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <InputDentist
          id="patientName"
          label="Họ và tên bệnh nhân"
          required
          value={formik.values.patientName}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.patientName,
            touched: formik.touched.patientName,
          }}
        />
        <Box className="mb-2">
          <p className="mb-1 font-bold">
            Ngày sinh<span className="text-red-600">*</span>
          </p>
          <DatePickerDentist
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </Box>
        <InputDentist
          id="phone"
          label="Số điện thoại"
          required
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.phone,
            touched: formik.touched.phone,
          }}
        />
        <Box className="flex gap-3 mb-2">
          <span className="mr-3  font-bold">Gender:</span>
          <Radio.Group
            style={{ marginRight: "30%" }}
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            className="items-center"
          >
            <FormControlLabel value={true} control={<Radio />} label="Nam" />
            <FormControlLabel value={false} control={<Radio />} label="Nữ" />
          </Radio.Group>
        </Box>
        <InputDentist
          id="address"
          label="Địa chỉ"
          required
          value={formik.values.address}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.address,
            touched: formik.touched.address,
          }}
        />
        <InputDentist
          id="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <InputDentist
          id="bodyPrehistory"
          label="Tiền sử cơ thể"
          value={formik.values.bodyPrehistory}
          onChange={formik.handleChange}
        />
        <InputDentist
          id="teethPrehistory"
          label="Tiền sử răng miệng"
          value={formik.values.teethPrehistory}
          onChange={formik.handleChange}
        />
      </Modal>
    </>
  );
};

export default ModalAddPatient;
