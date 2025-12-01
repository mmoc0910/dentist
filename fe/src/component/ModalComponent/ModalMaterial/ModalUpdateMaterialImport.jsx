import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Modal, Skeleton } from "antd";
import { Box, TextField } from "@mui/material";
import "./../style.css";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateMaterialImport } from "../../../redux/MaterialSlice/listMaterialImportSlice";
import {
  getMaterialImportByIdAPI,
  listAllMaterialAPI,
} from "../../../config/baseAPI";
import { regexNumber, validationDate } from "../../../config/validation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment/moment";
import axiosInstance from "../../../config/customAxios";
import InputDentist from "../../ui/input";

const ModalUpdateMaterialImport = ({ modalUpdateOpen, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const materialImportId = useSelector((state) => state.modal.materialImportId);
  const [loading, setLoading] = useState();
  const [value, setValue] = useState(null);
  const [materialIds, setMaterialIds] = useState([]);
  const [materialId, setMaterialId] = useState();
  const [materialPrice, setMaterialPrice] = useState();

  const [oldData, setOldData] = useState();
  // const [unitPrice, setUnitPrice] = useState();

  const validationSchema = yup.object({
    materialName: yup
      .string("Nhập tên vật liệu")
      .max(255, "Vật liệu không thể quá 255 ký tự.")
      .required("Vật liệu là bắt buộc."),
    supplyName: yup
      .string("Nhập đơn vị cung cấp")
      .max(250, "Đơn vị cung cấp không thể quá 250 ký tự.")
      .required("Đơn vị cung cấp là bắt buộc."),
    amount: yup
      .string("Nhập số lượng")
      .matches(regexNumber, "Số lượng không được nhập chữ, kí tự, số âm.")
      .required("Số lượng là bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.date = moment(value.$d).format(validationDate);
      values.materialId = materialId;
      values.totalPrice = materialPrice;
      // values.unitPrice = unitPrice;
      dispatch(updateMaterialImport(values));
      setModalUpdateOpen(false);
    },
  });

  const fetchMaterialImport = async (materialImportId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        getMaterialImportByIdAPI + materialImportId
      );
      console.log(res.data);
      formik.setValues(res.data);
      console.log("id", res.data.materialId);
      setMaterialId(res.data.materialId);
      console.log("here: ", res.data.materialId);
      setValue(res.data.date);
      setOldData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (materialImportId > 0) fetchMaterialImport(materialImportId);
  }, [materialImportId]);

  useEffect(() => {
    const price = (formik.values.unitPrice || 0) * (formik.values.amount || 0);
    setMaterialPrice(price);
  }, [formik.values.unitPrice, formik.values.amount]);

  const loadMaterial = async () => {
    try {
      const res = await axiosInstance.get(listAllMaterialAPI);
      setMaterialIds(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadMaterial();
  }, []);

  const handleCancel = () => {
    formik.values.supplyName = oldData.supplyName;
    setValue(oldData.date);
    formik.values.amount = oldData.amount;
    formik.values.unitPrice = oldData.unitPrice;

    // formik.errors.supplyName = ""
    // formik.touched.supplyName = ""
    setModalUpdateOpen(false);
  };

  return (
    <>
      <Modal
        title="Thông Tin Vật Liệu"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        {!loading ? (
          <>
            <Box className="mb-3 text-lg">
              <p>
                Tên vật liệu :{" "}
                <span className={` font-bold`}>
                  {formik.values.materialName}
                </span>
              </p>
            </Box>
            <Box className="mb-3">
              <InputDentist
                required
                id="supplyName"
                label="Vật liệu cung cấp"
                value={formik.values.supplyName}
                onChange={formik.handleChange}
                error={{
                  message: formik.errors.supplyName,
                  touched: formik.touched.supplyName,
                }}
              />
            </Box>
            <Box className="mb-3">
              <p className={`mb-1 font-bold`}>Ngày nhập hàng:</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  placeholder="Ngày nhập hàng"
                  name="date"
                  value={value}
                  disableFuture={true}
                  onChange={(newValue) => {
                    setValue(newValue);
                    console.log(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box className="mb-3">
              <p className={`mb-1 font-bold`}>Số lượng:</p>
              <TextField
                required
                fullWidth
                id="amount"
                name="amount"
                type={"number"}
                min={0}
                autoComplete="amount"
                value={formik.values.amount}
                autoFocus
                onChange={formik.handleChange}
              />
              {formik.errors.amount && formik.touched.amount && (
                <Typography style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.amount}
                </Typography>
              )}
            </Box>
            <Box className="mb-3">
              <p className={`mb-1 font-bold`}>Đơn giá:</p>
              <TextField
                required
                fullWidth
                id="unitPrice"
                name="unitPrice"
                type={"number"}
                min={0}
                autoComplete="unitPrice"
                value={formik.values.unitPrice}
                autoFocus
                onChange={formik.handleChange}
              />
              {formik.errors.unitPrice && formik.touched.unitPrice && (
                <Typography style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.unitPrice}
                </Typography>
              )}
            </Box>
            <Box className="text-xl text-right">
              <p className="mb-0">
                Tổng tiền :{" "}
                <span className={`font-bold`}>{materialPrice} VND</span>
              </p>
            </Box>
          </>
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateMaterialImport;
