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
import { updateAccount } from "../../../redux/AccountSlice/listAccountSlice";
import { profileAPI } from "../../../config/baseAPI";

const BlockUpdateProfile = ({ setIsEdit, userInfo }) => {
  const dispatch = useDispatch();
  const [valueDate, setValueDate] = useState(moment(userInfo.birthdate));
  const isUpdateAccount = useSelector(
    (state) => state.userProfile.isUpdateAccount
  );
  const { userId, roleId } = useSelector(
    (state) => state.userProfile.userProfile
  );

  //   useEffect(() => {
  //     try {
  //       dispatch(fetchUserProf);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, [isUpdateAccount]);
  //   const fetchUserProf = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axiosInstance.get(profileAPI);
  //       console.log(res.data);
  //       formik.setValues(res.data);
  //       setValue(res.data.birthdate);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setLoading(false);
  //   };
  const validationSchema = yup.object({
    fullName: yup
      .string("Nhập họ tên")
      .required("Vui lòng nhập họ tên")
      .matches(
        regexName,
        "Họ và tên không được nhập số hoặc kí tự đặc biệt, chữ cái đầu phải in hoa"
      ),
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
  });

  const formik = useFormik({
    initialValues: userInfo,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateAccount({
          ...values,
          userId,
          roleId,
          birthdate: moment(valueDate).format(validationDate),
        })
      );
      setTimeout(() => {
        setIsEdit(false);
      }, 500);
    },
  });

  return (
    <>
      <InputDentist
        id="fullName"
        isFlex
        validate
        label="Họ và tên:"
        disabled
        value={formik.values.fullName}
        onChange={formik.handleChange}
        error={{
          message: formik.errors.fullName,
          touched: formik.touched.fullName,
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

export default BlockUpdateProfile;
