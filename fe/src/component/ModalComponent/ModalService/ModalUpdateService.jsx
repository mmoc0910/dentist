import React, { useEffect, useState } from "react";
import { Modal, Skeleton } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosInstance from "../../../config/customAxios";
import { updateService } from "../../../redux/ServiceAndCategorySlice/listCategorySlice";
import { getServiceByIdAPI } from "../../../config/baseAPI";
import { regexNumber } from "../../../config/validation";
import InputDentist from "../../ui/input";

const ModalUpdateService = ({
  modalUpdateOpen,
  setModalUpdateOpen,
  isSubmitForm,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const serviceId = useSelector((state) => state.modal.serviceId);
  const [categoryServiceId, setCategoryId] = useState();

  const [oldData, setOldData] = useState();

  const [value, setValue] = useState(null);

  const validationSchema = yup.object({
    serviceName: yup
      .string("Nhập loại dịch vụ")
      .max(250, "Service không thể quá 250 ký tự.")
      .required("Service là bắt buộc."),
    unit: yup
      .string("Nhập đơn vị")
      .max(50, "Đơn vị không thể quá 50 ký tự.")
      .required("Đơn vị là bắt buộc."),
    marketPrice: yup
      .string("Nhập đơn giá")
      .matches(regexNumber, "Đơn giá không được nhập chữ, kí tự, số âm.")
      .required("Đơn giá là bắt buộc."),
    price: yup
      .string("Nhập đơn giá")
      .matches(regexNumber, "Đơn giá không được nhập chữ, kí tự, số âm.")
      .required("Đơn giá là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      unit: "",
      marketPrice: "",
      price: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.categoryServiceId = categoryServiceId;
      dispatch(updateService(values));
      setModalUpdateOpen(false);
      setTimeout(() => {
        isSubmitForm(true);
      }, 1000);
    },
  });

  const fetchService = async (serviceId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(getServiceByIdAPI + serviceId);
      formik.setValues(res.data);
      setCategoryId(res.data.categoryServiceId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    isSubmitForm(false);
  };
  useEffect(() => {
    if (serviceId) fetchService(serviceId);
  }, [serviceId]);

  return (
    <>
      <Modal
        title="Cập nhật dịch vụ"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        onCancel={() => setModalUpdateOpen(false)}
      >
        {!loading ? (
          <>
            <InputDentist
              required
              id="serviceName"
              label="Dịch vụ"
              value={formik.values.serviceName}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.serviceName,
                touched: formik.touched.serviceName,
              }}
            />

            <InputDentist
              required
              id="unit"
              label="Đơn vị"
              value={formik.values.unit}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.unit,
                touched: formik.touched.unit,
              }}
            />

            <InputDentist
              required
              id="marketPrice"
              label="Giá thị trường"
              type="number"
              value={formik.values.marketPrice}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.marketPrice,
                touched: formik.touched.marketPrice,
              }}
            />

            <InputDentist
              required
              id="price"
              label="Giá nha khoa Nguyễn Trần"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.price,
                touched: formik.touched.price,
              }}
            />
          </>
        ) : <>
        <Skeleton />
        <Skeleton />
        </>}
      </Modal>
    </>
  );
};

export default ModalUpdateService;
