import { TableBody, TableHead, Typography, Button, Box } from "@mui/material";
import { Modal, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReceipts } from "../../../redux/ReceiptSlice/listReceiptSlice";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalAddReceipt from "../../ModalComponent/ModalBill/ModalAddReceipt";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import Loading from "../../ui/Loading";
const ModalListReceipt = ({ modalReceiptOpen, setModalReceiptOpen }) => {
  const treatmentId = useSelector((state) => state.modal.treatmentId);
  const listReceipts = useSelector((state) => state.listReceipts.listReceipts);
  const loading = useSelector((state) => state.listReceipts.loading);

  const dispatch = useDispatch();

  const [modalAddReceiptOpen, setModalAddReceiptOpen] = useState(false);
  const isAddNewReceipt = useSelector(
    (state) => state.listReceipts.isAddNewReceipt
  );
  const patientName = useSelector((state) => state.choosenBill.patientName);

  useEffect(() => {
    try {
      if (treatmentId) {
        dispatch(fetchAllReceipts(treatmentId));
      }
    } catch (error) {
      console.log(error);
    }
  }, [treatmentId]);

  useEffect(() => {
    if (isAddNewReceipt) {
      try {
        if (treatmentId > 0) {
          dispatch(fetchAllReceipts(treatmentId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [isAddNewReceipt]);

  return (
    <>
      {loading && <Loading />}
      <Modal
        title="Thông tin hóa đơn"
        width={700}
        footer={null}
        open={modalReceiptOpen}
        onCancel={() => setModalReceiptOpen(false)}
      >
        {!loading ? (
          <Box>
            <Box className="flex items-center justify-between">
              <Typography
                component="h1"
                fontWeight="bold"
                color="inherit"
                noWrap
                className="mb-4"
              >
                Bệnh nhân: {patientName}
              </Typography>
              <Button
                className="float-right mb-3"
                variant="contained"
                color="success"
                endIcon={<AddCircleIcon />}
                onClick={() => {
                  setModalAddReceiptOpen(true);
                }}
              >
                <span className="leading-none">Thanh toán</span>
              </Button>
            </Box>
            <StyledTable className="shadow-md">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Thanh toán (VND)</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Ghi nợ (VND)</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {listReceipts?.map((item) => (
                  <StyledTableRow key={item.receiptId}>
                    <StyledTableCell>{item.payment}</StyledTableCell>
                    <StyledTableCell>{item.date}</StyledTableCell>
                    <StyledTableCell>{item.debit}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Box>
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
      </Modal>

      <ModalAddReceipt
        modalAddReceiptOpen={modalAddReceiptOpen}
        setModalAddReceiptOpen={setModalAddReceiptOpen}
      />
    </>
  );
};

export default ModalListReceipt;
