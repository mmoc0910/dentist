import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, Box, Button } from "@mui/material";
import { Skeleton } from "antd";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import BlockUpdateProfile from "./BlockUpdateProfile";
import Loading from "../../ui/Loading";
import { useEffect } from "react";
import { profileAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { setIsUpdateAccount } from "../../../redux/AccountSlice/listAccountSlice";
import RoleTag from "../../ui/RoleTag";

const ProfileManagementContent = () => {
  const dispatch = useDispatch();
  const isUpdateAccount = useSelector(
    (state) => state.listAccount.isUpdateAccount
  );
  // let userInfo = {
  //   fullName: useSelector((state) => state.userProfile.fullName),
  //   roleName: useSelector((state) => state.userProfile.roleName),
  //   birthdate: useSelector((state) => state.userProfile.birthdate),
  //   phone: useSelector((state) => state.userProfile.phone),
  //   email: useSelector((state) => state.userProfile.email),
  //   salary: useSelector((state) => state.userProfile.salary),
  //   userName: useSelector((state) => state.userProfile.userName),
  // };

  const [loading, setLoading] = useState();
  const [isEdit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetchUserProf();
  }, []);

  useEffect(() => {
    if (isUpdateAccount) {
      fetchUserProf();
    }
  }, [isUpdateAccount]);

  const fetchUserProf = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(profileAPI);
      setUserInfo(res.data);
      dispatch(setIsUpdateAccount(false));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-3">Hồ sơ cá nhân</h2>
      <Box className="bg-white shadow-md rounded-lg px-5 py-3">
        <div className="text-center mb-4">
          <span className="font-bold text-2xl">Thông tin</span>
        </div>
        {!loading ? (
          <Box className="flex justify-between">
            <Box className="flex gap-16 w-full">
              <Box className="w-52 h-52 rounded-lg border-2 border-gray-400 p-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3034/3034882.png"
                  alt=""
                />
              </Box>
              {isEdit ? (
                <Box className="w-3/5">
                  <BlockUpdateProfile setIsEdit={setEdit} userInfo={userInfo} />
                </Box>
              ) : (
                <Box className="flex flex-col gap-3 w-3/5">
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Họ và tên:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.fullName}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Ngày sinh:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.birthdate}
                    </Typography>
                  </div>
                  {/* <div className="attribute flex gap-3">
                      <p className="mb-1 font-bold w-1/6">Giới tính:</p>
                      <Typography component="h1" color="inherit" noWrap>
                        {userInfo.gender ? (
                          <MaleIcon style={{ color: "rgb(65, 142, 237)" }} />
                        ) : (
                          <FemaleIcon style={{ color: "#f29cab" }} />
                        )}
                      </Typography>
                    </div> */}
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Điện thoại:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.phone}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Email:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.email}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Quyền hạn:</p>
                    <Box>
                    <RoleTag left role={userInfo.roleName} />
                    </Box>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Lương:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.salary} VND
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/6">Tên tài khoản:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.userName}
                    </Typography>
                  </div>
                </Box>
              )}
            </Box>
            {!isEdit && (
              <Box className="flex gap-3 h-fit">
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<EditIcon />}
                  onClick={() => setEdit(true)}
                >
                  <span className="leading-none">Sửa</span>
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="flex gap-16">
            <Box className="w-64 h-52 bg-slate-200 rounded-lg text-white flex items-center justify-center">
              ...
            </Box>
            <Skeleton paragraph={{ rows: 8 }} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProfileManagementContent;
