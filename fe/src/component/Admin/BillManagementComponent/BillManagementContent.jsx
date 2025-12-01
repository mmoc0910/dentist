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
  SwipeableDrawer,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIncomeId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { fetchAllBill } from "../../../redux/BillSlice/listBillSlice";
import { setTreatmentId } from "../../../redux/modalSlice";
import ModalDetailBill from "../../ModalComponent/ModalBill/ModalDetailBill";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ModalListReceipt from "../../ModalComponent/ModalBill/ModalListReceipt";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { useMemo } from "react";
import Loading from "../../ui/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import SockJsClient from "react-stomp";

const BillManagementContent = () => {
  const listBill = useSelector((state) => state.listBill.listBill);
  const totalElements = useSelector((state) => state.listBill.totalElements);
  const loading = useSelector((state) => state.listBill.loading);

  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listBill.pageSize);
  const totalPages = useSelector((state) => state.listBill.totalPage);
  const [currentPage, setCurrentPage] = useState(0);

  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [modalReceiptOpen, setModalReceiptOpen] = useState(false);

  // const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [searchValue, setSearchValue] = useState({
    patientName: "",
    phone: "",
  });
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  const navigate = useNavigate();
  const query = useQuery();
  const phone = useMemo(() => query.get("phone"), [query]);

  const fetchData = () => {
    for (const property in searchValue) {
      searchValue[property] = searchValue[property].trim();
    }
    dispatch(
      fetchAllBill({
        ...searchValue,
        size: 12,
        page: currentPage,
      })
    );
  };

  useEffect(() => {
    if (phone) {
      const valueSearch = {
        patientName: "",
        phone: phone,
      };
      setSearchValue(valueSearch);
      handleSearch(valueSearch);
      return
    }
    fetchData();
  }, [currentPage, phone]);

  const handleSearch = async (search = searchValue) => {
    try {
      if (currentPage === 0) {
        for (const property in search) {
          search[property] = search[property].trim();
        }
        dispatch(
          fetchAllBill({
            ...search,
            size: pageSize,
            page: 0,
          })
        );
      } else {
        setCurrentPage(0);
      }
      setOpenFilter(false);
      setIsFilter(true)
    } catch (error) {
      setIsFilter(false)
      console.log(error);
    }
  };

  const enableButtonSearch = useMemo(
    () => searchValue.patientName || searchValue.phone,
    [searchValue]
  );

  const onResetFilter = () => {
    const newSearchValue = {
      patientName: "",
      phone: "",
    };
    navigate("/bill")
    setSearchValue(newSearchValue);
    handleSearch(newSearchValue);
    setIsFilter(false);
  };

  const handleMessageSocket = ({ message }) => {
    if (message === "re-fetch-bill") {
      fetchData();
    }
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Danh Sách Hóa Đơn</h2>
      <SockJsClient
        url={process.env.REACT_APP_SOCKET_URL}
        topics={[`/topic/group`]}
        onMessage={handleMessageSocket}
      />
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
      <StyledTable size="small" className="shadow-md mb-4">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tên bệnh nhân
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Số điện thoại
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Giá gốc
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Giảm giá
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Tổng tiền
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {listBill.map((item, index) => (
            <StyledTableRow size="medium" key={item.treatmentId}>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>{item.phone}</StyledTableCell>
              <StyledTableCell>{item.totalPrice}</StyledTableCell>
              <StyledTableCell>{item.totalDiscount}</StyledTableCell>
              <StyledTableCell>{item.realCost}</StyledTableCell>
              <StyledTableCell>
                <IconButton
                  aria-label="receipt-list"
                  onClick={() => {
                    dispatch(setTreatmentId(item.treatmentId));
                    setModalReceiptOpen(true);
                  }}
                >
                  <ReceiptIcon />
                </IconButton>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  aria-label="detail"
                  onClick={() => {
                    setModalDetailOpen(true);
                    dispatch(setTreatmentId(item.treatmentId));
                  }}
                >
                  <RemoveRedEyeIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      {totalPages === 0 && (
        <Typography
          component="h1"
          variant="h5"
          color="inherit"
          noWrap
          textAlign="center"
        >
        </Typography>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
              value={searchValue.patientName}
              onChange={(newValue) =>
                setSearchValue({
                  ...searchValue,
                  patientName: newValue.target.value,
                })
              }
            />
          </Box>
          <Box className="mb-3">
            <p className="mb-1">Số điện thoại</p>
            <TextField
              required
              fullWidth
              value={searchValue.phone}
              onChange={(newValue) =>
                setSearchValue({
                  ...searchValue,
                  phone: newValue.target.value,
                })
              }
            />
          </Box>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              className="mr-3"
              onClick={() => handleSearch(searchValue)}
              disabled={!enableButtonSearch}
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
        <ModalDetailBill
          modalDetailOpen={modalDetailOpen}
          setModalDetailOpen={setModalDetailOpen}
        />
      </div>

      <div>
        <ModalListReceipt
          modalReceiptOpen={modalReceiptOpen}
          setModalReceiptOpen={setModalReceiptOpen}
        />
      </div>
    </>
  );
};

export default BillManagementContent;
