import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Pagination, Typography, IconButton, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Loading from "../../ui/Loading";
import { fetchAllAccount } from "../../../redux/AccountSlice/listAccountSlice";
import ModalUpdateAccount from "../../ModalComponent/ModalAccount/ModalUpdateAccount";
import ModalDeleteAccount from "../../ModalComponent/ModalAccount/ModalDeleteAccount";
import ModalAddAcount from "../../ModalComponent/ModalAccount/ModalAddAccount";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RoleTag from "../../ui/RoleTag";

const AccountManagementContent = () => {
  const listAccount = useSelector((state) => state.listAccount.listAccount);
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listAccount.pageSize);
  const totalPages = useSelector((state) => state.listAccount.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  const totalElements = useSelector((state) => state.listAccount.totalElements);
  const isUpdateAccount = useSelector(
    (state) => state.listAccount.isUpdateAccount
  );
  const isDeleteAccount = useSelector(
    (state) => state.listAccount.isDeleteAccount
  );
  const isAddAccount = useSelector((state) => state.listAccount.isAddAccount);
  const loading = useSelector((state) => state.listAccount.loading);

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);

  useEffect(() => {
    if (isDeleteAccount && currentPage >= 0 && totalElements % pageSize == 1) {
      const newCurrentPage = currentPage - 1;
      setCurrentPage((prev) => prev - 1);
      dispatch(
        fetchAllAccount({
          size: pageSize,
          page: newCurrentPage,
        })
      );
      return;
    }
    dispatch(
      fetchAllAccount({
        size: pageSize,
        page: currentPage,
      })
    );
  }, [currentPage, isDeleteAccount]);

  useEffect(() => {
    if (isUpdateAccount || isAddAccount) {
      dispatch(
        fetchAllAccount({
          size: pageSize,
          page: currentPage,
        })
      );
    }
  }, [isUpdateAccount, isAddAccount]);

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Danh Sách Tài Khoản</h2>
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">Có ({totalElements}) bản ghi</p>
        <Button
          variant="contained"
          color="success"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            setModalAddOpen(true);
          }}
        >
          <span className="leading-none">Tạo tài khoản</span>
        </Button>
      </Box>
      <StyledTable size="small" className="shadow-md">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Họ tên</StyledTableCell>
            <StyledTableCell>Tên đăng nhập</StyledTableCell>
            <StyledTableCell>Số điện thoại</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Ngày sinh</StyledTableCell>
            <StyledTableCell>Quyền hạn</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <>
          <TableBody>
            {listAccount.map((item) => (
              <StyledTableRow key={item.userId}>
                <StyledTableCell>{item.fullName}</StyledTableCell>
                <StyledTableCell>{item.userName}</StyledTableCell>
                <StyledTableCell>{item.phone}</StyledTableCell>
                <StyledTableCell>{item.email}</StyledTableCell>
                <StyledTableCell>{item.birthdate}</StyledTableCell>
                <StyledTableCell>
                  <RoleTag role={item.roleName} />
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setModalDeleteOpen(true);
                      dispatch(setUserId(item.userId));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setModalUpdateOpen(true);
                      dispatch(setUserId(item.userId));
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </>
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
            count={totalPages}
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div>
      <div>
        <ModalUpdateAccount
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>
      <div>
        <ModalDeleteAccount
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
        />
      </div>
      <div>
        <ModalAddAcount
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
        />
      </div>
    </>
  );
};

export default AccountManagementContent;
