import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import {
  Pagination,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllWaiting,
  callWaiting,
  deleteWaiting,
} from "../../../redux/WaitingSlice/listWaitingSlice";
import moment from "moment";
// import {
//   updateWaitingAPI,
//   listConfirmWaitingAPI,
// } from "../../../config/baseAPI";
// import axiosInstance from "../../../config/customAxios";
// import ModalConfirmWaiting from "../../ModalComponent/ModalWaiting/ModalConfirmWaiting";
import Loading from "../../ui/Loading";
import { ToastContainer, toast } from "react-toastify";
import SockJsClient from "react-stomp";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { Tabs } from "antd";
import {
  confirmWaiting,
  fetchAllConfirmWaiting,
} from "../../../redux/WaitingSlice/listConfirmWaitingSlice";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastBottomCss } from "../../../redux/toastCss";

const WaitingRoomManagementContent = () => {
  const navigate = useNavigate();
  const { tab } = useParams();

  const listWaiting = useSelector((state) => state.listWaiting.listWaiting);
  const listConfirmWaiting = useSelector(
    (state) => state.listConfirmWaiting.listConfirmWaiting
  );
  const dispatch = useDispatch();
  const pageSize = 100;
  const totalPages = useSelector((state) => state.listWaiting.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  const totalElements = useSelector((state) => state.listWaiting.totalElements);
  const [modalConfirmWaitingOpen, setModalConfirmWaitingOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [refSocket, setRefSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const isCallWaiting = useSelector((state) => state.listWaiting.isCallWaiting);
  const isDeleteWaiting = useSelector(
    (state) => state.listWaiting.isDeleteWaiting
  );
  const isConfirmed = useSelector(
    (state) => state.listConfirmWaiting.isConfirmed
  );
  let userInfo = {
    fullName: useSelector((state) => state.userProfile.fullName),
    userId: useSelector((state) => state.userProfile.userId),
    roleName: useSelector((state) => state.userProfile.roleName),
    userName: useSelector((state) => state.userProfile.userName),
  };

  const loadWaitingList = () => {
    setLoading(true);
    dispatch(fetchAllConfirmWaiting());
    dispatch(
      fetchAllWaiting({
        size: pageSize,
        page: currentPage,
      })
    );
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const onConnected = () => {};

  useEffect(() => {
    const role = localStorage.getItem("role");
    loadWaitingList();
    setRole(role);
  }, []);
  useEffect(() => {
    if (isConfirmed) {
      loadWaitingList();
    }
  }, [isConfirmed]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchAllWaiting({
        size: pageSize,
        page: currentPage,
      })
    );
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [currentPage]);

  const getStatusStr = (status) => {
    if (status == 1) {
      return { txt: "Đang chữa", color: "#0288d1" };
    }
    if (status == 2) {
      return { txt: "Đang chờ", color: "#e18220" };
    } else {
      return { txt: "Đến lượt", color: "#000" };
    }
  };
  
  const handleToDoMessageSocket = ({ message, patient }) => {
    loadWaitingList();
    switch (message) {
      // case "re-fetch":
      //   loadWaitingList();
      //   break;
      case "approve":
        toast(
          <Box
            className="flex gap-3 w-[270px] p-2"
            onClick={() => navigate("/waitting-room/request")}
          >
            <Avatar
              alt={patient.patientId}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7K_BymR7sR84itVOX-NP9P2DIjcL87a8VJ-8bpNNTQg&s"
            />
            <Box>
              <p className={`text-xs`}>
                Yêu cầu khám cho{" "}
                <span className="font-bold text-black">
                  {patient.patientName}
                </span>{" "}
                đã được duyệt.
              </p>
            </Box>
          </Box>,
          toastBottomCss
        );

        break;
      case "reject":
        toast(
          <Box
            className="flex gap-3 w-[270px] p-2"
            onClick={() => navigate("/waitting-room/request")}
          >
            <Avatar
              alt={patient.patientId}
              src="https://cdn-icons-png.flaticon.com/512/5978/5978441.png"
            />
            <Box>
              <p className={`text-xs`}>
                Yêu cầu khám cho{" "}
                <span className="font-bold text-black">
                  {patient.patientName}
                </span>{" "}
                bị từ chối do không tới khám.
              </p>
            </Box>
          </Box>,
          toastBottomCss
        );
        break;
    }
  };

  const requestPatient = async (patient) => {
    try {
      await dispatch(callWaiting(patient.waitingRoomId));
      refSocket.sendMessage(
        "/topic/Receptionist",
        JSON.stringify({ patient, doctor: userInfo })
      );
      setTimeout(() => {
        refSocket.sendMessage(
          "/topic/group",
          JSON.stringify({ message: "re-fetch" })
        );
      }, 1000);
    } catch (err) {
      toast.error(err, toastBottomCss);
    }
  };

  const remove = async (id) => {
    try {
      await dispatch(deleteWaiting(id));
      refSocket.sendMessage(
        "/topic/group",
        JSON.stringify({ message: "re-fetch" })
      );
    } catch (err) {
      toast.error(err, toastBottomCss);
    }
  };

  const WaittingRoom = useMemo(() => {
    return (
      <>
        <StyledTable size="small" className="shadow-md w-full">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Bệnh nhân</StyledTableCell>
              <StyledTableCell>Ngày</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {listWaiting?.map((item) => (
              <StyledTableRow key={item.waitingRoomId}>
                <StyledTableCell>{item.patientName}</StyledTableCell>
                <StyledTableCell>
                  {moment(item.date).format("DD/MM/YYYY")}
                </StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={getStatusStr(item.status).txt}
                    style={{
                      background: `${getStatusStr(item.status).color}`,
                      color: "#fff",
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  {item.status === 2 && (
                    <Box>
                      {role === "Receptionist" ? (
                        <Box>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              remove(item.waitingRoomId);
                            }}
                          >
                            <span className="leading-none">Hủy chờ</span>
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              requestPatient(item);
                            }}
                          >
                            <span className="leading-none">Đăng kí khám</span>
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </>
    );
  }, [listWaiting]);

  const WaitingPatientRequest = useMemo(() => {
    return (
      <StyledTable size="small" className="shadow-md w-full">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Bệnh nhân</StyledTableCell>
            <StyledTableCell>Bác sĩ yêu cầu</StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listConfirmWaiting?.map((item) => (
            <StyledTableRow key={item.waitingRoomId}>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>{item.userName}</StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  color="success"
                  onClick={async () => {
                    try {
                      await dispatch(
                        confirmWaiting({
                          id: item.waitingRoomId,
                          isAttend: 1,
                        })
                      );
                      refSocket.sendMessage(
                        `/topic/${item.userId}`,
                        JSON.stringify({
                          message: "approve",
                          patient: item,
                        })
                      );
                    } catch (err) {
                      toast.error(err, toastBottomCss);
                    }
                  }}
                >
                  <span className="leading-none text-xs">Chấp nhận</span>
                </Button>
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    try {
                      await dispatch(
                        confirmWaiting({
                          id: item.waitingRoomId,
                          isAttend: 0,
                        })
                      );
                      refSocket.sendMessage(
                        `/topic/${item.userId}`,
                        JSON.stringify({
                          message: "reject",
                          patient: item,
                        })
                      );
                    } catch (err) {
                      toast.error(err, toastBottomCss);
                    }
                  }}
                >
                  <span className="leading-none text-xs">Vắng mặt</span>
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    );
  }, [listConfirmWaiting]);

  const MyListRequest = useMemo(() => {
    const listFilter = listWaiting.filter(
      (item) => item.userId === userInfo.userId && item.status === 1
    );
    return (
      <StyledTable size="small" className="shadow-md w-full">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Bệnh nhân</StyledTableCell>
            <StyledTableCell>Ngày</StyledTableCell>
            <StyledTableCell>Trạng thái</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listFilter?.map((item) => (
            <StyledTableRow key={item.waitingRoomId}>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>
                {moment(item.date).format("DD/MM/YYYY")}
              </StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={getStatusStr(item.status).txt}
                  style={{
                    background: `${getStatusStr(item.status).color}`,
                    color: "#fff",
                  }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  color="info"
                  // startIcon={<AddIcon />}
                  onClick={() => {
                    navigate(`/patient-management/profile/${item.patientId}`);
                  }}
                >
                  <span className="leading-none">Khám</span>
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    );
  }, [listWaiting]);

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Quản Lý Phòng Chờ</h2>
      <SockJsClient
        url={process.env.REACT_APP_SOCKET_URL}
        topics={[`/topic/${userInfo.userId}`, `/topic/${role}`, "/topic/group"]}
        onConnect={onConnected}
        onDisconnect={() => console.log("Disconnected!")}
        onMessage={handleToDoMessageSocket}
        debug={false}
        ref={(client) => setRefSocket(client)}
      />
      <Tabs
        defaultActiveKey={tab}
        className="mt-3 w-full"
        onChange={(tab) => navigate(`/waitting-room/${tab}`)}
        items={[
          {
            label: (
              <p className="mb-0 font-medium text-lg">
                Đang ở phòng chờ ({totalElements})
              </p>
            ),
            key: "list",
            children: WaittingRoom,
          },
          {
            label: (
              <p className="mb-0 font-medium text-lg">
                {role !== "Receptionist"
                  ? `Duyệt của tôi (${
                      listWaiting.filter(
                        (item) =>
                          item.userId === userInfo.userId && item.status === 1
                      )?.length
                    })`
                  : `Đang được yêu cầu (${listConfirmWaiting.length})`}
              </p>
            ),
            key: "request",
            children:
              role !== "Receptionist" ? MyListRequest : WaitingPatientRequest,
          },
        ]}
      />
    </>
  );
};

export default WaitingRoomManagementContent;
