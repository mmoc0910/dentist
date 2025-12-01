import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addCategory } from "../../../redux/ServiceAndCategorySlice/listCategorySlice";
import InputDentist from "../../ui/input";

const ModalAddCategory = ({
  modalAddCategoryOpen,
  setModalAddCategoryOpen,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);

  const validationSchema = yup.object({
    categoryServiceName: yup
      .string("Nhập category")
      .max(250, "Loại dịch vụ không thể quá 250 ký tự.")
      .required("Loại dịch vụ là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      categoryServiceName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addCategory(values));
      setModalAddCategoryOpen(false);
      formik.handleReset();
    },
  });

  const handleCancel = () => {
    setModalAddCategoryOpen(false);

    // formik.errors.categoryServiceName = ""
    // formik.touched.categoryServiceName = ""
    formik.resetForm();
  };

  return (
    <>
      <Modal
        title="Thêm loại dịch vụ"
        open={modalAddCategoryOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <InputDentist
          required
          id="categoryServiceName"
          label="Loại dịch vụ"
          value={formik.values.categoryServiceName}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.categoryServiceName,
            touched: formik.touched.categoryServiceName,
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddCategory;
