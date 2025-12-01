import { TableBody, TableHead, IconButton, Chip } from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLabo,
  setIsDeleteSpecimens,
} from "../../../redux/LaboSlice/choosenLaboSlice";
import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
import ModalDeleteSpecimens from "../../ModalComponent/ModalSpecimens/ModalDeleteSpecimens";
// import ModalUpdateSpecimens from "../../ModalComponent/ModalSpecimens/ModalUpdateSpecimens";
// import ModalAddSpecimens from "../../ModalComponent/ModalSpecimens/ModalAddSpecimens";

// import { fetchAllSpecimens } from "../../../redux/SpecimensSlice/listSpecimensSlice";
import { setUserId } from "../../../redux/modalSlice";
import Loading from "../../ui/Loading";
import { statusLaboColor, statusLaboFormatter } from "../../style-config";

const ModalDetailLabo = () => {
  // const [loading, setLoading] = useState();
  const laboId = useSelector((state) => state.modal.laboId);
  const specimensDTOS = useSelector((state) => state.choosenLabo.specimensDTOS);
  const dispatch = useDispatch();

  const isUpdatePrepareSample = useSelector(
    (state) => state.choosenLabo.isUpdatePrepareSample
  );
  const isUpdateReceiveSample = useSelector(
    (state) => state.choosenLabo.isUpdateReceiveSample
  );
  const isDeleteSpecimens = useSelector(
    (state) => state.choosenLabo.isDeleteSpecimens
  );
  const loading = useSelector((state) => state.choosenLabo.loading);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [listLaboRecord, setListLaboRecord] = useState([]);
  useEffect(() => {
    setListLaboRecord(specimensDTOS);
  }, [specimensDTOS]);

  useEffect(() => {
    if (laboId) {
      try {
        if (laboId) {
          dispatch(fetchLabo(laboId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [laboId]);
  useEffect(() => {
    if (isDeleteSpecimens) {
      try {
        if (laboId) {
          dispatch(fetchLabo(laboId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [isDeleteSpecimens]);

  useEffect(() => {
    try {
      if (laboId && (isUpdatePrepareSample || isUpdateReceiveSample)) {
        dispatch(fetchLabo(laboId));
      }
    } catch (error) {
      console.log(error);
    }
  }, [isUpdatePrepareSample, isUpdateReceiveSample]);

  return (
    <>
      {loading && <Loading />}
      <>
        <StyledTable className="shadow-md">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Mẫu thử nghiệm</StyledTableCell>
              <StyledTableCell>Bệnh nhân</StyledTableCell>
              <StyledTableCell>Ngày nhận</StyledTableCell>
              <StyledTableCell>Ngày giao hàng</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Giá</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {listLaboRecord.map((item) => (
              <StyledTableRow key={item.specimenId}>
                <StyledTableCell>{item.specimenName}</StyledTableCell>
                <StyledTableCell>{item.patientName}</StyledTableCell>
                <StyledTableCell>{item.receiveDate}</StyledTableCell>
                <StyledTableCell>{item.deliveryDate}</StyledTableCell>
                <StyledTableCell>{item.amount}</StyledTableCell>
                <StyledTableCell>{item.unitPrice}</StyledTableCell>
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
                {/* <StyledTableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        setModalUpdateOpen(true);
                        dispatch(setUserId(item.specimenId));
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </StyledTableCell> */}
                <StyledTableCell>
                  <IconButton
                    className="p-0"
                    aria-label="delete"
                    onClick={() => {
                      setModalDeleteOpen(true);
                      dispatch(setUserId(item.specimenId));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
        <div>
          <ModalDeleteSpecimens
            modalDeleteOpen={modalDeleteOpen}
            setModalDeleteOpen={setModalDeleteOpen}
          />
        </div>
        {/* <div>
            <ModalUpdateSpecimens
              modalUpdateOpen={modalUpdateOpen}
              setModalUpdateOpen={setModalUpdateOpen}
            />
          </div> */}
        {/* <div>
            <ModalAddSpecimens
              modalAddOpen={modalAddOpen}
              setModalAddOpen={setModalAddOpen}
            />
          </div> */}
      </>
    </>
  );
};

export default ModalDetailLabo;
