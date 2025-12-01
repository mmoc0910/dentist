import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "antd/dist/antd.css";
import { Modal } from "antd";
import "./../style.css";
import { useFormik } from "formik";
import { reportSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";

import InputDentist from "../../ui/input";
import * as yup from "yup";

const ModalReportSpecimen = ({ isShow, setIsShow, submit, specimenId }) => {
  const dispatch = useDispatch();
  // const specimenId = useSelector(state => state.modal.specimenId);
  const validationSchema = yup.object({
    description: yup
      .string("Nhập nguyên nhân lỗi")
      .required("Vui lòng nhập nguyên nhân lỗi"),
  });
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(reportSpecimen(specimenId, values));
      formik.handleReset();
      setIsShow(false);
      submit(true)
    },
  });

  return (
    <>
      <Modal
        title="Báo cáo lỗi mẫu vật"
        open={isShow}
        onOk={formik.handleSubmit}
        onCancel={() => {
          setIsShow(false);
          formik.handleReset();
        }}
      >
        <InputDentist
          required
          id="description"
          label="Nguyên nhân mẫu lỗi"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={{
            message: formik.errors.description,
            touched: formik.touched.description,
          }}
        />
      </Modal>
    </>
  );
};

export default ModalReportSpecimen;
