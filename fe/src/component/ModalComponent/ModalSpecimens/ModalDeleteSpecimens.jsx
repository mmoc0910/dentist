import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import "./../style.css";
import { deleteSpecimens } from "../../../redux/SpecimensSlice/choosenSpecimensSlice";
import { fetchSpecimens } from "../../../redux/SpecimensSlice/choosenSpecimensSlice";
import { setIsDeleteSpecimens } from "../../../redux/LaboSlice/choosenLaboSlice";

const ModalDeleteSpecimens = ({ modalDeleteOpen, setModalDeleteOpen }) => {
  const dispatch = useDispatch();
  const specimenId = useSelector((state) => state.modal.userId);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isOpenDeleteSpecimens = useSelector(
    (state) => state.modal.isOpenDeleteSpecimens
  );
  const [modalText, setModalText] = useState(
    "Bạn có chắc chắn muốn xóa không ?"
  );

  const handleOk = () => {
    setModalText("Bạn chắc chắn muốn xóa không ?");
    handleDelete(specimenId);
    setConfirmLoading(true);
    setTimeout(() => {
      dispatch(setIsDeleteSpecimens(true));
      setModalDeleteOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setModalDeleteOpen(false);
  };

  const handleDelete = (specimenId) => {
    dispatch(deleteSpecimens(specimenId));
  };

  useEffect(() => {
    if (specimenId > 0 && modalDeleteOpen) {
      dispatch(fetchSpecimens(specimenId));
    }
  }, [isOpenDeleteSpecimens]);

  return (
    <>
      <Modal
        title="Thông báo"
        open={modalDeleteOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default ModalDeleteSpecimens;
