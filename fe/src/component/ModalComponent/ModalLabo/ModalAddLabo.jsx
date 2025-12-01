import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addLabo } from "../../../redux/LaboSlice/listLaboSlice";
import { regexPhone } from "../../../config/validation";
import InputDentist from "../../ui/input";

const ModalAddLabo = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);

  const validationSchema = yup.object({
    laboName: yup
      .string("Nhập Labo")
      .max(250, "Labo không thể quá 250 ký tự.")
      .required("Labo là bắt buộc."),
    phone: yup
      .string("Nhập số điện thoại")
      .matches(
        regexPhone,
        "Số điện thoại không được nhập chữ, kí tự, bắt buộc phải 10 số bắt đầu là 03, 05, 07 08, 09."
      )
      .required("Số điện thoại là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      laboName: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addLabo(values));
      setModalAddOpen(false);
      formik.handleReset();
    },
  });

  const handleCancel = () => {
    setModalAddOpen(false);

    // formik.errors.laboName = ""
    // formik.touched.laboName = ""

    // formik.errors.phone = ""
    // formik.touched.phone = ""

    formik.resetForm();
  };

  return (
    <>
      <Modal
        title="Thêm Labo"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <InputDentist
          required
          id="laboName"
          label="Labo"
          value={formik.values.laboName}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.laboName,
            touched: formik.touched.laboName,
          }}
        />
        <InputDentist
          required
          id="phone"
          label="Số điện thoại"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.phone,
            touched: formik.touched.phone,
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddLabo;
