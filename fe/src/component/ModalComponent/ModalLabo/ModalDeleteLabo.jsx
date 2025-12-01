import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'antd';
import './../style.css';
import { deleteLabo } from '../../../redux/LaboSlice/listLaboSlice';
import { fetchLabo } from '../../../redux/LaboSlice/choosenLaboSlice'

const ModalDeleteLabo = ({ modalDeleteOpen, setModalDeleteOpen }) => {
    const dispatch = useDispatch();
    const laboId = useSelector(state => state.modal.laboId);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const isOpenDeleteLabo = useSelector(state => state.modal.isOpenDeleteLabo)
    const [modalText, setModalText] = useState('Bạn có chắc chắn muốn xóa không ?');

    const handleOk = () => {
        setModalText('Bạn chắc chắn muốn xóa không ?');
        handleDelete(laboId);
        setConfirmLoading(true);
        setTimeout(() => {
            setModalDeleteOpen(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        setModalDeleteOpen(false);
    };

    const handleDelete = (laboId) => {
        dispatch(deleteLabo(laboId))
    }

    useEffect(() => {
        if (laboId > 0 && modalDeleteOpen) {
            dispatch(fetchLabo(laboId))
        }
    }, [isOpenDeleteLabo])

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
export default ModalDeleteLabo