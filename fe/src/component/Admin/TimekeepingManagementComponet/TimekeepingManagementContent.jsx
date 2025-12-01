import { LoadingButton } from "@mui/lab";
import { Box, Button, Pagination, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CHECK_IN,
  CHECK_OUT,
  GET_LIST_TIMEKEEPING,
} from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { toastCss } from "../../../redux/toastCss";
import TableTimeKeepingManagement from "./TableTimeKeepingManagement";
import Loading from "../../ui/Loading";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

const TimekeepingManagementContent = () => {
  const [listTimekeeping, setListTimekeeping] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(false);
  const [isCheckin, setIsCheckin] = useState(true);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(GET_LIST_TIMEKEEPING + currentPage);
      const { checkinEnable, timekeepingDTOS } = res.data;
      setIsCheckin(checkinEnable);
      setListTimekeeping(timekeepingDTOS.content);
      setCurrentPage(timekeepingDTOS.number);
      setTotalPages(timekeepingDTOS.totalPages);
      setTotalItem(timekeepingDTOS.totalElements);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const checkInOut = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(isCheckin ? CHECK_IN : CHECK_OUT);
      if (res.status === 200) setCount((prevCount) => prevCount + 1);
      toast.success("Đã kết thúc giờ làm", toastCss)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (!isCheckin) toast.error("Chỉ có thể kết thúc giờ làm sau 3 tiếng!", toastCss);
    }
  };
  const handleOnClick = () => {
    checkInOut();
  };
  useEffect(() => {
    loadData();
  }, [count, currentPage]);
  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Danh Sách Chấm Công</h2>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}
        className="gap-3 items-center mb-3"
      >
        <p className="mb-0 font-bold text-lg">Có ({totalItem}) bản ghi</p>
        {role !== "Admin" && (
          <Box>
            {isCheckin ? (
              <Button
                variant="outlined"
                color="success"
                onClick={handleOnClick}
              >
                <FingerprintIcon className="mr-2" />
                Bắt đầu
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOnClick}
              >
                <FingerprintIcon className="mr-2" />
                Kết thúc
              </Button>
            )}
          </Box>
        )}
      </div>
      <TableTimeKeepingManagement
        listTimekeeping={listTimekeeping}
        role={role}
        currentPage={currentPage}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "14px 16px",
        }}
      >
        {totalPages > 1 ? (
          <Pagination
            count={totalPages}
            color="primary"
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div>
    </>
  );
};

export default TimekeepingManagementContent;
