import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
// import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
// import TableCell from '@mui/material/TableCell';
import TableHead from "@mui/material/TableHead";
// import TableRow from '@mui/material/TableRow';
import { setScheduleId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Pagination, Typography, IconButton } from "@mui/material";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import ModalAddSchedule from "../../ModalComponent/ModalSchedule/ModalAddSchedule";
import ModalUpdateSchedule from "../../ModalComponent/ModalSchedule/ModalUpdateSchedule";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { fetchAllSchedule } from "../../../redux/ScheduleSlice/listScheduleSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../ui/Loading";

const ScheduleManagementContent = () => {
  const listSchedule = useSelector((state) => state.listSchedule.listSchedule);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.listSchedule.loading);
  const pageSize = useSelector((state) => state.listSchedule.pageSize);
  const totalPages = useSelector((state) => state.listSchedule.totalPage);
  const [currentPage, setCurrentPage] = useState(0);

  const isAddSchedule = useSelector(
    (state) => state.listSchedule.isAddSchedule
  );
  const isUpdateSchedule = useSelector(
    (state) => state.listSchedule.isUpdateSchedule
  );

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);

  useEffect(() => {
    if (isAddSchedule || isUpdateSchedule) {
      dispatch(
        fetchAllSchedule({
          size: pageSize,
          page: currentPage,
        })  
      );
    }
  }, [isAddSchedule, isUpdateSchedule]);

  useEffect(() => {
    dispatch(
      fetchAllSchedule({
        size: pageSize,
        page: currentPage,
      })
    );
  }, [currentPage]);
  return (
    <>
      <h2 className="font-bold mb-4">Lịch hẹn</h2>
      {loading && <Loading />}
      <StyledTable size="small" className="shadow-md">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Bệnh nhân</StyledTableCell>
            <StyledTableCell>Số điện thoại</StyledTableCell>
            <StyledTableCell>Ngày hẹn</StyledTableCell>
            <StyledTableCell>Lưu ý</StyledTableCell>
            <StyledTableCell colSpan={2}></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listSchedule.map((item, index) => (
            <StyledTableRow key={item.waitingRoomId}>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>{item.phone}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
              <StyledTableCell>{item.note}</StyledTableCell>
              <StyledTableCell>
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setModalUpdateOpen(true);
                    dispatch(setScheduleId(item.waitingRoomId));
                  }}
                >
                  <EditIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
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
      {/* <div>
        <ModalAddSchedule
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div> */}
      <div>
        <ModalUpdateSchedule
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
    </>
  );
};

export default ScheduleManagementContent;
