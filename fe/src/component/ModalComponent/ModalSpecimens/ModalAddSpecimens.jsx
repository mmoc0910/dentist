import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axiosInstance from "../../../config/customAxios";
import { addSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";
import {
  listAllPatientAPI,
  listPatientRecordByTreatmentIdAPI,
  listTreatingServiceAPI,
  getAllLaboAPI,
} from "../../../config/baseAPI";
import { regexNumber, validationDate } from "../../../config/validation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import moment from "moment/moment";

const ModalAddSpecimens = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  // const laboId = useSelector(state => state.modal.laboId);

  const [patientIds, setPatientIds] = useState([]);
  const [patientId, setPatientId] = useState();

  const [patientRecordIds, setPatientRecordIds] = useState([]);
  const [patientRecordId, setPatientRecordId] = useState();

  const [receiveDate, setReceiveDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [serviceId, setServiceId] = useState(null);
  const [services, setServices] = useState([]);
  const [labos, setLabos] = useState([]);
  const [laboId, setLaboId] = useState(null);

  const [statusStr, setStatusStr] = useState("");

  const validationSchema = yup.object({
    // specimenName: yup
    //     .string('Enter specimenName')
    //     .required('Your specimenName is required'),
    // amount: yup
    //     .string('Enter amount')
    //     .matches(regexNumber, "Only number or positive number")
    //     .required('Your amount is required'),
    // unitPrice: yup
    //     .string('Enter unitPrice')
    //     .matches(regexNumber, "Only number or positive number")
    //     .required('Your unitPrice is required'),
  });

  const loadPatient = async () => {
    try {
      const res = await axiosInstance.get(listAllPatientAPI);
      setPatientId(res.data[0].patientId);
      setPatientIds(res.data);
      console.log("add patient", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadLabos = async () => {
    try {
      const res = await axiosInstance.get(getAllLaboAPI);
      setLabos(res.data);
      setLaboId(res.data[0].laboId);
      console.log("add labos", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPatient();
    loadLabos();
  }, []);

  const formik = useFormik({
    initialValues: {
      specimenName: "",
      amount: "",
      unitPrice: "",
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      if (receiveDate !== null) {
        values.receiveDate = moment(receiveDate.$d).format(validationDate);
      }
      if (deliveryDate !== null) {
        values.deliveryDate = moment(deliveryDate.$d).format(validationDate);
      }
      values.patientId = patientId;
      values.laboId = laboId;
      values.patientRecordId = patientRecordId;
      values.serviceId = serviceId;

      dispatch(addSpecimen(values));
      setModalAddOpen(false);
      setReceiveDate(null);
      setDeliveryDate(null);
      formik.handleReset();
    },
  });

  // useEffect(() => {
  //     setLoading(true)
  //     dispatch(fetchAllSpecimens(detailLabo));
  //     setLoading(false)
  // }, [isDeleteSpecimens, isUpdateSpecimens, isAddSpecimens])

  // const fetchSpecimens = async (specimenId) => {
  //     setLoading(true)
  //     try {
  //         const res = await axiosInstance.get(
  //             getSpecimensByIdAPI + specimenId,
  //         )
  //         console.log(res.data)
  //         formik.setValues(res.data)
  //         console.log('id', res.data.specimenName)
  //         setPatientRecordId(res.data.patientRecordId)
  //         // setMaterialId(res.data.materialId)
  //         console.log('day roi: ', res.data.patientRecordId)
  //         setReceiveDate(res.data.receiveDate)
  //         setDeliveryDate(res.data.deliveryDate)
  //         setValue(res.data.dateRecord)
  //     } catch (error) {
  //         console.log(error)
  //     }
  //     setLoading(false)
  // }

  // useEffect(() => {
  //     if (specimenId > 0)
  //         fetchSpecimens(specimenId)
  // }, [specimenId])

  const loadRecordByTreatmentId = async (patientId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        listPatientRecordByTreatmentIdAPI + patientId
      );
      setPatientRecordId(res.data[0].patientRecordId);
      setPatientRecordIds(res.data);
      console.log("add record = ", res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const loadServiceByPatientId = async (patientId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(listTreatingServiceAPI + patientId);
      setServiceId(res.data[0].serviceId);
      setServices(res.data);
      console.log("add service = ", res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId > 0) {
      loadRecordByTreatmentId(patientId);
      loadServiceByPatientId(patientId);
    }
  }, [patientId]);

  useEffect(() => {
    if (receiveDate === null && deliveryDate === null) {
      setStatusStr("Chuẩn bị mẫu vật");
    } else if (receiveDate !== null && deliveryDate === null) {
      setStatusStr("Labo nhận mẫu");
    } else if (receiveDate !== null && deliveryDate !== null) {
      setStatusStr("Labo giao mẫu");
    }
  }, [receiveDate, deliveryDate]);

  return (
    <>
      <Modal
        title="Thêm mẫu vật"
        open={modalAddOpen}
        onOk={formik.handleSubmit}
        onCancel={() => setModalAddOpen(false)}
      >
        {/* {loading === false && <> */}

        <TextField
          margin="normal"
          required
          fullWidth
          id="specimenName"
          label="Tên mẫu vật"
          name="specimenName"
          autoComplete="specimenName"
          value={formik.values.specimenName}
          autoFocus
          onChange={formik.handleChange}
        />
        {formik.errors.specimenName && formik.touched.specimenName && (
          <Typography style={{ color: "red" }}>
            {formik.errors.specimenName}
          </Typography>
        )}

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="patient">Bệnh nhân</InputLabel>
            <Select
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

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="patientrecord">Date record</InputLabel>
            <Select
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
          label="Số lượng"
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
          fullWidth
          id="unitPrice"
          label="Đơn giá"
          name="unitPrice"
          autoComplete="unitPrice"
          value={formik.values.unitPrice}
          autoFocus
          onChange={formik.handleChange}
        />
        {formik.errors.unitPrice && formik.touched.unitPrice && (
          <Typography style={{ color: "red" }}>
            {formik.errors.unitPrice}
          </Typography>
        )}
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Ngày nhận"
            name="receiveDate"
            value={receiveDate}
            onChange={(newValue) => {
              setReceiveDate(newValue);
              console.log(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Ngày giao"
            name="birthdate"
            value={deliveryDate}
            onChange={(newValue) => {
              setDeliveryDate(newValue);
              console.log(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="service">Dịch vụ</InputLabel>
            <Select
              labelId="service"
              id="serviceSelect"
              label="Dịch vụ"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              {services?.map((item) => (
                <MenuItem key={item.serviceId} value={item.serviceId}>
                  {item.serviceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="labo">Labo</InputLabel>
            <Select
              labelId="labo"
              id="laboSelect"
              label="Labo"
              value={laboId}
              onChange={(e) => setLaboId(e.target.value)}
            >
              {labos?.map((item) => (
                <MenuItem key={item.laboId} value={item.laboId}>
                  {item.laboName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          margin="normal"
          fullWidth
          label="Trạng thái"
          value={statusStr}
          autoFocus
          disabled={true}
        />
        {/* </>} */}
      </Modal>
    </>
  );
};

export default ModalAddSpecimens;
