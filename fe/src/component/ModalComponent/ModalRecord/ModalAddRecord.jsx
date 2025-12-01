import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Modal } from "antd";
import { useState, useMemo } from "react";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import axiosInstance from "../../../config/customAxios";
import { useParams } from "react-router-dom";
import {
  listAllServiceAPI,
  listTreatingServiceAPI,
} from "../../../config/baseAPI";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SellIcon from "@mui/icons-material/Sell";
import ClearIcon from "@mui/icons-material/Clear";
import * as yup from "yup";
import { validationDate } from "../../../config/validation";
import moment from "moment";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import ModalExportMaterial from "./ModalExportMaterial";
import ModalSpecimen from "./ModalSpecimen";
import { addAndUpdateRecord } from "../../../redux/RecordSlice/listRecordSlice";
import { fetchRecord } from "../../../redux/RecordSlice/listRecordSlice";
import InputDentist from "../../ui/input";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import "./style.css";
import _ from "lodash";
import Loading from "../../ui/Loading";
import SockJsClient from "react-stomp";
import { setLoading } from "../../../redux/PatienSlice/listPatientSlice";

const ModalAddRecord = ({
  modalAddOpen,
  setModalAddOpen,
  isEditRecord = false,
}) => {
  const dispatch = useDispatch();
  const valueDate = moment().format(validationDate);
  const { id } = useParams();
  const [listTreatingService, setListTreatingService] = useState([]);

  const [serviceId, setServiceId] = useState();
  const [errorUpdateMess, setErrorUpdateMess] = useState("");
  const [serviceIds, setServiceIds] = useState([]);
  const [originListService, setOriginListService] = useState([]);
  const [showModalExportMaterial, setShowModalExportMaterial] = useState(0);
  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [modalSpecimenOpen, setModalSpecimenOpen] = useState(false);
  const listRecord = useSelector((state) => state.listRecord.listRecord);
  const infoRecord = useSelector((state) => state.listRecord.infoRecord);
  const listService = useSelector((state) => state.listRecord.listService);

  const [showConfirm, setShowConfirm] = useState(-1);
  const [isEdit, setEdit] = useState(false);
  const [refSocket, setRefSocket] = useState(null);

  const recordId = useSelector((state) => state.modal.recordSelected);
  const treatmentId = useSelector((state) => state.listRecord.treatmentId);
  const loading = useSelector((state) => state.listRecord.loading);

  const [rows, setRows] = useState([]);
  const [countRow, setCountRow] = useState({
    statusCount: "up",
    value: 0,
  });
  const [serviceDTOS, setServiceDTOS] = useState([]);

  const [materialExportDTOS, setMaterialExportDTOS] = useState([]);
  const [specimenDTOS, setSpecimenDTOS] = useState([]);
  const [loading2, setLoading2] = useState(false);

  const validationSchema = yup.object({
    reason: yup
      .string("Nhập lý do đến khám")
      .max(250, "Lý do đến khám không được quá 250 ký tự.")
      .required("Lý do đến khám là bắt buộc"),
    diagnostic: yup.string("Nhập chẩn đoán").required("Chẩn đoán là bắt buộc."),
    causal: yup
      .string("Nhập nguyên nhân")
      .max(250, "Nguyên nhân không được quá 250 ký tự.")
      .required("Nguyên nhân là bắt buộc."),
    marrowRecord: yup
      .string("Nhập lưu ý về tủy")
      .max(250, "Lưu ý về tuỷ không được quá 250 ký tự.")
      .required("Lưu ý về tuỷ là bắt buộc."),
    treatment: yup
      .string("Nhập điều trị")
      .max(250, "Điều trị không được quá 250 ký tự.")
      .required("Điều trị là bắt buộc."),
  });

  const loadServiceOption = async () => {
    try {
      setLoading2(true);
      const res = await axiosInstance.get(listAllServiceAPI);
      setOriginListService(res.data);
      setServiceIds(res.data);
      setLoading2(false);
    } catch (error) {
      console.log(error);
      setLoading2(false);
    }
  };

  useEffect(() => {
    if (modalAddOpen) {
      loadServiceOption();
      setSpecimenDTOS([]);
      setMaterialExportDTOS([]);
      if (isEditRecord) {
        dispatch(fetchRecord(recordId));
      } else {
        getServiceTreating(id);
      }
    }
  }, [modalAddOpen]);

  useEffect(() => {
    if (isEditRecord && listRecord) {
      const exsistSpecimen = listRecord.specimensDTOS.map((item) => ({
        ...item,
        statusChange: "edit",
      }));
      const exsistMaterial = listRecord.materialExportDTOS.map((item) => ({
        ...item,
        statusChange: "edit",
      }));
      setSpecimenDTOS(exsistSpecimen);
      setMaterialExportDTOS(exsistMaterial);
      return;
    }
    setMaterialExportDTOS([]);
    setSpecimenDTOS([]);
  }, [listRecord]);

  useEffect(() => {
    if (rows.length + listTreatingService.length) {
      setErrorUpdateMess("");
    }
    const dataServiceTreating = originListService.filter(
      (item) =>
        !formatToDTOS(listTreatingService, rows)
          .map((item_service) => item_service.serviceId)
          .includes(item.serviceId)
    );
    setServiceIds(dataServiceTreating);
    setServiceDTOS(formatToDTOS(listTreatingService, rows));
    setEdit(true);
  }, [rows, listTreatingService]);

  const handleExportMaterial = (material) => {
    setMaterialExportDTOS(material);
  };

  const handleSpecimen = (specimen) => {
    setSpecimenDTOS(specimen);
  };

  const disableAddSpecimen = useMemo(() => {
    if (!rows.length && !listTreatingService.length) {
      return false;
    }
    let flagCheckRow = rows.some((item) => item.status === 1);
    const flagCheckTreatingService = listTreatingService.some(
      (item) => item.status === 1
    );
    return flagCheckRow || flagCheckTreatingService;
  }, [rows, listTreatingService]);

  useEffect(() => {
    if (modalAddOpen) {
      formik.setValues(infoRecord);
    }
  }, [infoRecord]);

  const formik = useFormik({
    initialValues: {
      reason: "",
      diagnostic: "",
      causal: "",
      marrowRecord: "",
      note: "",
      treatment: "",
      prescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!rows.length && !listTreatingService.length) {
        setErrorUpdateMess("Vui lòng thêm dịch vụ!");
        return;
      }
      const flagCheckPrice = rows.some((item) => +item.price < +item.discount);
      if (flagCheckPrice) {
        return;
      }
      const formatValue = { ...values };
      const listA = listTreatingService.filter((a) => {
        return Object.keys(a)?.length !== 0;
      });
      const listB = rows.filter((a) => {
        return Object.keys(a)?.length !== 0;
      });
      if (isEditRecord) {
        formatValue.patientRecordId = recordId;
        formatValue.treatmentId = treatmentId;
      }
      formatValue.materialExportDTOS = materialExportDTOS;
      formatValue.serviceDTOS = listA.concat(listB);
      formatValue.specimensDTOS = specimenDTOS;
      formatValue.date = valueDate;

      const addValue = {
        id: isEditRecord ? recordId : id,
        values: formatValue,
      };
      await dispatch(
        addAndUpdateRecord({
          payload: addValue,
          type: isEditRecord ? "edit" : "add",
        })
      );
      setRows([]);
      setCountRow({
        statusCount: "up",
        value: 0,
      });
      setModalAddOpen(false);
      formik.handleReset();

      refSocket.sendMessage(
        "/topic/group",
        JSON.stringify({ message: "re-fetch" })
      );
      refSocket.sendMessage(
        "/topic/group",
        JSON.stringify({ message: "re-fetch-bill" })
      );
      refSocket.sendMessage(
        "/topic/Receptionist",
        JSON.stringify({ message: "re-fetch-noti" })
      );
    },
  });

  const formatToDTOS = (listTreatingService, rows) => {
    let listA = [];
    let listB = [];
    listA = listTreatingService.filter((a) => {
      return Object.keys(a)?.length !== 0;
    });
    listB = rows?.filter((a) => {
      if (a) {
        return Object.keys(a).length !== 0;
      }
      return null;
    });
    return listA.concat(listB);
  };

  useEffect(() => {
    if (countRow.value && countRow.statusCount === "up") {
      const serviceInfo = serviceIds[0];
      setRows((prev) => {
        prev[countRow.value - 1] = {
          ...prev[countRow.value - 1],
          ...serviceInfo,
        };
        prev[countRow.value - 1].amount = 1;
        prev[countRow.value - 1].isNew = true;
        prev[countRow.value - 1].status = 1;
        return _.cloneDeep(prev);
      });
    }
  }, [countRow]);

  const handleAdd = () => {
    setCountRow({
      statusCount: "up",
      value: countRow.value + 1,
    });
  };

  const handleEdit = (e) => {
    setEdit(!isEdit);
  };

  const handleConfirm = (index) => {
    setShowConfirm(index);
  };

  const handleRemoveClick = (ind) => {
    const list = rows.filter((_, index) => index !== ind);
    setRows(list);
    setCountRow({
      statusCount: "down",
      value: countRow.value - 1,
    });
    setShowConfirm(-1);
  };

  const handleNo = () => {
    setShowConfirm(-1);
  };

  const handleCancel = () => {
    setRows([]);
    setCountRow({
      statusCount: "up",
      value: 0,
    });
    formik.handleReset();
    formik.resetForm();
    setModalAddOpen(false);
  };

  const handleServiceChange = (index, newsServiceId) => {
    const serviceInfo = serviceIds.find((s) => s.serviceId === newsServiceId);
    setRows((prev) => {
      prev[index] = { ...prev[index], ...serviceInfo };
      prev[index].isNew = true;
      prev[index].status = 1;
      return _.cloneDeep(prev);
    });
  };

  const getServiceTreating = async (id) => {
    try {
      const res_serviceTreating = await axiosInstance.get(
        listTreatingServiceAPI + id
      );
      setListTreatingService(res_serviceTreating.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEditRecord && listService.length) {
      const oldListTreatingService = [
        ...listService.filter((item) => !item.isNew),
      ];
      const newListTreatingService = [
        ...listService.filter((item) => item.isNew),
      ];
      setRows(newListTreatingService);
      setListTreatingService(oldListTreatingService);
      setCountRow({
        statusCount: "down",
        value: newListTreatingService.length,
      });
      return;
    }
  }, [listService]);

  const formatter = new Intl.NumberFormat({
    style: "currency",
    currency: "VND",
  });

  const listOptionServiceEnable = useMemo(() => {
    const selected = serviceIds.map((item) => item.serviceId);
    const list = originListService.filter((item) =>
      selected.includes(item.serviceId)
    );
    return list;
  }, [serviceIds, originListService]);

  return (
    <>
      {loading2 && <Loading />}
      <Modal
        title={`Ngày ${moment(valueDate).format("DD-MM-YYYY")}`}
        open={modalAddOpen}
        width="75%"
        onOk={formik.handleSubmit}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <SockJsClient
          url={process.env.REACT_APP_SOCKET_URL}
          topics={["/topic/group"]}
          onDisconnect={() => console.log("Disconnected!")}
          ref={(client) => setRefSocket(client)}
        />
        <Box
          className=""
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box className="form-input" style={{ width: "30%" }}>
            <InputDentist
              id="reason"
              label="Triệu chứng"
              required
              value={formik.values.reason}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.reason,
                touched: formik.touched.reason,
              }}
            />
            <InputDentist
              id="diagnostic"
              label="Chuẩn đoán"
              required
              value={formik.values.diagnostic}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.diagnostic,
                touched: formik.touched.diagnostic,
              }}
            />
            <InputDentist
              id="causal"
              label="Nguyên nhân"
              required
              value={formik.values.causal}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.causal,
                touched: formik.touched.causal,
              }}
            />
            <InputDentist
              id="marrowRecord"
              label="Lưu ý về tủy"
              required
              value={formik.values.marrowRecord}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.marrowRecord,
                touched: formik.touched.marrowRecord,
              }}
            />

            <InputDentist
              id="treatment"
              label="Điều trị"
              required
              value={formik.values.treatment}
              onChange={formik.handleChange}
              error={{
                message: formik.errors.treatment,
                touched: formik.touched.treatment,
              }}
            />

            <Box className="mb-2">
              <p className="mb-1 font-bold">Ghi chú</p>
              <TextField
                id="note"
                required
                fullWidth
                placeholder="Ghi chú"
                value={formik.values.note}
                multiline
                onChange={formik.handleChange}
              />
            </Box>

            <Box className="mb-2">
              <p className="mb-1 font-bold">Đơn thuốc</p>
              <TextField
                id="prescription"
                required
                fullWidth
                placeholder="Đơn thuốc"
                value={formik.values.prescription}
                multiline
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box className="w-2/3">
            <Box className="flex justify-between">
              <p className="font-bold text-lg mb-0">
                Đang có ({rows.length}) thêm mới
              </p>
              <Box className="flex gap-3 mb-3">
                <Button
                  variant="contained"
                  color="success"
                  disabled={!listOptionServiceEnable.length}
                  endIcon={<AddCircleIcon className="p-0 border-0" />}
                  onClick={isEdit ? handleAdd : handleEdit}
                >
                  <span className="leading-none">
                    {listOptionServiceEnable.length
                      ? "Thêm dịch vụ"
                      : "Đã hết dịch vụ"}
                  </span>
                </Button>
                <Button
                  variant="contained"
                  disabled={!disableAddSpecimen}
                  color="success"
                  endIcon={<AddCircleIcon className="p-0 border-0" />}
                  onClick={() => {
                    setModalSpecimenOpen(true);
                  }}
                >
                  <span className="leading-none">Thêm mẫu vật</span>
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SellIcon className="p-0 border-0" />}
                  onClick={() => {
                    setModalExportOpen(true);
                  }}
                >
                  <span className="leading-none">Bán sản phẩm</span>
                </Button>
              </Box>
            </Box>
            <StyledTable className="shadow-md" size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell style={{ width: "25%" }}>
                    Dich vụ
                  </StyledTableCell>
                  <StyledTableCell>Số lượng</StyledTableCell>
                  <StyledTableCell>Giá tiền</StyledTableCell>
                  <StyledTableCell>Giảm giá</StyledTableCell>
                  <StyledTableCell>Trạng thái</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {listTreatingService?.map((item, index) => (
                  <StyledTableRow key={item.serviceId}>
                    <StyledTableCell>{item.serviceName}</StyledTableCell>
                    <StyledTableCell>{item.amount}</StyledTableCell>
                    <StyledTableCell className="max-w-[150px]">
                      {formatter.format(item.price)} VND
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatter.format(item.discount)} VND
                    </StyledTableCell>
                    <StyledTableCell>
                      <Select
                        className="mb-0"
                        labelId="status"
                        id="status"
                        value={item.status || ""}
                        onChange={(e) =>
                          setListTreatingService((prev) => {
                            prev[index] = {
                              ...prev[index],
                              status: e.target.value,
                            };
                            return _.cloneDeep(prev);
                          })
                        }
                      >
                        <MenuItem value={1}>Đang chữa trị</MenuItem>
                        <MenuItem value={2}>Đã xong</MenuItem>
                      </Select>
                    </StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                ))}
                {rows?.map((i, index) => {
                  return (
                    <StyledTableRow>
                      {isEdit ? (
                        <>
                          <StyledTableCell>
                            <Box sx={{ minWidth: 120, mt: 0 }}>
                              <FormControl fullWidth className="items-center">
                                <Select
                                  fullWidth
                                  className="h-[30px]"
                                  labelId="permisstion"
                                  id="permisstionSelect"
                                  value={i?.serviceId}
                                  onChange={(e) => {
                                    handleServiceChange(index, e.target.value);
                                  }}
                                >
                                  {originListService?.map((item) => (
                                    <MenuItem
                                      hidden={
                                        !serviceIds
                                          .map(
                                            (item_service) =>
                                              item_service.serviceId
                                          )
                                          .includes(item.serviceId)
                                      }
                                      key={item.serviceId}
                                      value={item.serviceId}
                                    >
                                      {item.serviceName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell padding="none">
                            <OutlinedInput
                              endAdornment={
                                <p className="mb-0 leading-0 text-xs"></p>
                              }
                              size="small"
                              id="amount"
                              value={i.amount}
                              type="number"
                              inputProps={{ min: 1 }}
                              className="h-[30px] w-[70px] text-center bg-white"
                              onChange={(e) =>
                                setRows((prev) => {
                                  prev[index] = {
                                    ...prev[index],
                                    amount: Number(e.target.value),
                                  };
                                  return _.cloneDeep(prev);
                                })
                              }
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {formatter.format(i?.price) || 0} VND
                          </StyledTableCell>
                          <StyledTableCell className="relative">
                            <OutlinedInput
                              id="discount"
                              type="number"
                              className="h-[30px] bg-white w-[150px]"
                              value={i?.discount}
                              endAdornment={
                                <p className="mb-0 leading-0 text-xs">VND</p>
                              }
                              inputProps={{
                                min: 0,
                                max: i?.price,
                              }}
                              onChange={(e) => {
                                const value = e.target.value.replaceAll(
                                  ",",
                                  ""
                                );
                                setRows((prev) => {
                                  prev[index] = {
                                    ...prev[index],
                                    discount: value,
                                  };
                                  return _.cloneDeep(prev);
                                });
                              }}
                            />

                            {i?.discount > i?.price && (
                              <p className="absolute bottom-[-3.5] pt-[2px] text-red-600">
                                Không thể lớn hơn giá gốc
                              </p>
                            )}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Select
                              fullWidth
                              className="mb-0 h-[30px]"
                              labelId="status"
                              id="status"
                              value={i?.status || ""}
                              onChange={(e) => {
                                setRows((prev) => {
                                  prev[index] = {
                                    ...prev[index],
                                    status: e.target.value,
                                  };
                                  return _.cloneDeep(prev);
                                });
                              }}
                            >
                              <MenuItem value={1}>Đang chữa trị</MenuItem>
                              <MenuItem value={2}>Đã xong</MenuItem>
                            </Select>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button onClick={() => handleConfirm(index)}>
                              <ClearIcon />
                            </Button>
                          </StyledTableCell>
                        </>
                      ) : (
                        <></>
                      )}
                      <div>
                        <Dialog
                          open={showConfirm === index}
                          onClose={handleNo}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Chấp nhận xóa"}
                          </DialogTitle>
                          <DialogContent>
                            {/* <DialogContentText id="alert-dialog-description">
                              Are you sure to delete
                            </DialogContentText> */}
                          </DialogContent>
                          <DialogActions style={{ justifyContent: "center" }}>
                            <Button
                              onClick={() => handleRemoveClick(index)}
                              color="primary"
                              multiline
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={handleNo}
                              color="primary"
                              multiline
                            >
                              No
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </StyledTable>
            <Box className="text-center mt-4">
              {errorUpdateMess && (
                <Typography
                  style={{
                    color: "red",
                    fontStyle: "italic",
                    fontSize: "14px",
                  }}
                >
                  {errorUpdateMess}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <ModalSpecimen
          modalSpecimenOpen={modalSpecimenOpen}
          setModalSpecimenOpen={setModalSpecimenOpen}
          specimens={handleSpecimen}
          specimenDTOS={specimenDTOS}
          serviceDTOS={serviceDTOS}
        />
        <ModalExportMaterial
          modalExportOpen={modalExportOpen}
          setModalExportOpen={setModalExportOpen}
          showModalExportMaterial={showModalExportMaterial}
          exportMaterial={handleExportMaterial}
          materialExportDTOS={materialExportDTOS}
        />
      </Modal>
    </>
  );
};

export default ModalAddRecord;
