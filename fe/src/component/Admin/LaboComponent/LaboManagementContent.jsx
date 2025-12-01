import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import Box from "@mui/material/Box";
import { Pagination, Typography, IconButton, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLaboId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { fetchAllLabo } from "../../../redux/LaboSlice/listLaboSlice";
import ModalUpdateLabo from "../../ModalComponent/ModalLabo/ModalUpdateLabo";
import ModalDeleteLabo from "../../ModalComponent/ModalLabo/ModalDeleteLabo";
import ModalAddLabo from "../../ModalComponent/ModalLabo/ModalAddLabo";
import DetailLaboRecord from "./DetailLaboRecord";
import InputDentist from "../../ui/input";
import ModalSendSample from "../../ModalComponent/ModalLabo/ModalSendSample";
import ModalReceivedSample from "../../ModalComponent/ModalLabo/ModalReceivedSample";
import Loading from "../../ui/Loading";
import { Skeleton } from "antd";

const LaboManagementContent = () => {
  const dispatch = useDispatch();
  const allLabo = useSelector((state) => state.listLabo.listLabo);
  const pageSize = 10;
  const isUpdateLabo = useSelector((state) => state.listLabo.isUpdateLabo);
  const isDeleteLabo = useSelector((state) => state.listLabo.isDeleteLabo);
  const isAddLabo = useSelector((state) => state.listLabo.isAddLabo);
  const loading = useSelector((state) => state.listLabo.loading);

  const [searchLabo, setSearchLabo] = useState("");
  const [listLabo, setListLabo] = useState(allLabo);
  const [laboSelected, setLaboSelected] = useState();
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalSendSample, setModalSendSample] = useState(false);
  const [modalReceiveSample, setModalReceiveSample] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isChangeLaboSelected, setIsChangeLaboSelected] = useState(true);

  useEffect(() => {
    if (isUpdateLabo || isDeleteLabo || isAddLabo) {
      dispatch(
        fetchAllLabo({
          size: pageSize,
        })
      );
      if (isDeleteLabo) {
        setIsChangeLaboSelected(true);
        return;
      }
      setIsChangeLaboSelected(false);
    }
  }, [isUpdateLabo, isDeleteLabo, isAddLabo]);

  useEffect(() => {
    dispatch(
      fetchAllLabo({
        size: pageSize,
      })
    );
  }, []);

  useEffect(() => {
    setListLabo(allLabo);
    if (isChangeLaboSelected) {
      setLaboSelected(allLabo[0]?.laboId || 0);
    }
  }, [allLabo]);

  useEffect(() => {
    setListLabo(
      allLabo.filter(
        (item) =>
          item.laboName.toUpperCase().indexOf(searchLabo.toUpperCase()) !== -1
      )
    );
  }, [searchLabo]);

  useEffect(() => {
    if (laboSelected) {
      dispatch(setLaboId(laboSelected));
    }
  }, [laboSelected]);

  return (
    <>
      {/* {loading && <Loading />} */}
      <h2 className="font-bold mb-2"> Quản Lý Labo</h2>
      <div className="flex gap-3 justify-end mb-3">
        <Button
          variant="contained"
          color="info"
          endIcon={<RemoveRedEyeIcon />}
          onClick={() => {
            setModalUpdateOpen(true);
          }}
        >
          <span className="leading-none">Thông tin labo</span>
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<AssignmentReturnedIcon />}
          onClick={() => {
            setModalReceiveSample(true);
          }}
        >
          <span className="leading-none">Nhận mẫu vật</span>
        </Button>
        <Button
          variant="contained"
          color="error"
          endIcon={<AssignmentReturnIcon />}
          onClick={() => {
            setModalSendSample(true);
          }}
        >
          <span className="leading-none">Gửi lại mẫu vật</span>
        </Button>
        <Button
          variant="contained"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={() => {
            setModalDeleteOpen(true);
          }}
        >
          <span className="leading-none">Xóa labo</span>
        </Button>
      </div>
      <Box className="flex gap-3">
        <div>
          <Box className="bg-white p-4 rounded-lg shadow-md mb-3">
            <InputDentist
              id="labo"
              label="Tìm Labo"
              value={searchLabo}
              onChange={(e) => {
                setSearchLabo(e.target.value);
              }}
            />
          </Box>
          <Box className="bg-white py-4 rounded-lg shadow-md text-center  w-[300px]">
            <p className="font-bold text-center">
              Có ( {listLabo.length} ) kết quả
            </p>
            {listLabo.length ? (
              <div className="flex flex-col gap-2 px-3 overflow-y-scroll max-h-[515px] text-left">
                {listLabo.map((item, index) => (
                  <Box
                    className={`whitespace-nowrap p-2 rounded-md cursor-pointer hover:bg-slate-100 ${
                      laboSelected === item.laboId && "bg-sky-100 text-sky-600"
                    }`}
                    onClick={() => setLaboSelected(item.laboId)}
                  >
                    {item.laboName}
                  </Box>
                ))}
              </div>
            ) : (
              <Box className="px-3">
                <Skeleton />
                <Skeleton />
              </Box>
            )}
            <Button
              color="success"
              className="fixed bottom-0 top-3"
              onClick={() => {
                setModalAddOpen(true);
              }}
            >
              Thêm labo
            </Button>
          </Box>
        </div>
        <Box className="w-full">
          <DetailLaboRecord />
        </Box>
      </Box>

      <ModalSendSample
        isShow={modalSendSample}
        setIsShow={setModalSendSample}
      />
      <ModalReceivedSample
        isShow={modalReceiveSample}
        setIsShow={setModalReceiveSample}
      />
      <ModalUpdateLabo
        isShow={modalUpdateOpen}
        setModalUpdateOpen={setModalUpdateOpen}
      />

      <ModalDeleteLabo
        modalDeleteOpen={modalDeleteOpen}
        setModalDeleteOpen={setModalDeleteOpen}
      />

      <ModalAddLabo
        modalAddOpen={modalAddOpen}
        setModalAddOpen={setModalAddOpen}
      />
    </>
  );
};

export default LaboManagementContent;
