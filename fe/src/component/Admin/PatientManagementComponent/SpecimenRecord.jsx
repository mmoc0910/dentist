import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, IconButton, Chip, Button } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import { fetchPatientSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";
import { setSpecimenId } from "../../../redux/modalSlice";
import ErrorIcon from "@mui/icons-material/Error";
import AddAlertIcon from "@mui/icons-material/AddAlert";
// import ModalUpdateSpecimens from "../../ModalComponent/ModalSpecimens/ModalUpdateSpecimens";
import { statusLaboColor, statusLaboFormatter } from "../../style-config/index";
import { Modal } from "antd";
import moment from "moment";
import ModalReportSpecimen from "../../ModalComponent/ModalSpecimens/ModalReportSpecimen";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { confirmUsedSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";
import "./style.css";
import _ from "lodash";
import Loading from "../../ui/Loading";

const SpecimenRecord = ({ patientId, isShow, setIsShow }) => {
  const dispatch = useDispatch();
  const listPatientSpecimens = useSelector(
    (state) => state.listSpecimen.listPatientSpecimens
  );
  //   const pageSize = 10;
  //   const totalPages = useSelector((state) => state.listSpecimen.totalPage);
  //   const totalElements = useSelector(
  //     (state) => state.listSpecimen.totalElements
  //   );
  //   const [currentPage, setCurrentPage] = useState(0);
  // const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [specimenId, setSpecimenId] = useState();
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  //   const isDeleteSpecimen = useSelector(
  //     (state) => state.listSpecimen.isDeleteSpecimen
  //   );
  //   const isAddSpecimen = useSelector(
  //     (state) => state.listSpecimen.isAddSpecimen
  //   );
  //   const isUpdateSpecimen = useSelector(
  //     (state) => state.listSpecimen.isUpdateSpecimen
  //   );
  //   const isUseSpecimen = useSelector(
  //     (state) => state.listSpecimen.isUseSpecimen
  //   );
  const loading = useSelector((state) => state.listSpecimen.loading);
  // const [loading, setLoading] = useState(false);

  const loadSpecimenList = () => {
    try {
      dispatch(fetchPatientSpecimen(patientId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isShow || isSubmit) {
      loadSpecimenList();
      setIsSubmit(false);
    }
  }, [isShow, isSubmit]);

  //   useEffect(() => {
  //     // loadSpecimenList();
  //   }, [currentPage]);

  return (
    <>
      {loading && <Loading />}
      <Modal
        width={1500}
        open={isShow}
        footer={null}
        onCancel={() => setIsShow(false)}
      >
        <p className="text-center font-bold text-2xl">Danh sách mẫu vật</p>
        <StyledTable size="small" className="shadow-md">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Tên mẫu vật</StyledTableCell>
              <StyledTableCell>Ngày nhận</StyledTableCell>
              <StyledTableCell>Ngày giao</StyledTableCell>
              <StyledTableCell>Ngày sử dụng</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Đơn giá</StyledTableCell>
              <StyledTableCell>Loại dịch vụ</StyledTableCell>
              <StyledTableCell>Labo</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          {loading === false && (
            <TableBody>
              {listPatientSpecimens.map((item) => (
                <StyledTableRow key={item.specimenId}>
                  <StyledTableCell>{item.specimenName}</StyledTableCell>
                  <StyledTableCell>
                    {item.receiveDate
                      ? moment(item.receiveDate).format("DD/MM/YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.deliveryDate
                      ? moment(item.deliveryDate).format("DD/MM/YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.usedDate
                      ? moment(item.usedDate).format("DD/MM/YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{item.amount}</StyledTableCell>
                  <StyledTableCell>{item.unitPrice}</StyledTableCell>
                  <StyledTableCell>{item.serviceName}</StyledTableCell>
                  <StyledTableCell>{item.laboName}</StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      size="small"
                      style={{
                        backgroundColor: `${statusLaboColor(item.status)}`,
                        color: "#fff",
                      }}
                      label={statusLaboFormatter(item.status)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.buttonReportEnable && (
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ErrorIcon />}
                        onClick={() => {
                          setSpecimenId(item.specimenId);
                          setReportOpen(true);
                        }}
                      >
                        <span className="leading-none text-xs">Báo lỗi</span>
                      </Button>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.buttonUseEnable && (
                      <Button
                        variant="contained"
                        color="success"
                        endIcon={<AddAlertIcon />}
                        onClick={() => {
                          setSpecimenId(item.specimenId);
                          setModalDeleteOpen(true);
                        }}
                      >
                        <span className="leading-none text-xs">Sử dụng</span>
                      </Button>
                    )}
                  </StyledTableCell>
                  {/* <StyledTableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        setModalUpdateOpen(true);
                        dispatch(setSpecimenId(item.specimenId));
                      }}
                    >
                      <EditIcon />
                    </IconButton> 
                  </StyledTableCell>*/}
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </StyledTable>
        {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "14px 16px",
        }}
      >
        {totalPages > 1 ? (
          <Pagination
            count={totalPages}
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div> */}
        <ModalReportSpecimen
          specimenId={specimenId}
          isShow={reportOpen}
          setIsShow={setReportOpen}
          submit={setIsSubmit}
        />
        <Modal
          title="Sử dụng mẫu vật"
          onOk={() => {
            dispatch(confirmUsedSpecimen(specimenId));
            setTimeout(() => {
              setIsSubmit(true);
              setModalDeleteOpen(false);
            }, 1000);
          }}
          open={modalDeleteOpen}
          onCancel={() => {
            setModalDeleteOpen(false);
          }}
        >
          <p>"Bạn có chắc chắn muốn dùng mẫu vật này không ?"</p>
        </Modal>
        {/* <ModalUpdateSpecimens
        modalUpdateOpen={modalUpdateOpen}
        setModalUpdateOpen={setModalUpdateOpen}
      /> */}
      </Modal>
    </>
  );
};

export default SpecimenRecord;
