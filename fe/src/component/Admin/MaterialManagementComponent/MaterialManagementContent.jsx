import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
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
import { setMaterialId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { fetchAllMaterial } from "../../../redux/MaterialSlice/listMaterialSlice";
import ModalUpdateMaterial from "../../ModalComponent/ModalMaterial/ModalUpdateMaterial";
import ModalDeleteMaterial from "../../ModalComponent/ModalMaterial/ModalDeleteMaterial";
import ModalAddMaterial from "../../ModalComponent/ModalMaterial/ModalAddMaterial";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loading from "../../ui/Loading";

const MaterialManagementContent = () => {
  const listMaterial = useSelector((state) => state.listMaterial.listMaterial);
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listMaterial.pageSize);
  const totalPages = useSelector((state) => state.listMaterial.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  // const userId = useSelector(state=>state.modal.userId);
  const isUpdateMaterial = useSelector(
    (state) => state.listMaterial.isUpdateMaterial
  );
  const isDeleteMaterial = useSelector(
    (state) => state.listMaterial.isDeleteMaterial
  );
  const isAddMaterial = useSelector(
    (state) => state.listMaterial.isAddMaterial
  );
  const totalMaterials = useSelector(
    (state) => state.listMaterial.totalMaterials
  );
  const loading = useSelector((state) => state.listMaterial.loading);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(
      fetchAllMaterial({
        size: 12,
        page: currentPage,
        name: searchValue.trim(),
      })
    );
  }, [currentPage]);

  useEffect(() => {
    if (isUpdateMaterial || isDeleteMaterial || isAddMaterial) {
      dispatch(
        fetchAllMaterial({
          size: 12,
          page: currentPage,
          name: searchValue.trim(),
        })
      );
    }
  }, [isUpdateMaterial, isDeleteMaterial, isAddMaterial]);

  const handleSearch = (searchValue) => {
    try {
      if (currentPage === 0) {
        dispatch(
          fetchAllMaterial({
            size: 12,
            page: 0,
            name: searchValue.trim(),
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
      <h2 className="font-bold mb-4">Danh Sách Vật Liệu</h2>
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">Có ({totalMaterials}) bản ghi</p>
        <Button
          variant="contained"
          color="success"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            setModalAddOpen(true);
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
      <StyledTable size="small" className="shadow-md mb-3">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tên vật liệu
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Đơn vị
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Số lượng
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Giá tiền
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tổng tiền
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {listMaterial.map((item, index) => (
            <StyledTableRow key={item.materialId}>
              <StyledTableCell>{item.materialName}</StyledTableCell>
              <StyledTableCell>{item.unit}</StyledTableCell>
              <StyledTableCell>{item.amount}</StyledTableCell>
              <StyledTableCell>{item.price}</StyledTableCell>
              <StyledTableCell>{item.amount * item.price}</StyledTableCell>
              <StyledTableCell>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setModalDeleteOpen(true);
                    dispatch(setMaterialId(item.materialId));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setModalUpdateOpen(true);
                    dispatch(setMaterialId(item.materialId));
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
            count={totalPages}
            page={currentPage + 1}
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
        <ModalUpdateMaterial
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
      <div>
        <ModalDeleteMaterial
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
        />
      </div>
      <div>
        <ModalAddMaterial
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div>
    </>
  );
};

export default MaterialManagementContent;
