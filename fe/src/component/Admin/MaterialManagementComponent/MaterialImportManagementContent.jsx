import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Pagination,
  Typography,
  IconButton,
  Button,
  SwipeableDrawer,
  Box,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMaterialImportId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { fetchAllMaterialImport } from "../../../redux/MaterialSlice/listMaterialImportSlice";
import ModalUpdateMaterialImport from "../../ModalComponent/ModalMaterial/ModalUpdateMaterialImport";
import ModalDeleteMaterialImport from "../../ModalComponent/ModalMaterial/ModalDeleteMaterialImport";
import ModalAddMaterialImport from "../../ModalComponent/ModalMaterial/ModalAddMaterialImport";
import ModalAddListMaterialImport from "../../ModalComponent/ModalMaterial/ModalAddListMaterialImport";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Loading from "../../ui/Loading";

const MaterialImportManagementContent = () => {
  const listMaterialImport = useSelector(
    (state) => state.listMaterialImport.listMaterialImport
  );
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listMaterialImport.pageSize);
  const totalPages = useSelector((state) => state.listMaterialImport.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  const isUpdateMaterialImport = useSelector(
    (state) => state.listMaterialImport.isUpdateMaterialImport
  );
  const isDeleteMaterialImport = useSelector(
    (state) => state.listMaterialImport.isDeleteMaterialImport
  );
  const isAddMaterialImport = useSelector(
    (state) => state.listMaterialImport.isAddMaterialImport
  );
  const totalImportMaterial = useSelector(
    (state) => state.listMaterialImport.totalImportMaterial
  );
  const loading = useSelector(
    (state) => state.listMaterialImport.loading
  );

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalAddListOpen, setModalAddListOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {
    for (const property in searchValue) {
      searchValue[property] = searchValue[property].trim();
    }
    dispatch(
      fetchAllMaterialImport({
        size: 12,
        page: currentPage,
        materialName: searchValue,
      })
    );
  }, [currentPage]);
  useEffect(() => {
    if (
      isUpdateMaterialImport ||
      isDeleteMaterialImport ||
      isAddMaterialImport
    ) {
      dispatch(
        fetchAllMaterialImport({
          size: 12,
          page: currentPage,
          materialName: searchValue.trim(),
        })
      );
    }
  }, [isUpdateMaterialImport, isDeleteMaterialImport, isAddMaterialImport]);
  const handleSearch = (searchValue) => {
    try {
      if (currentPage === 0) {
        dispatch(
          fetchAllMaterialImport({
            size: 12,
            page: 0,
            materialName: searchValue.trim(),
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
    setTimeout(() => {
    }, 500);
  };

  const onResetFilter = () => {
    setSearchValue("");
    handleSearch("");
    setIsFilter(false);
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Quản Lý Nhập Vật Liệu</h2>
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">
          Có ({totalImportMaterial}) bản ghi
        </p>
        <Button
          variant="contained"
          color="success"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            setModalAddListOpen(true);
          }}
        >
          <span className="leading-none">Thêm mới</span>
        </Button>
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
              Tên cung cấp
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Date
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              số lượng
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Đơn giá
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tổng giá
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {listMaterialImport.map((item, index) => (
            <StyledTableRow key={item.materialImportId}>
              <StyledTableCell>{item.materialName}</StyledTableCell>
              <StyledTableCell>{item.supplyName}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
              <StyledTableCell>{item.amount}</StyledTableCell>
              <StyledTableCell>{item.unitPrice}</StyledTableCell>
              <StyledTableCell>{item.amount * item.unitPrice}</StyledTableCell>
              <StyledTableCell>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setModalDeleteOpen(true);
                    dispatch(setMaterialImportId(item.materialImportId));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setModalUpdateOpen(true);
                    dispatch(setMaterialImportId(item.materialImportId));
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
            color="primary"
            page={currentPage + 1}
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
            <p className="mb-1">Tên vật liệu</p>
            <TextField
              required
              fullWidth
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
        <ModalUpdateMaterialImport
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
      <div>
        <ModalDeleteMaterialImport
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
        />
      </div>
      <div>
        <ModalAddListMaterialImport
          modalAddOpen={modalAddListOpen}
          setModalAddOpen={setModalAddListOpen}
        />
      </div>
    </>
  );
};

export default MaterialImportManagementContent;
