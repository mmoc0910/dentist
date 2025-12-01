import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
// import Modal from '@mui/material/Modal';
import { Modal } from "antd";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecimen } from "../../../redux/SpecimenSlice/choosenSpecimenSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
// import ModalDeleteSpecimens from '../../ModalComponent/ModalSpecimens/ModalDeleteSpecimens';
import ModalUpdateSpecimens from "../../ModalComponent/ModalSpecimens/ModalUpdateSpecimens";
import ModalAddSpecimens from "../../ModalComponent/ModalSpecimens/ModalAddSpecimens";
import ModalReportSpecimen from "../../ModalComponent/ModalSpecimens/ModalReportSpecimen";
import {
  fetchAllSpecimen,
  updateSpecimen,
} from "../../../redux/SpecimenSlice/listSpecimenSlice";
import { setSpecimenId } from "../../../redux/modalSlice";
import { confirmUsedSpecimen } from "../../../redux/SpecimenSlice/listSpecimenSlice";

import moment from "moment";

const ModalDetailSpecimen = ({ modalDetailOpen, setModalDetailOpen }) => {
  const [loading, setLoading] = useState();
  const specimenId = useSelector((state) => state.modal.specimenId);
  // const SpecimenDTOS = useSelector(state => state.choosenSpecimen.SpecimenDTOS);
  const dispatch = useDispatch();
  const specimenName = useSelector(
    (state) => state.choosenSpecimen.specimenName
  );
  const receiveDate = useSelector((state) => state.choosenSpecimen.receiveDate);
  const deliveryDate = useSelector(
    (state) => state.choosenSpecimen.deliveryDate
  );
  const usedDate = useSelector((state) => state.choosenSpecimen.usedDate);
  const amount = useSelector((state) => state.choosenSpecimen.amount);
  const unitPrice = useSelector((state) => state.choosenSpecimen.unitPrice);
  const status = useSelector((state) => state.choosenSpecimen.specimenStatus);
  const serviceName = useSelector((state) => state.choosenSpecimen.serviceName);
  const laboName = useSelector((state) => state.choosenSpecimen.laboName);
  const patientName = useSelector((state) => state.choosenSpecimen.patientName);
  const buttonUseEnable = useSelector(
    (state) => state.choosenSpecimen.buttonUseEnable
  );
  const buttonReportEnable = useSelector(
    (state) => state.choosenSpecimen.buttonReportEnable
  );
  const [reportOpen, setReportOpen] = useState(false);

  const isDeleteSpecimen = useSelector(
    (state) => state.choosenSpecimen.isDeleteSpecimen
  );
  const isUpdateSpecimen = useSelector(
    (state) => state.listSpecimen.isUpdateSpecimen
  );
  const isUseSpecimen = useSelector(
    (state) => state.choosenSpecimen.isUseSpecimen
  );
  const isAddSpecimen = useSelector(
    (state) => state.listSpecimen.isAddSpecimen
  );

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const detailSpecimen = {
    specimenId: specimenId,
  };

  useEffect(() => {
    setLoading(true);
    try {
      if (specimenId > 0) {
        dispatch(fetchSpecimen(specimenId));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [specimenId]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllSpecimen(detailSpecimen));
    setLoading(false);
  }, [isDeleteSpecimen, isUpdateSpecimen, isAddSpecimen, isUseSpecimen]);

  const getStatusStr = (status) => {
    if (status === 1) {
      return "Chuẩn bị mẫu vật";
    } else if (status === 2) {
      return "Labo nhận mẫu";
    } else if (status === 3) {
      return "Labo giao mẫu";
    } else if (status === 4) {
      return "Bệnh nhân đã sử dụng";
    } else if (status === 5) {
      return "Mẫu lỗi gửi lại cho labo";
    } else {
      return "Hoàn thành";
    }
  };

  return (
    <>
      <Modal
        width={1000}
        open={modalDetailOpen}
        onOk={() => setModalDetailOpen(false)}
        onCancel={() => setModalDetailOpen(false)}
      >
        <Typography
          component="h1"
          variant="h5"
          color="inherit"
          noWrap
          textAlign="center"
          fontWeight="bold"
        >
          Thống kê mẫu vật
        </Typography>
        {/* <IconButton aria-label="add" style={{ borderRadius: '5%' }} onClick={() => {
                    setModalAddOpen(true)
                }}>
                    <AddIcon /> Thêm mới
                </IconButton> */}
        {loading === false && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={10}>
                    {buttonReportEnable ? (
                      <Button
                        style={{ color: "red" }}
                        onClick={() => {
                          setReportOpen(true);
                          // dispatch(setSpecimenId(specimenId))
                        }}
                      >
                        Mẫu lỗi, bàn giao lại cho labo
                      </Button>
                    ) : (
                      <></>
                    )}
                    {buttonUseEnable ? (
                      <Button
                        style={{ color: "green" }}
                        onClick={() => {
                          dispatch(confirmUsedSpecimen(specimenId));
                        }}
                      >
                        Sử dụng
                      </Button>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="attibute">Tên mẫu vật</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Ngày nhận</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Ngày sử dụng</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Ngày chuyển</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Số lượng</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Đơn giá</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Loại dịch vụ</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Labo</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Bệnh nhân</div>
                  </TableCell>
                  <TableCell>
                    <div className="attibute">Trạng thái</div>
                  </TableCell>
                  <TableCell></TableCell>
                  {/* <TableCell></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={specimenId}>
                  <TableCell>{specimenName}</TableCell>
                  <TableCell>
                    {receiveDate
                      ? moment(receiveDate).format("DD/MM/YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    {usedDate ? moment(usedDate).format("DD/MM/YYYY") : ""}
                  </TableCell>
                  <TableCell>
                    {deliveryDate
                      ? moment(deliveryDate).format("DD/MM/YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{unitPrice}</TableCell>
                  <TableCell>{serviceName}</TableCell>
                  <TableCell>{laboName}</TableCell>
                  <TableCell>{patientName}</TableCell>
                  <TableCell>{getStatusStr(status)}</TableCell>
                  {/* <TableCell>
                                    <IconButton aria-label="edit" onClick={() => {
                                        setModalUpdateOpen(true)
                                        dispatch(setSpecimenId(specimenId))
                                    }}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell> */}
                  {/* <TableCell>
                                    <IconButton aria-label="delete" onClick={() => {
                                        setModalDeleteOpen(true)
                                        dispatch(setSpecimenId(specimenId))
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
            {/* <div>
                        <ModalDeleteSpecimens modalDeleteOpen={modalDeleteOpen} setModalDeleteOpen={setModalDeleteOpen} />
                    </div> */}
            {/* <div>
                        <ModalUpdateSpecimens modalUpdateOpen={modalUpdateOpen} setModalUpdateOpen={setModalUpdateOpen} />
                    </div>
                    <div>
                        <ModalAddSpecimens modalAddOpen={modalAddOpen} setModalAddOpen={setModalAddOpen} />
                    </div> */}
            <div>
              <ModalReportSpecimen
                specimenId={specimenId}
                reportOpen={reportOpen}
                setReportOpen={setReportOpen}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalDetailSpecimen;
