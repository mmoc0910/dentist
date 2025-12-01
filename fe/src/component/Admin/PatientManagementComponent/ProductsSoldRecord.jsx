import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Pagination, Typography, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMaterialExportId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { fetchPatientMaterialExport } from "../../../redux/MaterialSlice/listMaterialExportSlice";
import { Modal } from "antd";
import Loading from "../../ui/Loading";

const ProductsSoldRecord = ({ patientId, isShow, setIsShow }) => {
  const listPatientMaterialExport = useSelector(
    (state) => state.listMaterialExport.listPatientMaterialExport
  );
  const loading = useSelector((state) => state.listMaterialExport.loading);
  const dispatch = useDispatch();
  const totalPages = useSelector((state) => state.listMaterialExport.totalPage);
  const [currentPage, setCurrentPage] = useState(0);

  const [listMaterialExport, setListMaterialExport] = useState([]);

  useEffect(() => {
    if (patientId && isShow) {
      dispatch(fetchPatientMaterialExport(patientId));
    }
  }, [patientId, isShow]);

  useEffect(() => {
    setListMaterialExport(listPatientMaterialExport);
  }, [listPatientMaterialExport]);

  const formatter = new Intl.NumberFormat({
    style: "currency",
    currency: "VND",
  });

  return (
    <>
      {loading && <Loading />}
      <Modal
        width={1500}
        open={isShow}
        footer={null}
        onCancel={() => setIsShow(false)}
      >
        <p className="text-center font-bold text-2xl">Sản phẩm đã mua</p>
        <StyledTable className="shadow-md" size="small">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Tên vật liệu</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Đơn giá (VND)</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              {/* <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {listMaterialExport.map((item, index) => (
                <StyledTableRow key={item.materialExportId}>
                  <StyledTableCell>{item.materialName}</StyledTableCell>
                  <StyledTableCell>{item.amount}</StyledTableCell>
                  <StyledTableCell>
                    {formatter.format(item.unitPrice)}
                  </StyledTableCell>
                  <StyledTableCell>{item.date}</StyledTableCell>
                  {/* <StyledTableCell>
       <IconButton
         aria-label="edit"
         onClick={() => {
           setModalUpdateOpen(true);
           dispatch(setMaterialExportId(item.materialExportId));
         }}
       >
         <EditIcon />
       </IconButton>
     </StyledTableCell>
     <StyledTableCell>
       <IconButton
         aria-label="delete"
         onClick={() => {
           setModalDeleteOpen(true);
           dispatch(setMaterialExportId(item.materialExportId));
         }}
       >
         <DeleteIcon />
       </IconButton>
     </StyledTableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </StyledTable>
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
        {totalPages > 1 ? (
          <Pagination
            count={totalPages}
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div> */}
        {/* <div>
        <ModalUpdateMaterialExport
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
      <div>
        <ModalDeleteMaterialExport
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
        />
      </div>
      <div>
        <ModalAddMaterialExport
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div> */}
      </Modal>
    </>
  );
};

export default ProductsSoldRecord;
