import {
  Avatar,
  Badge,
  Box,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Logo from "../../../img/ngang.png";
import Dropdown from "react-bootstrap/Dropdown";
import { fetchUserProfile } from "../../../redux/ProfileSlice/userProfileSlice";
import { Link } from "react-router-dom";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RoleTag from "../../ui/RoleTag";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { Popover } from "antd";
import NotiCard from "../../ui/noti";
import SockJsClient from "react-stomp";
import {
  getListNotifies,
  readNoti,
} from "../../../redux/AccountSlice/choosenAccountSlice";
import { toast } from "react-toastify";
import { toastBottomCss } from "../../../redux/toastCss";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Loading from "../../ui/Loading";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import KeyIcon from "@mui/icons-material/Key";
const HeaderAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullName = useSelector((state) => state.userProfile.fullName);
  const roleName = useSelector((state) => state.userProfile.roleName);
  const listNotifies = useSelector(
    (state) => state.choosenAccount.listNotifies
  );
  const isUpdateNoti = useSelector(
    (state) => state.choosenAccount.isUpdateNoti
  );
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConnected = () => {
    console.log(listNotifies);
  };
  const isReceptionist = useMemo(() => {
    if (roleName === "Receptionist") {
      dispatch(getListNotifies());
    }
    return roleName === "Receptionist";
  }, [roleName]);

  useEffect(() => {
    try {
      dispatch(fetchUserProfile());
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    if (isUpdateNoti && isReceptionist) {
      dispatch(getListNotifies());
    }
  }, [isUpdateNoti]);

  const fetchListNoti = ({ patient, doctor }) => {
    toast(
      <Box
        className="flex gap-3 w-[270px] p-2"
        onClick={() => navigate("/waitting-room/request")}
      >
        <Avatar
          alt={patient.patientID}
          src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?w=2000"
        />
        <Box>
          <p className={`text-xs`}>
            Bác sĩ{" "}
            <span className="font-bold text-black">{doctor.fullName}</span> đang
            yêu cầu khám bệnh cho{" "}
            <span className="font-bold text-black">{patient.patientName}</span>
          </p>
        </Box>
      </Box>,
      toastBottomCss
    );
  };

  const handleMessageSocket = ({ message, patient, doctor }) => {
    if (message === "re-fetch-noti") {
      dispatch(getListNotifies());
      return;
    }
    fetchListNoti({ patient, doctor });
  };

  const listNoti = useMemo(() => {
    if (isReceptionist) {
      return (
        <Box height="450px" className="overflow-y-scroll">
          {listNotifies?.map((item) => (
            <Box
              onClick={() => {
                dispatch(readNoti(item.notifyId));
                navigate(`/bill?phone=${item.phone}`);
                setIsOpenNoti(false);
              }}
            >
              <NotiCard
                time={item.time}
                seen={item.isRead}
                message={
                  <p className="italic mb-0 text-xs">
                    Bệnh nhân <span className="not-italic text-sm">{item.patientName}</span> đã khám bệnh xong
                  </p>
                }
              />
            </Box>
          ))}
        </Box>
      );
    }
    return <></>;
  }, [listNotifies]);

  return (
    <Box className="flex gap-4 items-center">
      {loading && <Loading />}
      <SockJsClient
        url={process.env.REACT_APP_SOCKET_URL}
        topics={[`/topic/${roleName}`]}
        onConnect={onConnected}
        onDisconnect={() => console.log("Disconnected!")}
        onMessage={handleMessageSocket}
        debug={false}
      />
      {isReceptionist && (
        <Box className="relative">
          <Popover
            title={`Có (${
              listNotifies.filter((item) => !item.isRead)?.length
            }) thông báo chưa xem`}
            placement="bottom"
            content={listNoti}
            trigger="click"
            visible={isOpenNoti}
            onVisibleChange={() => setIsOpenNoti(!isOpenNoti)}
          >
            <Badge
              color="error"
              badgeContent={listNotifies.filter((item) => !item.isRead)?.length}
              max={99}
              className="cursor-pointer"
            >
              <NotificationsIcon />
            </Badge>
          </Popover>
          {/* <img width={50} className="absolute bottom-6 left-5" src="https://cdn-icons-png.flaticon.com/512/2089/2089117.png" alt="" /> */}
        </Box>
      )}
      <Dropdown>
        <Dropdown.Toggle
          id="dropdown-basic"
          className="bg-transparent border-0 gap-2 relative"
          style={{ display: "flex", alignItems: "center" }}
        >
          {roleName && (
            <RoleTag className="absolute" title={fullName} role={roleName} />
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="border-0 shadow-md">
          <Dropdown.Item>
            <Link
              to="/profile"
              className="flex items-center decoration-transparent font-semibold text-black"
            >
              <FolderSharedIcon
                sx={{
                  fontSize: "25px",
                }}
              />
              <span className="ml-2">Hồ sơ cá nhân</span>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              to="/change-password"
              className="flex items-center decoration-transparent font-semibold text-black"
            >
              <KeyIcon
                sx={{
                  fontSize: "25px",
                }}
              />
              <span className="ml-2">Đổi mật khẩu</span>
            </Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.clear();
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  navigate("/login");
                }, 500);
              }}
            >
              <PowerSettingsNewIcon
                sx={{
                  fontSize: "20px",
                }}
              />
              <span className="leading-none ml-2"> Đăng xuất</span>
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Box>
  );
};

export default HeaderAdmin;
