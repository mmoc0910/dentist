import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'antd';
import './../style.css';
import { deleteMaterial } from '../../../redux/MaterialSlice/listMaterialSlice';
import { fetchMaterial } from '../../../redux/MaterialSlice/choosenMaterialSlice'

const ModalDeleteMaterial = ({ modalDeleteOpen, setModalDeleteOpen }) => {
    const dispatch = useDispatch();
    const materialId = useSelector(state => state.modal.materialId);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const isOpenDeleteMaterial = useSelector(state => state.modal.isOpenDeleteMaterial)
    const [modalText, setModalText] = useState('Bạn có chắc chắn muốn xóa không ?');

    console.log(materialId)
    const handleOk = () => {
        setModalText('Bạn chắc chắn muốn xóa không ?');
        handleDelete(materialId);
        setConfirmLoading(true);
        setTimeout(() => {
            setModalDeleteOpen(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        setModalDeleteOpen(false);
    };

    const handleDelete = (materialId) => {
        dispatch(deleteMaterial(materialId))
    }

    useEffect(() => {
        if (materialId > 0 && modalDeleteOpen) {
            dispatch(fetchMaterial(materialId))
        }
    }, [isOpenDeleteMaterial])

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
export default ModalDeleteMaterial