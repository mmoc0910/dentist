import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addService } from "../../../redux/ServiceAndCategorySlice/listCategorySlice";
import axiosInstance from "../../../config/customAxios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { listAllCategoryAPI } from "../../../config/baseAPI";
import { regexNumber } from "../../../config/validation";
import InputDentist from "../../ui/input";

const ModalAddService = ({
  modalAddOpen,
  setModalAddOpen,
  isSubmitForm,
  listCategoryService,
  categoryServiceId,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);

  const [categoryServiceIds, setCategoryServiceIds] = useState([]);
  //   const [categoryServiceId, setCategoryServiceId] = useState();

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

  //   const loadCategory = async () => {
  //     try {
  //       const res = await axiosInstance.get(listAllCategoryAPI);
  //     //   setCategoryServiceId(res.data[0].categoryServiceId);
  //       setCategoryServiceIds(res.data);
  //       isSubmitForm(false);
  //       console.log("lam on ra kqua di: ", res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     loadCategory();
  //   }, []);

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
      dispatch(addService(values));
      setModalAddOpen(false);
      isSubmitForm(true);
      formik.handleReset();
    },
  });

  const handleCancel = () => {
    setModalAddOpen(false);
    // setCategoryServiceId(1);

    // formik.errors.serviceName = ""
    // formik.touched.serviceName = ""

    // formik.errors.unit = ""
    // formik.touched.unit = ""

    // formik.errors.marketPrice = ""
    // formik.touched.marketPrice = ""

    // formik.errors.price = ""
    // formik.touched.price = ""

    formik.resetForm();
  };

  const getNameCategory = useMemo(() => {
    return (
      listCategoryService.find(
        (item) => item.categoryServiceId === categoryServiceId
      )?.categoryServiceName || ""
    );
  }, [categoryServiceId, listCategoryService]);

  return (
    <>
      <Modal
        title={`${getNameCategory}`}
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <Box sx={{ p: 0 }}>
          {/* <FormControl fullWidth>
            <InputLabel id="material">Category</InputLabel>

            <Select
              labelId="material"
              id="materialSelect"
              label="Vật liệu"
              value={categoryServiceId}
              style={{ padding: "25px 0", paddingRight: "10px", width: "100%" }}
              onChange={(e) => setCategoryServiceId(e.target.value)}
            >
              {categoryServiceIds?.map((item) => (
                <MenuItem
                  key={item.categoryServiceId}
                  value={item.categoryServiceId}
                >
                  {item.categoryServiceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Box>
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
      </Modal>
    </>
  );
};

export default ModalAddService;
