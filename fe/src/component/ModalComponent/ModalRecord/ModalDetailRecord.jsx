import {
  Box,
  TextField,
  Table,
  TableBody,
  TableHead,
  Chip,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecord } from "../../../redux/RecordSlice/listRecordSlice";
import moment from "moment";
import Loading from "../../ui/Loading";

const ModalDetailRecord = ({
  modalDetailRecordOpen,
  setModalDetailRecordOpen,
}) => {
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");
  const recordId = useSelector((state) => state.modal.recordSelected);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.listRecord.loading);
  // const diagnostic = useSelector((state) => state.listRecord.diagnostic);
  // const causal = useSelector((state) => state.listRecord.causal);
  // const date = useSelector((state) => state.listRecord.date);
  // const marrowRecord = useSelector((state) => state.listRecord.marrowRecord);
  // const note = useSelector((state) => state.listRecord.note);
  // const treatment = useSelector((state) => state.listRecord.treatment);
  // const prescription = useSelector((state) => state.listRecord.prescription);
  // const listService = useSelector((state) => state.listRecord.listService);

  const {
    reason,
    diagnostic,
    causal,
    date,
    marrowRecord,
    note,
    treatment,
    prescription,
    listService,
  } = useSelector((state) => state.listRecord.infoRecord);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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

  useEffect(() => {
    if (modalDetailRecordOpen) {
      try {
        setDefaultActiveKey("1");
        dispatch(fetchRecord(recordId));
      } catch (error) {
        console.log(error);
      }
    }
  }, [recordId, modalDetailRecordOpen]);

  const detailRecord = (
    <Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Lý do đến khám:</p>
        </div>
        <TextField
          fullWidth
          value={reason}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Chẩn đoán:</p>
        </div>

        <TextField
          fullWidth
          value={diagnostic}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Nguyên nhân:</p>
        </div>
        <TextField
          fullWidth
          value={causal}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Lưu ý về tủy:</p>
        </div>
        <TextField
          fullWidth
          value={marrowRecord}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Ghi chú:</p>
        </div>
        <TextField
          fullWidth
          value={note}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Điều trị:</p>
        </div>
        <TextField
          fullWidth
          value={treatment}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box className="mb-3 flex gap-3 items-center">
        <div className="w-1/5">
          <p className="font-bold">Đơn thuốc:</p>
        </div>
        <TextField
          fullWidth
          value={prescription}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    </Box>
  );

  const servicesBlock = (
    <StyledTable
      size="small"
      className="shadow-md"
      style={{ marginTop: "15px" }}
    >
      <TableHead>
        <StyledTableRow>
          <StyledTableCell>
            <div className="attibute text-center">Tên dịch vụ</div>
          </StyledTableCell>
          <StyledTableCell>
            <div className="attibute text-center">Trạng thái</div>
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {listService?.map((item) => {
          return (
            <StyledTableRow key={item.serviceId}>
              <StyledTableCell className="text-center">
                {item.serviceName}
              </StyledTableCell>
              <StyledTableCell className="text-center py-3">
                <Chip
                  size="small"
                  label={statusFormatter(item.status)}
                  style={{
                    background: `${renderColor(item.status)}`,
                    color: "#fff",
                  }}
                />
              </StyledTableCell>
            </StyledTableRow>
          );
        })}
      </TableBody>
    </StyledTable>
  );

  return (
    <>
      {loading && <Loading />}
      {!loading && <Modal
        title={`Ngày ${moment(date).format("DD-MM-YYYY")}`}
        open={modalDetailRecordOpen}
        width={800}
        onCancel={() => setModalDetailRecordOpen(false)}
        footer={null}
      >
        <Tabs
          defaultActiveKey={defaultActiveKey}
          centered
          type="card"
          items={[
            {
              label: "Chi tiết",
              key: "1",
              children: detailRecord,
            },
            {
              label: "Dịch vụ",
              key: "2",
              children: servicesBlock,
            },
          ]}
        />
      </Modal>}
    </>
  );
};

export default ModalDetailRecord;
