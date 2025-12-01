import { ConstructionOutlined } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Modal } from "antd";
import e from "cors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import {
//   listTreatingServiceAPI,
//   patientRecordAPI,
// } from "../../../config/baseAPI";
// import axiosInstance from "../../../config/customAxios";
// import { fetchRecord } from "../../../redux/RecordSlice/listRecordSlice";

const ModalDetailService = ({ modalDetailOpen, setModalDetailOpen }) => {
  const dispatch = useDispatch();
  // const patientRecordId = useSelector((state) => state.modal.userId);
  const listService = useSelector((state) => state.listRecord.listService);

  const handleCancel = () => {
    setModalDetailOpen(false);
  };

  // useEffect(() => {
  //   if (patientRecordId > 0) dispatch(fetchRecord(patientRecordId));
  // }, [patientRecordId]);

  const renderColor = (status) => {
    let color = "#2e7d32";
    if (status === 0) {
      color = "#e18220";
    } else if (status === 1) {
      color = "#0288d1";
    }
    return color;
  };
  const statusFormatter = (status) => {
    return status === 1 ? "Đang Chữa" : "Đã Chữa Trị";
  };

  return (
    <>
      <Modal title="Dịch vụ" open={modalDetailOpen} onCancel={handleCancel}>
        <Table size="small" style={{ marginTop: "15px" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <div className="attibute text-center">Tên dịch vụ</div>
              </TableCell>
              <TableCell>
                <div className="attibute text-center">Trạng thái</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listService?.map((item) => {
              return (
                <TableRow key={item.serviceId}>
                  <TableCell className="text-center">
                    {item.serviceName}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <Chip
                      size="small"
                      label={statusFormatter(item.status)}
                      style={{
                        background: `${renderColor(item.status)}`,
                        color: "#fff",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Modal>
    </>
  );
};

export default ModalDetailService;
