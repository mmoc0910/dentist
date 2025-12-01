import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addMaterialExport } from "../../../redux/MaterialSlice/listMaterialExportSlice";
import {
  listAllMaterialAPI,
  listAllPatientAPI,
  getMaterialExportByIdAPI,
  listPatientRecordByTreatmentIdAPI,
} from "../../../config/baseAPI";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axiosInstance from "../../../config/customAxios";
import { regexNumber } from "../../../config/validation";

const ModalAddMaterialExport = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState();
  const [materialIds, setMaterialIds] = useState([]);
  const [materialId, setMaterialId] = useState();
  const [materialPrice, setMaterialPrice] = useState();
  const [materialExportId, setMaterialExportId] = useState();
  const [unitPrice, setUnitPrice] = useState();

  const [patientIds, setPatientIds] = useState([]);
  const [patientId, setPatientId] = useState();

  const [patientRecordIds, setPatientRecordIds] = useState([]);
  const [patientRecordId, setPatientRecordId] = useState();

  const validationSchema = yup.object({
    amount: yup
      .string("Nhập số lượng")
      .matches(regexNumber, "Số lượng không được nhập chữ, kí tự, số âm.")
      .required("Số lượng là bắt buộc."),
  });

  const loadMaterial = async () => {
    try {
      const res = await axiosInstance.get(listAllMaterialAPI);
      setMaterialId(res.data[0].materialId);
      setMaterialIds(res.data);
      // isSubmitForm(false)
      setMaterialPrice(res.data[0].price);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadMaterial();
  }, []);

  const loadPatient = async () => {
    try {
      const res = await axiosInstance.get(listAllPatientAPI);
      setPatientId(res.data[0].patientId);
      setPatientIds(res.data);
      // isSubmitForm(false)
      console.log("patient", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadPatient();
  }, []);

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // values.date = moment(value.$d).format(validationDate);
      values.materialId = materialId;
      values.patientId = patientId;
      values.totalPrice = materialPrice;
      values.unitPrice = unitPrice;
      values.patientRecordId = patientRecordId;
      console.log(values);
      dispatch(addMaterialExport(values));
      setModalAddOpen(false);
      // isSubmitForm(true)
      formik.handleReset();
    },
  });

  const fetchMaterialExport = async (materialExportId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        getMaterialExportByIdAPI + materialExportId
      );
      console.log(res.data);
      formik.setValues(res.data);
      console.log("id", res.data.materialId);
      setPatientRecordId(res.data.patientRecordId);
      setMaterialExportId(res.data.materialExportId);
      console.log("day roi: ", res.data.patientRecordId);
      setValue(res.data.date);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (materialExportId > 0) fetchMaterialExport(materialExportId);
  }, [materialExportId]);

  const loadRecordByTreatmentId = async (patientId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        listPatientRecordByTreatmentIdAPI + patientId
      );
      //  setPatientRecordId(res.data[0].patientId)
      setPatientRecordId(res.data[0].patientRecordId);
      setPatientRecordIds(res.data);
      console.log("kiem tra", res.data);
      console.log("data here:", res.data.reason);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId > 0) loadRecordByTreatmentId(patientId);
  }, [patientId]);

  useEffect(() => {
    const price =
      materialIds?.filter((e) => e.materialId === materialId)[0]?.price *
      (formik.values.amount || 0);

    setMaterialPrice(price);
  }, [materialId, formik.values.amount]);

  useEffect(() => {
    const unitPrice = materialIds?.filter((e) => e.materialId === materialId)[0]
      ?.price;

    setUnitPrice(unitPrice);
  }, [materialId]);

  const handleCancel = () => {
    setModalAddOpen(false);
    // setMaterialId(1)
    // setMaterialExportId(1)
    // setPatientId(1)
    formik.resetForm();
  };
  return (
    <>
      <Modal
        title="Thêm vật liệu xuất khẩu"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <Box>
          <FormControl fullWidth>
            <InputLabel id="material">Vật liệu</InputLabel>
            <Select
              style={{ width: "100%", height: "10%" }}
              labelId="material"
              id="materialSelect"
              label="Vật liệu"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
            >
              {materialIds?.map((item) => (
                <MenuItem key={item.materialId} value={item.materialId}>
                  {item.materialName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <FormControl fullWidth>
            <InputLabel id="patient">Bệnh nhân</InputLabel>
            <Select
              style={{ width: "100%", height: "10%" }}
              labelId="patient"
              id="patientSelect"
              label="Bệnh nhân"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              {patientIds?.map((item) => (
                <MenuItem key={item.patientId} value={item.patientId}>
                  {item.patientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <FormControl fullWidth>
            <InputLabel id="patientrecord">Date record</InputLabel>
            <Select
              style={{ width: "100%", height: "10%" }}
              labelId="patientrecord"
              id="patientrecordSelect"
              label="Date record"
              value={patientRecordId}
              onChange={(e) => setPatientRecordId(e.target.value)}
            >
              {patientRecordIds?.map((item) => (
                <MenuItem
                  key={item.patientRecordId}
                  value={item.patientRecordId}
                >
                  {item.date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          margin="normal"
          required
          fullWidth
          id="amount"
          label="Số lương"
          name="amount"
          autoComplete="amount"
          value={formik.values.amount}
          autoFocus
          onChange={formik.handleChange}
        />
        {formik.errors.amount && formik.touched.amount && (
          <Typography style={{ color: "red" }}>
            {formik.errors.amount}
          </Typography>
        )}
        <TextField
          margin="normal"
          required
          disabled
          fullWidth
          id="unitPrice"
          label="Đơn giá"
          name="unitPrice"
          autoComplete="unitPrice"
          value={unitPrice}
          autoFocus
          onChange={formik.handleChange}
        />
        <TextField
          margin="normal"
          required
          disabled
          fullWidth
          id="totalPrice"
          label="Tổng giá"
          name="totalPrice"
          autoComplete="totalPrice"
          value={materialPrice}
          autoFocus
          onChange={formik.handleChange}
        />
      </Modal>
    </>
  );
};

export default ModalAddMaterialExport;
