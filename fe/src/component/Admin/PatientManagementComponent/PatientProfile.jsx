import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatient,
  setIsUpdatePatient,
} from "../../../redux/PatienSlice/choosenPatientSlice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Loading from "../../ui/Loading";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import BlockUpdatePatient from "./BlockUpdatePatient";
import ModalDeletePatient from "../../ModalComponent/ModalPatient/ModalDeletePatient";
import { Skeleton } from "antd";

const PatientProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const userInfo = {
    patientId: Number(id),
    patientName: useSelector((state) => state.choosenPatient.patientName),
    birthdate: useSelector((state) => state.choosenPatient.birthdate),
    gender: useSelector((state) => state.choosenPatient.gender),
    address: useSelector((state) => state.choosenPatient.address),
    phone: useSelector((state) => state.choosenPatient.phone),
    email: useSelector((state) => state.choosenPatient.email),
    bodyPrehistory: useSelector((state) => state.choosenPatient.bodyPrehistory),
    teethPrehistory: useSelector(
      (state) => state.choosenPatient.teethPrehistory
    ),
    status: useSelector((state) => state.choosenPatient.status),
    isDeleted: useSelector((state) => state.choosenPatient.isDeleted),
  };
  const loading = useSelector((state) => state.choosenPatient.loading);
  const bodyPrehistory = useSelector(
    (state) => state.choosenPatient.bodyPrehistory
  );
  const teethPrehistory = useSelector(
    (state) => state.choosenPatient.teethPrehistory
  );
  const isUpdatePatient = useSelector(
    (state) => state.choosenPatient.isUpdatePatient
  );

  const styleTxt = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "500px",
    display: "block",
    overflow: "hidden",
  };

  useEffect(() => {
    try {
      if (id) {
        dispatch(fetchPatient(id));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (id && isUpdatePatient) {
        dispatch(fetchPatient(id));
        dispatch(setIsUpdatePatient(false));
        setIsEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [isUpdatePatient]);

  useEffect(() => {
    if (isDelete) {
      navigate(-1);
    }
  }, [isDelete]);

  return (
    <>
      {loading && <Loading />}
      <Box className="mx-5">
        <div className="text-center mb-4">
          <span className="font-bold text-2xl">Thông tin bệnh nhân</span>
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
                  <BlockUpdatePatient
                    setIsEdit={setIsEdit}
                    userInfo={userInfo}
                  />
                </Box>
              ) : (
                <Box className="flex flex-col gap-3">
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Họ và tên:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.patientName}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Ngày sinh:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.birthdate}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Giới tính:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.gender ? (
                        <MaleIcon style={{ color: "rgb(65, 142, 237)" }} />
                      ) : (
                        <FemaleIcon style={{ color: "#f29cab" }} />
                      )}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Địa chỉ:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.address}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Điện thoại:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.phone}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Email:</p>
                    <Typography component="h1" color="inherit" noWrap>
                      {userInfo.email}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/5">Tiền sử cơ thể:</p>
                    <Typography component="h1" color="inherit" style={styleTxt}>
                      {bodyPrehistory}
                    </Typography>
                  </div>
                  <div className="attribute flex gap-3">
                    <p className="mb-1 font-bold w-1/4">Lịch sử răng miệng:</p>
                    <Typography
                      className=""
                      component="h1"
                      color="inherit"
                      style={styleTxt}
                    >
                      {teethPrehistory}
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
                  onClick={() => setIsEdit(true)}
                >
                  <span className="leading-none">Sửa</span>
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setModalDeleteOpen(true)}
                >
                  <span className="leading-none">Xóa</span>
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
        <ModalDeletePatient
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
          isSubmitForm={setIsDelete}
        />
      </Box>
    </>
  );
};

export default PatientProfile;
