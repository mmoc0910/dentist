import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Modal, Skeleton } from "antd";
import { TextField } from "@mui/material";
import "./../style.css";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateMaterial } from "../../../redux/MaterialSlice/listMaterialSlice";
import { getMaterialByIdAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { regexNumber } from "../../../config/validation";
import InputDentist from "../../ui/input";

const ModalUpdateMaterial = ({ modalUpdateOpen, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const materialId = useSelector((state) => state.modal.materialId);
  const [loading, setLoading] = useState();
  const [value, setValue] = useState(null);
  const [oldData, setOldData] = useState();

  const validationSchema = yup.object({
    materialName: yup
      .string("Nhập tên vật liệu")
      .max(255, "Vật liệu không thể quá 255 ký tự.")
      .required("Vật liệu là bắt buộc."),
    unit: yup
      .string("Nhập đơn vị")
      .max(45, "Đơn vị không thể quá 45 ký tự.")
      .required("Đơn vị là bắt buộc."),
    amount: yup
      .string("Nhập số lượng")
      .matches(regexNumber, "Số lượng không được nhập chữ, kí tự, số âm.")
      .required("Số lượng là bắt buộc."),
    price: yup
      .string("Nhập đơn giá")
      .matches(regexNumber, "Đơn giá không được nhập chữ, kí tự, số âm.")
      .required("Đơn giá là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(updateMaterial(values));
      setModalUpdateOpen(false);
    },
  });

  const fetchMaterial = async (materialId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(getMaterialByIdAPI + materialId);
      formik.setValues(res.data);
      setOldData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (materialId > 0) fetchMaterial(materialId);
  }, [materialId]);

  const handleCancel = () => {
    formik.values.materialName = oldData.materialName;
    formik.values.unit = oldData.unit;
    formik.values.amount = oldData.amount;
    formik.values.price = oldData.price;

    // formik.errors.materialName = ""
    // formik.touched.materialName = ""

    // formik.errors.unit = ""
    // formik.touched.unit = ""

    // formik.errors.amount = ""
    // formik.touched.amount = ""

    // formik.errors.price = ""
    // formik.touched.price = ""
    setModalUpdateOpen(false);
  };

  return (
    <>
      <Modal
        title="Cập Nhật Vật Liệu"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        {!loading ? (
          <>
            <InputDentist
              required
              id="materialName"
              label="Vật liệu"
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
              value={formik.values.unit}
              error={{
                message: formik.errors.unit,
                touched: formik.touched.unit,
              }}
              onChange={formik.handleChange}
            />

            <InputDentist
              required
              id="price"
              label="Giá cả"
              autoComplete="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.price,
                touched: formik.touched.price,
              }}
            />
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

export default ModalUpdateMaterial;
