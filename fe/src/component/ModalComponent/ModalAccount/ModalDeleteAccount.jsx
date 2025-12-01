import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import "./../style.css";
import { deleteAccount } from "../../../redux/AccountSlice/listAccountSlice";
import { fetchAccount } from "../../../redux/AccountSlice/choosenAccountSlice";

const ModalDeleteAccount = ({ modalDeleteOpen, setModalDeleteOpen }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.modal.userId);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isOpenDeleteAccount = useSelector(
    (state) => state.modal.isOpenDeleteAccount
  );
  const [modalText, setModalText] = useState(
    "Bạn có chắc chắn muốn xóa không ?"
  );

  const handleOk = () => {
    setModalText("Đang xóa tài khoản !");
    handleDelete(userId);
    setConfirmLoading(true);
    setTimeout(() => {
      setModalDeleteOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setModalDeleteOpen(false);
  };

  const handleDelete = (userId) => {
    dispatch(deleteAccount(userId));
  };

  useEffect(() => {
    if (userId > 0 && modalDeleteOpen) {
      dispatch(fetchAccount(userId));
    }
  }, [isOpenDeleteAccount]);

  return (
    <>
      <Modal
        className="rounded-md overflow-hidden"
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
export default ModalDeleteAccount;
