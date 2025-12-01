import { Button, Box, Pagination, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  fetchAllConfirmWaiting,
  confirmWaiting,
} from "../../../redux/WaitingSlice/listConfirmWaitingSlice";
import { confirmWaitingAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { ToastContainer, toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalConfirmWaiting = ({
  modalConfirmWaitingOpen,
  setModalConfirmWaitingOpen,
  triggerGetList,
}) => {
  const dispatch = useDispatch();
  const listConfirmWaiting = useSelector(
    (state) => state.listConfirmWaiting.listConfirmWaiting
  );
  // const pageSize = useSelector(state => state.listConfirmWaiting.pageSize);
  // const totalPages = useSelector(state => state.listConfirmWaiting.totalPage);
  // const [currentPage, setCurrentPage] = useState(0);
  // const totalElements = useSelector(state => state.listConfirmWaiting.totalElements);
  const isConfirmed = useSelector(
    (state) => state.listConfirmWaiting.isConfirmed
  );

  const loadConfirmWatingList = () => {
    dispatch(fetchAllConfirmWaiting());
  };

  useEffect(() => {
    loadConfirmWatingList();
  }, [isConfirmed]);

  useEffect(() => {
    loadConfirmWatingList();
  }, [triggerGetList]);
  // }, [currentPage])

  return (
    <>
      <Modal
        hideBackdrop
        open={modalConfirmWaitingOpen}
        onClose={() => setModalConfirmWaitingOpen(false)}
      >
        <Box sx={{ ...style }}>
          <Table size="small" style={{ marginTop: "15px" }}>
            <TableBody>
              <TableRow>Danh sách bệnh nhận đến lượt khám</TableRow>
              {listConfirmWaiting.map((item) => (
                <TableRow key={item.waitingRoomId}>
                  <TableCell>Bệnh nhân {item.patientName}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        dispatch(
                          confirmWaiting({
                            id: item.waitingRoomId,
                            isAttend: 1,
                          })
                        );
                      }}
                    >
                      Có khám
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        dispatch(
                          confirmWaiting({
                            id: item.waitingRoomId,
                            isAttend: 0,
                          })
                        );
                      }}
                    >
                      Không khám
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={() => setModalConfirmWaitingOpen(false)}
            style={{ justifyContent: "center" }}
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalConfirmWaiting;
