import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { allPatientRecordAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import { deleteRecord } from "../../../redux/RecordSlice/listRecordSlice";

const ModalDeleteRecord = ({ modalDeleteOpen, setModalDeleteOpen }) => {
  const dispatch = useDispatch();
  const recordId = useSelector((state) => state.modal.recordSelected);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Bạn có chắc chắn muốn xóa không ?"
  );
  const { id } = useParams();
  const [recordList, setRecordList] = useState([]);
  const isOpenDeleteRecord = useSelector(
    (state) => state.modal.isOpenDeleteRecord
  );

  const getDetail = async (id) => {
    try {
      const res = await axiosInstance.get(allPatientRecordAPI + id);
      console.log(res.data.content);
      setRecordList(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    setModalText("Đang xóa hồ sơ");
    handleDelete(recordId);
    setConfirmLoading(true);
    setModalDeleteOpen(false);
    setConfirmLoading(false);
  };

  const handleDelete = (recordId) => {
    dispatch(deleteRecord(recordId));
  };

  const handleCancel = () => {
    setModalDeleteOpen(false);
  };

  useEffect(() => {
    if (id > 0 && modalDeleteOpen) {
      dispatch(getDetail(id));
    }
  }, [isOpenDeleteRecord]);

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

export default ModalDeleteRecord;
