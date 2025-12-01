import React, { useEffect, useMemo, useState } from "react";
import { Modal, Skeleton } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateCategory } from "../../../redux/ServiceAndCategorySlice/listCategorySlice";
import { getCategoryByIdAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import InputDentist from "../../ui/input";

const ModalUpdateCategory = ({ modalUpdateOpen, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const categoryServiceId = useSelector(
    (state) => state.modal.categoryServiceId
  );
  const [loading, setLoading] = useState();
  const [nameOriginCategory, setNameOriginCategory] = useState("");

  const validationSchema = yup.object({
    categoryServiceName: yup
      .string("Nhập category")
      .max(250, "Category không thể quá 250 ký tự.")
      .required("Category là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(updateCategory(values));
      setModalUpdateOpen(false);
    },
  });
  const fetchCategory = async (categoryServiceId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        getCategoryByIdAPI + categoryServiceId
      );
      setLoading(false);
      formik.setValues(res.data);
      setNameOriginCategory(res.data.categoryServiceName);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (categoryServiceId && modalUpdateOpen) {
      fetchCategory(categoryServiceId);
    }
  }, [categoryServiceId, modalUpdateOpen]);

  const disabledBtnOk = useMemo(() => {
    return formik.values?.categoryServiceName === nameOriginCategory;
  }, [formik.values]);

  return (
    <>
      <Modal
        title="Cập nhật loại dịch vụ"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        okButtonProps={{ disabled: disabledBtnOk }}
        onCancel={() => setModalUpdateOpen(false)}
      >
        {!loading ? (
          <InputDentist
            required
            id="categoryServiceName"
            label="Loại dịch vụ"
            isEdit
            value={formik.values.categoryServiceName}
            onChange={formik.handleChange}
            error={{
              message: formik.errors.categoryServiceName,
              touched: formik.touched.categoryServiceName,
            }}
          />
        ) : (
          <>
            <Skeleton />
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateCategory;
