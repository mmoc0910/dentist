import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'antd';
import './../style.css';
import { deleteMaterialExport } from '../../../redux/MaterialSlice/listMaterialExportSlice';
import { fetchMaterialExport } from '../../../redux/MaterialSlice/choosenMaterialExportSlice'

const ModalDeleteMaterialExport = ({ modalDeleteOpen, setModalDeleteOpen }) => {
    const dispatch = useDispatch();
    const materialExportId = useSelector(state => state.modal.materialExportId);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const isOpenDeleteMaterialExport = useSelector(state => state.modal.isOpenDeleteMaterialExport)
    const [modalText, setModalText] = useState('Bạn có chắc chắn muốn xóa không ?');

    console.log(materialExportId)
    const handleOk = () => {
        setModalText('Bạn chắc chắn muốn xóa không ?');
        handleDelete(materialExportId);
        setConfirmLoading(true);
        setTimeout(() => {
            setModalDeleteOpen(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        setModalDeleteOpen(false);
    };

    const handleDelete = (materialExportId) => {
        dispatch(deleteMaterialExport(materialExportId))
    }

    useEffect(() => {
        if (materialExportId > 0 && modalDeleteOpen) {
            dispatch(fetchMaterialExport(materialExportId))
        }
    }, [isOpenDeleteMaterialExport])

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
    )
}
export default ModalDeleteMaterialExport