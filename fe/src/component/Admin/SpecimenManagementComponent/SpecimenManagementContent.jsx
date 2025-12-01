import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  Typography,
  IconButton,
  TextField,
  Chip,
  SwipeableDrawer,
  Box,
  Button,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  fetchAllSpecimen,
  searchSpecimen,
} from "../../../redux/SpecimenSlice/listSpecimenSlice";
import ModalAddSpecimens from "../../ModalComponent/ModalSpecimens/ModalAddSpecimens";
import ModalDeleteSpecimens from "../../ModalComponent/ModalSpecimens/ModalDeleteSpecimens";
import { setSpecimenId } from "../../../redux/modalSlice";
import ModalUpdateSpecimens from "../../ModalComponent/ModalSpecimens/ModalUpdateSpecimens";
import "./style.css";
import _ from "lodash";
import ModalDetailSpecimen from "../../ModalComponent/ModalSpecimens/ModalDetailSpecimen";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/customAxios";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { statusLaboColor, statusLaboFormatter } from "../../style-config/index";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Loading from "../../ui/Loading";

const SpecimenManagementContent = () => {
  const dispatch = useDispatch();
  const listSpecimen = useSelector((state) => state.listSpecimen.listSpecimen);
  const pageSize = 12;
  const totalPages = useSelector((state) => state.listSpecimen.totalPage);
  const totalElements = useSelector(
    (state) => state.listSpecimen.totalElements
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);

  const isDeleteSpecimen = useSelector(
    (state) => state.listSpecimen.isDeleteSpecimen
  );
  const isAddSpecimen = useSelector(
    (state) => state.listSpecimen.isAddSpecimen
  );
  const isUpdateSpecimen = useSelector(
    (state) => state.listSpecimen.isUpdateSpecimen
  );
  const isUseSpecimen = useSelector(
    (state) => state.listSpecimen.isUseSpecimen
  );
  const isSearchSpecimen = useSelector(
    (state) => state.listSpecimen.isSearchSpecimen
  );
  const loading = useSelector((state) => state.listSpecimen.loading);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  let styleText = {};

  const loadSpecimenList = () => {
    try {
      dispatch(
        fetchAllSpecimen({
          size: pageSize,
          page: currentPage,
          patientName: searchValue.trim(),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadSpecimenList();
  }, [currentPage, isAddSpecimen, isUpdateSpecimen, isUseSpecimen]);

  const handleSearch = (searchValue) => {
    try {
      if (currentPage === 0) {
        dispatch(
          fetchAllSpecimen({
            size: pageSize,
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
      <h2 className="font-bold mb-4">Quản lý mẫu vật</h2>
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">Có ({totalElements}) bản ghi</p>
        <Button
          variant="contained"
          color="info"
          endIcon={<FilterAltIcon />}
          onClick={() => setOpenFilter(true)}
        >
          <span className="leading-none">Lọc</span>
        </Button>
      </Box>
      <StyledTable size="small" style={{ marginTop: "15px" }}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>
              <div className="attibute">Tên mẫu vật</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Ngày nhận</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Ngày sử dụng</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Ngày giao</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Số lượng</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Đơn giá</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Loại dịch vụ</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Labo</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Bệnh nhân</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Trạng thái</div>
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listSpecimen.map((item) => (
            <StyledTableRow key={item.specimenId}>
              <StyledTableCell style={styleText}>
                {item.specimenName}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.receiveDate
                  ? moment(item.receiveDate).format("DD/MM/YYYY")
                  : ""}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.usedDate
                  ? moment(item.usedDate).format("DD/MM/YYYY")
                  : ""}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.deliveryDate
                  ? moment(item.deliveryDate).format("DD/MM/YYYY")
                  : ""}
              </StyledTableCell>
              <StyledTableCell style={styleText}>{item.amount}</StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.unitPrice}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.serviceName}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.laboName}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                {item.patientName}
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                <Chip
                  size="small"
                  style={{
                    backgroundColor: `${statusLaboColor(item.status)}`,
                    color: "#fff",
                  }}
                  label={statusLaboFormatter(item.status)}
                />
              </StyledTableCell>
              <StyledTableCell style={styleText}>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setModalUpdateOpen(true);
                    dispatch(setSpecimenId(item.specimenId));
                  }}
                >
                  <EditIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "14px 16px",
        }}
      >
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
            <p className="mb-1">Tên bệnh nhân</p>
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
        <ModalAddSpecimens
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div>
      <div>
        <ModalUpdateSpecimens
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
      <div>
        <ModalDetailSpecimen
          loadSpecimenList={loadSpecimenList}
          modalDetailOpen={modalDetailOpen}
          setModalDetailOpen={setModalDetailOpen}
        />
      </div>
    </>
  );
};

export default SpecimenManagementContent;
