import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Modal, Skeleton } from "antd";
import { TextField, useStepContext } from "@mui/material";
import "./../style.css";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as yup from "yup";
import { regexPhone } from "../../../config/validation";
import { updateLabo } from "../../../redux/LaboSlice/listLaboSlice";
import { getLaboByIdAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import InputDentist from "../../ui/input";

const ModalUpdateLabo = ({ isShow, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const laboId = useSelector((state) => state.modal.laboId);
  const [loading, setLoading] = useState();
  const [value, setValue] = useState(null);

  const [oldData, setOldData] = useState();

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
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(updateLabo(values));
      setModalUpdateOpen(false);
    },
  });

  const fetchLabo = async (laboId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(getLaboByIdAPI + laboId);
      formik.setValues(res.data);
      setOldData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (laboId && isShow) {
      fetchLabo(laboId);
    }
  }, [laboId, isShow]);

  const disabledBtnOk = useMemo(() => {
    return (
      formik.values?.laboName === oldData?.laboName &&
      formik.values?.phone === oldData?.phone
    );
  }, [formik.values]);

  const handleCancel = () => {
    formik.values.laboName = oldData.laboName;
    formik.values.phone = oldData.phone;

    // formik.errors.laboName = ""
    // formik.touched.laboName = ""

    // formik.errors.phone = ""
    // formik.touched.phone = ""

    setModalUpdateOpen(false);
  };

  return (
    <>
      <Modal
        title="Thông tin Labo"
        open={isShow}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
        okButtonProps={{ disabled: disabledBtnOk }}
      >
        {!loading ? (
          <>
            <InputDentist
              required
              isEdit
              id="laboName"
              label="Labo"
              name="laboName"
              value={formik.values.laboName}
              onChange={formik.handleChange}
            />
            {formik.errors.laboName && formik.touched.laboName && (
              <Typography style={{ color: "red" }}>
                {formik.errors.laboName}
              </Typography>
            )}
            <InputDentist
              required
              isEdit
              id="phone"
              label="Số điện thoại"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {formik.errors.phone && formik.touched.phone && (
              <Typography style={{ color: "red" }}>
                {formik.errors.phone}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Skeleton />
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateLabo;
