import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
import { Modal, Skeleton } from "antd";
import { TextField, Button, Chip } from "@mui/material";
import "./../style.css";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { updateSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";
import {
  getSpecimensByIdAPI,
  listAllPatientAPI,
  listPatientRecordByTreatmentIdAPI,
  getAllLaboAPI,
  listTreatingServiceAPI,
  useSpecimenAPI,
} from "../../../config/baseAPI";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axiosInstance from "../../../config/customAxios";
import { regexNumber, validationDate } from "../../../config/validation";
import * as yup from "yup";
import moment from "moment/moment";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModalReportSpecimen from "./ModalReportSpecimen";
import { setSpecimenId } from "../../../redux/modalSlice";
import InputDentist from "../../ui/input";
import { statusLaboColor, statusLaboFormatter } from "../../style-config";
import { toast } from "react-toastify";
import { toastCss } from "../../../redux/toastCss";
import Loading from "../../ui/Loading";

const ModalUpdateSpecimens = ({ modalUpdateOpen, setModalUpdateOpen }) => {
  const dispatch = useDispatch();
  const specimenId = useSelector((state) => state.modal.specimenId);
  const [loading, setLoading] = useState();
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

  const [buttonUseEnable, setButtonUseEnable] = useState(false);
  const [buttonReportEnable, setButtonReportEnable] = useState(false);

  const [statusStr, setStatusStr] = useState(0);

  const validationSchema = yup.object({
    specimenName: yup
      .string("Enter amount")
      .required("Your amount is required"),

    amount: yup
      .string("Enter amount")
      .matches(regexNumber, "Only number or positive number")
      .required("Your amount is required"),
    unitPrice: yup
      .string("Enter amount")
      .matches(regexNumber, "Only number or positive number")
      .required("Your amount is required"),
  });

  const loadPatient = async () => {
    try {
      const res = await axiosInstance.get(listAllPatientAPI);
      setPatientIds(res.data);
      setPatientId(res.data[0].patientId);
    } catch (error) {
      console.log(error);
    }
  };

  const loadLabos = async () => {
    try {
      const res = await axiosInstance.get(getAllLaboAPI);
      console.log("update labos = ", res.data);
      setLabos(res.data);
      setLaboId(res.data[0].laboId);
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
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (
        !deliveryDate ||
        !receiveDate ||
        moment(receiveDate.$d || receiveDate).diff(
          deliveryDate.$d || deliveryDate,
          "minutes"
        ) < 0
      ) {
        if (receiveDate !== null) {
          values.receiveDate = moment(receiveDate.$d || receiveDate).format(
            validationDate
          );
        } else {
          values.receiveDate = null;
        }
        if (deliveryDate !== null) {
          values.deliveryDate = moment(deliveryDate.$d || deliveryDate).format(
            validationDate
          );
        } else {
          values.deliveryDate = null;
        }
        values.patientId = patientId;
        values.laboId = laboId;
        values.patientRecordId = patientRecordId;
        values.serviceId = serviceId;
        setDeliveryDate(null);
        setReceiveDate(null);
        dispatch(updateSpecimen(values));
        // loadSpecimenList();
        setModalUpdateOpen(false);
        return;
      }
      toast.error("Ngày nhận phải sau ngày giao !!", toastCss);
    },
  });

  const fetchSpecimens = async (specimenId) => {
    try {
      const res_specimen = await axiosInstance.get(
        getSpecimensByIdAPI + specimenId
      );
      formik.setValues(res_specimen.data);
      setPatientId(res_specimen.data.patientId);
      setPatientRecordId(res_specimen.data.patientRecordId);
      setServiceId(res_specimen.data.serviceId);
      setLaboId(res_specimen.data.laboId);
      setReceiveDate(res_specimen.data.receiveDate);
      setDeliveryDate(res_specimen.data.deliveryDate);
      setButtonReportEnable(res_specimen.data.buttonReportEnable);
      setButtonUseEnable(res_specimen.data.buttonUseEnable);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (specimenId && modalUpdateOpen) fetchSpecimens(specimenId);
  }, [specimenId, modalUpdateOpen]);

  const loadRecordByTreatmentId = async (patientId) => {
    try {
      setLoading(true);
      const res_record = await axiosInstance.get(
        listPatientRecordByTreatmentIdAPI + patientId
      );
      await axiosInstance
        .get(listTreatingServiceAPI + patientId)
        .then((res) => {
          setServices(res.data);
          setServiceId(res.data[0].serviceId);
        });
      setPatientRecordIds(res_record.data);
      setPatientRecordId(res_record.data[0].patientRecordId);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (patientId && modalUpdateOpen) {
      loadRecordByTreatmentId(patientId);
    }
  }, [patientId, modalUpdateOpen]);

  useEffect(() => {
    if (receiveDate === null && deliveryDate === null) {
      setStatusStr(1);
    } else if (receiveDate !== null && deliveryDate === null) {
      setStatusStr(2);
    } else if (receiveDate !== null && deliveryDate !== null) {
      setStatusStr(3);
    } else {
      setStatusStr(1);
    }
  }, [receiveDate, deliveryDate]);

  useEffect(() => {
    if (!receiveDate) setDeliveryDate(null);
  }, [receiveDate]);

  const patientName = useMemo(() => {
    return patientIds.find((item) => item.patientId === patientId)?.patientName;
  }, [patientIds]);

  const dateRender = useMemo(() => {
    return patientRecordIds.find(
      (item) => item.patientRecordId === patientRecordId
    )?.date;
  }, [patientRecordIds]);

  const serviceNameRender = useMemo(() => {
    return services.find((item) => item.serviceId === serviceId)?.serviceName;
  }, [services]);

  return (
    <>
      <Modal
        title="Cập nhật mẫu thử nghiệm"
        open={modalUpdateOpen}
        onOk={formik.handleSubmit}
        onCancel={() => setModalUpdateOpen(false)}
      >
        {!loading ? (
          <>
            <Box>
              <p className="text-lg">
                Bệnh nhân:{" "}
                <span className="font-bold text-base">{patientName}</span>
              </p>
            </Box>
            <Box>
              <p className="text-lg">
                Ngày khám:{" "}
                <span className="font-bold text-base">{dateRender}</span>
              </p>
            </Box>
            <Box>
              <p className="text-lg">
                Dịch vụ:{" "}
                <span className="font-bold text-base">{serviceNameRender}</span>
              </p>
            </Box>

            <InputDentist
              id="specimenName"
              required
              label="Mẫu thử nghiệm:"
              value={formik.values.specimenName}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.specimenName,
                touched: formik.touched.specimenName,
              }}
            />

            <InputDentist
              id="amount"
              required
              label="Số lượng:"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.amount,
                touched: formik.touched.amount,
              }}
            />
            <InputDentist
              id="unitPrice"
              required
              label="Đơn giá:"
              value={formik.values.unitPrice}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.unitPrice,
                touched: formik.touched.unitPrice,
              }}
            />
            <Box class="mb-3">
              <p className={`mb-1 font-bold`}>Labo</p>
              <FormControl fullWidth>
                <Select
                  id="laboSelect"
                  value={laboId}
                  fullWidth
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

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <p className={`mb-1 font-bold`}>Ngày labo nhận</p>
              <DatePicker
                name="receiveDate"
                className="mb-3"
                inputFormat="DD/MM/YYYY"
                value={receiveDate}
                onChange={(newValue) => {
                  setReceiveDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <p className={`mb-1 font-bold`}>Ngày labo giao</p>
              <DatePicker
                name="deliveryDate"
                className="mb-3"
                inputFormat="DD/MM/YYYY"
                value={deliveryDate}
                disabled={!receiveDate}
                onChange={(newValue) => {
                  setDeliveryDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <Box className="">
              <p className={`mb-1 mr-3 font-bold`}>
                Trạng thái:
                <Chip
                  className="font-normal ml-3"
                  size="medium"
                  style={{
                    backgroundColor: `${statusLaboColor(statusStr)}`,
                    color: "#fff",
                  }}
                  label={statusLaboFormatter(statusStr)}
                />
              </p>
            </Box>
          </>
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}

        {/* </>} */}
      </Modal>
    </>
  );
};

export default ModalUpdateSpecimens;
