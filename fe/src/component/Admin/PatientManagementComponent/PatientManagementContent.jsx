import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  Typography,
  SwipeableDrawer,
  Button,
  TextField,
  Box,
  Chip,
} from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DatePickerDentist from "../../ui/date-picker/DatePickerDentist";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  fetchAllPatient,
  searchPatient,
  setLoading,
} from "../../../redux/PatienSlice/listPatientSlice";
import Loading from "../../ui/Loading";
import ModalAddPatient from "../../ModalComponent/ModalPatient/ModalAddPatient";
import axiosInstance from "../../../config/customAxios";
import {
  StyledTableCell,
  StyledTableRowClick,
  StyledTable,
} from "../../ui/TableElements";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";
import dayjs from "dayjs";
import moment from "moment";
import ModalAddSchedule from "../../ModalComponent/ModalSchedule/ModalAddSchedule";
import { fetchAllWaiting } from "../../../redux/WaitingSlice/listWaitingSlice";
import DoneIcon from "@mui/icons-material/Done";
import SockJsClient from "react-stomp";

const PatientManagementContent = () => {
  const dispatch = useDispatch();
  const listWaiting = useSelector((state) => state.listWaiting.listWaiting);
  console.log('list waiting ~ ', listWaiting)
  const listPatient = useSelector((state) => state.listPatient.listPatient);
  const isAddPatient = useSelector((state) => state.listPatient.isAddPatient);
  const pageSize = useSelector((state) => state.listPatient.pageSize);
  const loading = useSelector((state) => state.listPatient.loading);
  const loading_2 = useSelector((state) => state.listSchedule.loading);
  const totalPages = useSelector((state) => state.listPatient.totalPage);
  const totalElements = useSelector((state) => state.listPatient.totalElements);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalAddOpenSchedule, setModalAddOpenSchedule] = useState(false);
  const [isSubmitFormPatient, setIsSubmitFormPatient] = useState(false);
  const [patientSchedule, setPatientSchedule] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [refSocket, setRefSocket] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  const [role, setRole] = useState(null);

  const navigate = useNavigate();
  const { search } = useLocation();

  const useQuery = () => {
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  const query = useQuery();

  useEffect(() => {
    if (isFetch) {
      navigate({
        pathname: `/patient-management`,
        search: `?${createSearchParams({
          ...formatSearchParams,
          page: currentPage + 1,
        })}`,
      });
      dispatch(
        fetchAllPatient({
          ...searchValue,
          size: pageSize,
          page: currentPage,
        })
      );
    }
  }, [currentPage]);

  useEffect(() => {
    if (query) {
      setCurrentPage(+query.get("page") - 1 > 0 ? +query.get("page") - 1 : 0);
      const filterInit = {
        ...(query.get("name") && { name: query.get("name") }),
        ...(query.get("birthdate") && { birthdate: query.get("birthdate") }),
        ...(query.get("address") && { address: query.get("address") }),
        ...(query.get("address") && { address: query.get("address") }),
        ...(query.get("email") && { email: query.get("email") }),
        ...(query.get("phone") && { phone: query.get("phone") }),
      };
      dispatch(
        searchPatient({
          ...filterInit,
          size: pageSize,
          page: +query.get("page") - 1 || 0,
        })
      );
      setSearchValue({
        ...searchValue,
        ...filterInit,
      });
      setIsFetch(true);
      setIsFilter(true);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    dispatch(fetchAllWaiting());
  }, []);

  const [searchValue, setSearchValue] = useState({
    name: "",
    birthdate: "",
    address: "",
    phone: "",
    email: "",
  });

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
    return status === 0
      ? "Chưa Chữa Trị"
      : status === 1
      ? "Đang Chữa"
      : "Đã Chữa Trị";
  };

  const mapListWaiting = useMemo(() => {
    if (listWaiting?.length) {
      return listWaiting?.map((item) => item.patientId);
    }
    return [];
  }, [listWaiting]);

  useEffect(() => {
    if (isAddPatient) {
      dispatch(
        fetchAllPatient({
          ...searchValue,
          size: pageSize,
          page: currentPage,
        })
      );
    }
  }, [isAddPatient]);

  const handleSearch = async (search = searchValue) => {
    try {
      for (const property in search) {
        search[property] = search[property]?.trim() || search[property];
      }
      if (currentPage === 0) {
        dispatch(
          searchPatient({
            ...search,
            size: pageSize,
            page: 0,
          })
        );
      } else {
        setCurrentPage(0);
      }
      navigate({
        pathname: `/patient-management`,
        search: `?${createSearchParams({
          ...formatSearchParamsFunc(search),
          page: currentPage + 1,
        })}`,
      });
      setOpenFilter(false);
      setIsFilter(true);
    } catch (error) {
      setIsFilter(false);
      console.log(error);
    }
  };

  const formatSearchParams = useMemo(() => {
    let query = {};
    for (const prop in searchValue) {
      if (searchValue[prop]) {
        query[prop] = searchValue[prop].trim();
      }
    }
    return query;
  }, [searchValue]);

  const formatSearchParamsFunc = (searchValue) => {
    let query = {};
    for (const prop in searchValue) {
      if (searchValue[prop]) {
        query[prop] = searchValue[prop];
      }
    }
    return query;
  };

  const enableButtonSearch = useMemo(
    () =>
      searchValue.name ||
      searchValue.address ||
      searchValue.phone ||
      searchValue.birthdate ||
      searchValue.email,
    [searchValue]
  );

  const onResetFilter = () => {
    const newSearchValue = {
      name: "",
      birthdate: "",
      address: "",
      phone: "",
      email: "",
    };
    setSearchValue(newSearchValue);
    handleSearch(newSearchValue);
    setIsFilter(false);
  };

  const addWaitingPatient = async (patientId) => {
    try {
      dispatch(setLoading(true));
      await axiosInstance.post(
        process.env.REACT_APP_BASE_URL +
          "/api/patients/" +
          patientId +
          "/waiting_room"
      );
      dispatch(fetchAllWaiting());
      refSocket.sendMessage(
        "/topic/group",
        JSON.stringify({ message: "re-fetch" })
      );
      dispatch(setLoading(false));
      toast.success("Thêm bệnh nhân vào phòng chờ thành công");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Thêm bệnh nhân vào phòng chờ không thành công");
    }
  };

  const handleToDoMessageSocket = ({ message }) => {
    switch (message) {
      case "re-fetch":
        dispatch(fetchAllWaiting());
        break;
    }
  };

  return (
    <>
      {(loading || loading_2) && <Loading />}
      <h2 className="font-bold mb-4">Danh Sách Bệnh Nhân</h2>
      <SockJsClient
        url={process.env.REACT_APP_SOCKET_URL}
        topics={["/topic/group"]}
        onDisconnect={() => console.log("Disconnected!")}
        onMessage={handleToDoMessageSocket}
        ref={(client) => setRefSocket(client)}
      />
      <Box className="flex items-center gap-3 mb-3">
        <p className="font-bold text-lg mb-0">Có ({totalElements}) bản ghi</p>
        {role === "Doctor" || role === "Nurse" ? (
          <></>
        ) : (
          <Button
            variant="contained"
            color="success"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              setModalAddOpen(true);
            }}
          >
            <span className="leading-none">Thêm bệnh nhân mới</span>
          </Button>
        )}
        <Button
          variant="contained"
          color="info"
          endIcon={<FilterAltIcon />}
          onClick={() => setOpenFilter(true)}
        >
          <span className="leading-none">Lọc</span>
        </Button>
      </Box>

      <StyledTable size="small" className="shadow-md">
        <TableHead>
          <StyledTableRowClick>
            <StyledTableCell>Họ tên</StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Ngày sinh</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Số điện thoại</div>
            </StyledTableCell>
            <StyledTableCell
              style={{
                verticalAlign: "top",
              }}
            >
              <div className="attibute">Giới tính</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Địa chỉ</div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="attibute">Email</div>
            </StyledTableCell>
            <StyledTableCell
              style={{
                verticalAlign: "text-top",
              }}
            >
              <div className="attibute">Trạng thái</div>
            </StyledTableCell>
            {(role === "Receptionist" || role === "Admin") && (
              <StyledTableCell></StyledTableCell>
            )}
            <StyledTableCell></StyledTableCell>
          </StyledTableRowClick>
        </TableHead>
        {totalPages === 0 ? null : (
          <TableBody>
            {listPatient?.map((item) => (
              <StyledTableRowClick
                className="hover cursor-pointer"
                key={item.patientId}
                onClick={() => {
                  navigate({
                    pathname: `profile/${item.patientId}`,
                    search: `?${createSearchParams({
                      ...formatSearchParams,
                      page: currentPage + 1,
                    })}`,
                  });
                }}
              >
                <StyledTableCell>{item.patientName}</StyledTableCell>
                <StyledTableCell>
                  {dayjs(item.birthdate).format("DD/MM/YYYY")}
                </StyledTableCell>
                <StyledTableCell>{item.phone}</StyledTableCell>
                <StyledTableCell>
                  {item.gender ? (
                    <MaleIcon style={{ color: "rgb(65, 142, 237)" }} />
                  ) : (
                    <FemaleIcon style={{ color: "#f29cab" }} />
                  )}
                </StyledTableCell>
                <StyledTableCell>{item.address}</StyledTableCell>
                <StyledTableCell>{item.email}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    size="small"
                    label={statusFormatter(item.status)}
                    style={{
                      background: `${renderColor(item.status)}`,
                      color: "#fff",
                    }}
                  />
                </StyledTableCell>
                {(role === "Receptionist" || role === "Admin") && (
                  <StyledTableCell>
                    {!mapListWaiting.includes(item.patientId) ? (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addWaitingPatient(item.patientId);
                        }}
                      >
                        <span className="leading-none">Thêm vào phòng chờ</span>
                      </Button>
                    ) : (
                      <Chip
                        size="medium"
                        color="success"
                        label={
                          <Box className="flex items-center">
                            <DoneIcon className="mr-1" />
                            Đã thêm vào phòng chờ
                          </Box>
                        }
                      ></Chip>
                    )}
                  </StyledTableCell>
                )}
                <StyledTableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<ScheduleIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPatientSchedule(item);
                      setTimeout(() => {
                        setModalAddOpenSchedule(true);
                      });
                    }}
                  >
                    <span className="leading-none">Đặt lịch</span>
                  </Button>
                </StyledTableCell>
              </StyledTableRowClick>
            ))}
          </TableBody>
        )}
      </StyledTable>
      {totalPages === 0 && (
        <Typography
          component="h1"
          variant="h5"
          color="inherit"
          noWrap
          textAlign="center"
          width="100%"
          padding="100px"
        >
          {/* Không có bệnh nhân nào */}
        </Typography>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "14px 16px",
        }}
      >
        {totalPages > 1 ? (
          <Pagination
            page={currentPage + 1}
            count={totalPages}
            color="primary"
            onChange={(e, pageNumber) => {
              setCurrentPage(pageNumber - 1);
            }}
          />
        ) : null}
      </div>
      <div>
        <ModalAddPatient
          modalAddOpen={modalAddOpen}
          setModalAddOpen={setModalAddOpen}
          isSubmitForm={setIsSubmitFormPatient}
        />
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
            <p className="mb-1">Họ tên</p>
            <TextField
              required
              fullWidth
              value={searchValue.name}
              onChange={(newValue) =>
                setSearchValue({
                  ...searchValue,
                  name: newValue.target.value,
                })
              }
            />
          </Box>
          <Box className="mb-3">
            <p className="mb-1">Ngày sinh</p>
            <DatePickerDentist
              height="56px"
              value={searchValue.birthdate}
              onChange={(value) => {
                setSearchValue({
                  ...searchValue,
                  birthdate: value ? moment(value).format("YYYY-MM-DD") : "",
                });
              }}
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
          <Box className="mb-3">
            <p className="mb-1">Địa chỉ</p>
            <TextField
              required
              fullWidth
              value={searchValue.address}
              onChange={(newValue) =>
                setSearchValue({
                  ...searchValue,
                  address: newValue.target.value,
                })
              }
            />
          </Box>
          <Box className="mb-3">
            <p className="mb-1">Email</p>
            <TextField
              required
              fullWidth
              value={searchValue.email}
              onChange={(newValue) =>
                setSearchValue({
                  ...searchValue,
                  email: newValue.target.value,
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
        <ModalAddSchedule
          patient={patientSchedule}
          modalAddOpen={modalAddOpenSchedule}
          setModalAddOpen={setModalAddOpenSchedule}
        />
      </div>
    </>
  );
};

export default PatientManagementContent;
