import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addMaterial } from "../../../redux/MaterialSlice/listMaterialSlice";
import { regexNumber } from "../../../config/validation";
import InputDentist from "../../ui/input";

const ModalAddMaterial = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);

  const validationSchema = yup.object({
    materialName: yup
      .string("Nhập tên vật liệu")
      .max(255, "Vật liệu không thể quá 255 ký tự.")
      .required("Vật liệu là bắt buộc."),
    unit: yup
      .string("Nhập đơn vị")
      .max(45, "Đơn vị không thể quá 45 ký tự.")
      .required("Đơn vị là bắt buộc."),

    price: yup
      .string("Nhập đơn giá")
      .matches(regexNumber, "Đơn giá không được nhập chữ, kí tự, số âm.")
      .required("Đơn giá là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      materialName: "",
      unit: "",
      price: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addMaterial(values));
      setModalAddOpen(false);
      formik.handleReset();
    },
  });

  const handleCancelCustom = () => {
    setModalAddOpen(false);
    // formik.errors.materialName = ""
    // formik.touched.materialName = ""

    // formik.errors.unit = ""
    // formik.touched.unit = ""

    // formik.errors.price = ""
    // formik.touched.price = ""

    formik.resetForm();
  };

  return (
    <>
      <Modal
        title="Thêm Vật Liệu"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancelCustom}
      >
        <InputDentist
          required
          id="materialName"
          label="Vật liệu"
          name="materialName"
          value={formik.values.materialName}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.materialName,
            touched: formik.touched.materialName,
          }}
        />
        <InputDentist
          required
          id="unit"
          label="Đơn vị"
          name="unit"
          value={formik.values.unit}
          type={"unit"}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.unit,
            touched: formik.touched.unit,
          }}
        />
        <InputDentist
          required
          id="price"
          label="Giá cả"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.price,
            touched: formik.touched.price,
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddMaterial;
