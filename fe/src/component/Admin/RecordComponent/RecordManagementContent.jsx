import {
  Button,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Pagination,
  Table,
  TableBody,
  TableHead,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import PatientProfile from "../PatientManagementComponent/PatientProfile";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Divider, Modal } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/customAxios";
import { allPatientRecordAPI } from "../../../config/baseAPI";
import ModalAddRecord from "../../ModalComponent/ModalRecord/ModalAddRecord";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch, useSelector } from "react-redux";
import { setRecordSelected } from "../../../redux/modalSlice";
import ModalDeleteRecord from "../../ModalComponent/ModalRecord/ModalDeleteRecord";
import ModalDetailService from "../../ModalComponent/ModalRecord/ModalDetailService";
import ModalDetailRecord from "../../ModalComponent/ModalRecord/ModalDetailRecord";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import SpecimenRecord from "../PatientManagementComponent/SpecimenRecord";
import ProductsSoldRecord from "../PatientManagementComponent/ProductsSoldRecord";
import moment from "moment";
import { useMemo } from "react";
import Loading from "../../ui/Loading";
import {
  setIsAddRecord,
  setIsDeleteRecord,
} from "../../../redux/RecordSlice/listRecordSlice";

const RecordManagementContent = () => {
  const dispatch = useDispatch();

  const pageSize = useSelector((state) => state.listRecord.pageSize);
  const isAddRecord = useSelector((state) => state.listRecord.isAddRecord);
  const isDeleteRecord = useSelector(
    (state) => state.listRecord.isDeleteRecord
  );

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [patientPageIn, setPatientPageIn] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [role, setRole] = useState(null);

  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [modalDetailRecordOpen, setModalDetailRecordOpen] = useState(false);
  const [modalDetailSpecimen, setModalDetailSpecimen] = useState(false);
  const [modalProducstSold, setModalProducstSold] = useState(false);
  const [isShowCanotAdd, setIsShowCanotAdd] = useState(false);

  const { id } = useParams();
  const [recordList, setRecordList] = useState([]);
  const { search } = useLocation();
  const styleTxt = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "130px",
    display: "block",
    overflow: "hidden",
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);

  const getDetail = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(allPatientRecordAPI + id, {
        params: {
          size: pageSize,
          page: currentPage,
        },
      });
      setTotalElements(res?.data?.totalElements || 0);
      setTotalPages(res?.data?.totalPages || 0);
      setRecordList(res?.data?.content || []);
      dispatch(setIsAddRecord(false));
      dispatch(setIsDeleteRecord(false));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDetail(id);
  }, [currentPage]);

  useEffect(() => {
    if (isAddRecord || isDeleteRecord) {
      getDetail(id);
    }
  }, [isAddRecord, isDeleteRecord]);

  const disableAddButton = useMemo(() => {
    return recordList.some(
      (item) => item.date === moment().format("YYYY-MM-DD")
    );
  }, [recordList]);

  return (
    <>
      {loading && <Loading />}
      <Box className="flex items-center gap-3 mb-4">
        <Link
          className="text-decoration-none flex"
          to={`/patient-management${search}`}
        >
          <ArrowBackIosNewIcon />
          <span className="text-base">Quay lại danh sách</span>
        </Link>
      </Box>
      <Box className="bg-white rounded-lg shadow-md px-10 py-3">
        <Box className="mb-6">
          <PatientProfile />
        </Box>
        <Divider
          plain
          style={{ borderColor: "#000000ba", color: "#000000ba" }}
          className="mt-5 mb-1"
        >
          <span className="font-bold text-lg ">Hồ sơ khám bệnh</span>
        </Divider>
        <Box className="flex gap-3 mb-3">
          <p className="font-bold text-lg mb-0">Có ({totalElements}) hồ sơ</p>
          {role !== "Receptionist" && (
            <Box className="flex gap-3">
              <Button
                variant="contained"
                color="success"
                endIcon={<AddCircleIcon />}
                onClick={() => {
                  if (!disableAddButton) {
                    setIsEditRecord(false);
                    setModalAddOpen(true);
                    return;
                  }
                  setIsShowCanotAdd(true);
                }}
              >
                <span className="leading-none">Thêm hồ sơ</span>
              </Button>
              <Button
                variant="contained"
                color="info"
                endIcon={<RemoveRedEyeIcon />}
                onClick={() => {
                  setModalDetailSpecimen(true);
                }}
              >
                <span className="leading-none">Danh sách mẫu vật</span>
              </Button>
              <Button
                variant="contained"
                color="info"
                endIcon={<RemoveRedEyeIcon />}
                onClick={() => {
                  setModalProducstSold(true);
                }}
              >
                <span className="leading-none">Sản phẩm đã mua</span>
              </Button>
            </Box>
          )}
        </Box>
        <StyledTable className="shadow-md" size="small">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Lý do đến khám</StyledTableCell>
              <StyledTableCell>Chẩn đoán</StyledTableCell>
              <StyledTableCell>Nguyên nhân</StyledTableCell>
              <StyledTableCell>Ngày khám</StyledTableCell>
              <StyledTableCell>Lưu ý về tủy</StyledTableCell>
              <StyledTableCell>Ghi chú</StyledTableCell>
              <StyledTableCell>Điều trị</StyledTableCell>
              <StyledTableCell>Đơn thuốc</StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          {totalPages === 0 ? null : (
            <TableBody>
              {recordList?.map((el) => (
                <StyledTableRow key={el.patientRecordId}>
                  <StyledTableCell>
                    <div style={{ ...styleTxt }}>{el.reason}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.diagnostic}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.causal}</div>
                  </StyledTableCell>
                  <StyledTableCell>{el.date}</StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.marrowRecord}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.note}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.treatment}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={styleTxt}>{el.prescription}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        setModalDetailRecordOpen(true);
                        dispatch(setRecordSelected(el.patientRecordId));
                      }}
                    >
                      <span className="leading-none">Chi tiết</span>
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    {moment().format("YYYY-MM-DD") === el.date &&
                      role !== "Receptionist" && (
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => {
                            dispatch(setRecordSelected(el.patientRecordId));
                            setIsEditRecord(true);
                            setModalAddOpen(true);
                          }}
                        >
                          <span className="leading-none">Sửa</span>
                        </Button>
                      )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setModalDeleteOpen(true);
                        dispatch(setRecordSelected(el.patientRecordId));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </StyledTable>
        {!totalPages && (
          <>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              textAlign="center"
              marginTop={10}
            >
              {/* Không có hồ sơ nào */}
            </Typography>
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "14px 16px",
          }}
        >
          {totalPages > 1 ? (
            <Pagination
              color="primary"
              count={totalPages}
              onChange={(e, pageNumber) => {
                setCurrentPage(pageNumber - 1);
              }}
            />
          ) : null}
        </div>
      </Box>

      <SpecimenRecord
        isShow={modalDetailSpecimen}
        setIsShow={setModalDetailSpecimen}
        patientId={Number(id)}
      />
      <Modal
        open={isShowCanotAdd}
        onCancel={() => setIsShowCanotAdd(false)}
        footer={null}
        title="Thông báo"
      >
        <Box className="text-center text-lg text-red-600">
          <p>Ngày {moment().format("DD-MM-YYYY")} đã có hồ sơ.</p>
          <p> Vui lòng chỉnh sửa ở danh sách dưới!</p>
        </Box>
      </Modal>
      <ProductsSoldRecord
        isShow={modalProducstSold}
        setIsShow={setModalProducstSold}
        patientId={Number(id)}
      />

      <ModalDetailRecord
        modalDetailRecordOpen={modalDetailRecordOpen}
        setModalDetailRecordOpen={setModalDetailRecordOpen}
      />

      <ModalAddRecord
        isEditRecord={isEditRecord}
        modalAddOpen={modalAddOpen}
        setModalAddOpen={setModalAddOpen}
      />
      <ModalDeleteRecord
        modalDeleteOpen={modalDeleteOpen}
        setModalDeleteOpen={setModalDeleteOpen}
      />
      <ModalDetailService
        modalDetailOpen={modalDetailOpen}
        setModalDetailOpen={setModalDetailOpen}
      />
    </>
  );
};

export default RecordManagementContent;
