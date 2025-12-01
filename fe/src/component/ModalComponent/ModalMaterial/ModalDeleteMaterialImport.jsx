import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'antd';
import './../style.css';
import { deleteMaterialImport } from '../../../redux/MaterialSlice/listMaterialImportSlice';
import { fetchMaterialImport } from '../../../redux/MaterialSlice/choosenMaterialImportSlice'

const ModalDeleteMaterialImport = ({ modalDeleteOpen, setModalDeleteOpen }) => {
    const dispatch = useDispatch();
    const materialImportId = useSelector(state => state.modal.materialImportId);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const isOpenDeleteMaterialImport = useSelector(state => state.modal.isOpenDeleteMaterialImport)
    const [modalText, setModalText] = useState('Bạn có chắc chắn muốn xóa không ?');

    console.log(materialImportId)
    const handleOk = () => {
        setModalText('Bạn chắc chắn muốn xóa không ?');
        handleDelete(materialImportId);
        setConfirmLoading(true);
        setTimeout(() => {
            setModalDeleteOpen(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        setModalDeleteOpen(false);
    };

    const handleDelete = (materialImportId) => {
        dispatch(deleteMaterialImport(materialImportId))
    }

    useEffect(() => {
        if (materialImportId > 0 && modalDeleteOpen) {
            dispatch(fetchMaterialImport(materialImportId))
        }
    }, [isOpenDeleteMaterialImport])

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
export default ModalDeleteMaterialImport