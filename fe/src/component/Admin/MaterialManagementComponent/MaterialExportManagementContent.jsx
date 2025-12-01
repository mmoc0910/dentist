import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import {
  Pagination,
  Typography,
  IconButton,
  SwipeableDrawer,
  Box,
  TextField,
  Button,
} from "@mui/material";
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
import { fetchAllMaterialExport } from "../../../redux/MaterialSlice/listMaterialExportSlice";
import ModalUpdateMaterialExport from "../../ModalComponent/ModalMaterial/ModalUpdateMaterialExport";
import ModalDeleteMaterialExport from "../../ModalComponent/ModalMaterial/ModalDeleteMaterialExport";
import ModalAddMaterialExport from "../../ModalComponent/ModalMaterial/ModalAddMaterialExport";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Loading from "../../ui/Loading";

const MaterialExportManagementContent = () => {
  const listMaterialExport = useSelector(
    (state) => state.listMaterialExport.listMaterialExport
  );
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listMaterialExport.pageSize);
  const totalPages = useSelector((state) => state.listMaterialExport.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  // const userId = useSelector(state=>state.modal.userId);
  const isUpdateMaterialExport = useSelector(
    (state) => state.listMaterialExport.isUpdateMaterialExport
  );
  const isDeleteMaterialExport = useSelector(
    (state) => state.listMaterialExport.isDeleteMaterialExport
  );
  const isAddMaterialExport = useSelector(
    (state) => state.listMaterialExport.isAddMaterialExport
  );
  const totalExportMaterial = useSelector(
    (state) => state.listMaterialExport.totalExportMaterial
  );
  const loading = useSelector((state) => state.listMaterialExport.loading);

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(
      fetchAllMaterialExport({
        size: 12,
        page: currentPage,
        patientName: searchValue.trim(),
      })
    );
  }, [
    currentPage,
    isUpdateMaterialExport,
    isDeleteMaterialExport,
    isAddMaterialExport,
  ]);

  const handleSearch = (searchValue) => {
    try {
      if (currentPage === 0) {
        dispatch(
          fetchAllMaterialExport({
            size: 12,
            page: 0,
            patientName: searchValue.trim(),
          })
        );
      } else {
        setCurrentPage(0);
      }
      setIsFilter(true);
      setOpenFilter(false);
    } catch (err) {
      setIsFilter(false);
    }
  };

  const onResetFilter = () => {
    setSearchValue("");
    handleSearch("");
    setIsFilter(false);
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Quản Lý Xuất Vật Liệu</h2>
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">
          Có ({totalExportMaterial}) bản ghi
        </p>
        <Button
          variant="contained"
          color="info"
          endIcon={<FilterAltIcon />}
          onClick={() => setOpenFilter(true)}
        >
          <span className="leading-none">Lọc</span>
        </Button>
      </Box>
      <StyledTable className="shadow-md mb-3" size="small">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tên vật liệu
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Số lượng
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Đơn giá
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tên bệnh nhân
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Date
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {listMaterialExport.map((item, index) => (
            <StyledTableRow key={item.materialExportId}>
              <StyledTableCell>{item.materialName}</StyledTableCell>
              <StyledTableCell>{item.amount}</StyledTableCell>
              <StyledTableCell>{item.unitPrice}</StyledTableCell>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
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
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      {totalPages === 0 && (
        <>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            textAlign="center"
          >
            {/* Không có vật liệu nào */}
          </Typography>
        </>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {totalPages > 1 ? (
          <Pagination
            page={currentPage + 1}
            color="primary"
            count={totalPages}
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div>
      <SwipeableDrawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <Box className="p-3 w-[300px] bg-white h-full rounded-tl-lg rounded-bl-lg">
          <h3 className="mb-3">Lọc</h3>
          <Box className="mb-3">
            <p className="mb-1">Tên bệnh nhân</p>
            <TextField
              fullWidth
              required
              value={searchValue}
              onChange={(newValue) => setSearchValue(newValue.target.value)}
            />
          </Box>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              className="mr-3"
              onClick={() => handleSearch(searchValue)}
              disabled={!searchValue}
            >
              Đồng ý
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={onResetFilter}
              disabled={!isFilter}
            >
              Đặt lại
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
      <div>
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
      {/* <div>
        <ModalAddMaterialExport
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div> */}
    </>
  );
};

export default MaterialExportManagementContent;
