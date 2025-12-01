import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import 'antd/dist/antd.css';
import { Typography, TextField } from '@mui/material';
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { addMaterialImport } from '../../../redux/MaterialSlice/listMaterialImportSlice';
import { regexNumber, validationDate } from '../../../config/validation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { listAllMaterialAPI } from '../../../config/baseAPI';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment/moment';
import axiosInstance from '../../../config/customAxios';

const ModalAddMaterialImport = ({ modalAddOpen, setModalAddOpen }) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(null);
    const [materialIds, setMaterialIds] = useState([]);
    const [materialId, setMaterialId] = useState();
    const [materialPrice, setMaterialPrice] = useState();


    // const [listMaterialPrice, setListMaterialPrice] = useState([]);

    const validationSchema = yup.object({
        supplyName: yup
            .string('Nhập đơn vị cung cấp')
            .max(250, 'Đơn vị cung cấp không thể quá 250 ký tự.')
            .required('Đơn vị cung cấp là bắt buộc.'),
        amount: yup
            .string('Nhập số lượng')
            .matches(regexNumber, "Số lượng không được nhập chữ, kí tự, số âm.")
            .required('Số lượng là bắt buộc.'),
        unitPrice: yup
            .string('Nhập đơn giá')
            .matches(regexNumber, "Đơn giá không được nhập chữ, kí tự, số âm.")
            .required('Đơn giá là bắt buộc.')

    });



    const loadMaterial = async () => {
        try {
            const res = await axiosInstance.get(listAllMaterialAPI)


            setMaterialId(res.data[0].materialId)
            setMaterialIds(res.data)
            // setMaterialPrice(res.data[0].price)


        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        loadMaterial();
    }, [])



    const formik = useFormik({
        initialValues: {
            supplyName: '',
            amount: '',
            unitPrice: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.date = moment(value.$d).format(validationDate);
            values.materialId = materialId;
            values.totalPrice = materialPrice;
            dispatch(addMaterialImport(values))
            setModalAddOpen(false)
            formik.handleReset()
        }
    });

    const handleCancel = () => {
        setModalAddOpen(false)

        // formik.errors.supplyName = ""
        // formik.touched.supplyName = ""

        // formik.errors.amount = ""
        // formik.touched.amount = ""

        // formik.errors.unitPrice = ""
        // formik.touched.unitPrice = ""

        formik.resetForm()
    }

    useEffect(() => {
        const price = (formik.values.unitPrice || 0) * (formik.values.amount || 0)

        setMaterialPrice(price)
    }, [formik.values.unitPrice, formik.values.amount])



    return (
        <>
            <Modal
                title="Thêm Vật Liệu Nhập Khẩu"
                open={modalAddOpen}
                onOk={formik.handleSubmit}
                onCancel={handleCancel}
            >

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="material">Vật liệu</InputLabel>
                        <Select
                            labelId="material"
                            id="materialSelect"
                            label="Vật liệu"
                            value={materialId}
                            onChange={(e) => setMaterialId(e.target.value)}
                        >
                            {materialIds?.map(item => (
                                <MenuItem key={item.materialId} value={item.materialId}>{item.materialName}</MenuItem>

                            ))}

                        </Select>

                    </FormControl>
                </Box>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="supplyName"
                    label="Hãng cung cấp"
                    name="supplyName"
                    autoComplete="supplyName"
                    value={formik.values.supplyName}
                    autoFocus
                    onChange={formik.handleChange}
                />
                {formik.errors.supplyName && formik.touched.supplyName && <Typography style={{ color: 'red' }}>{formik.errors.supplyName}</Typography>}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        name="date"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            console.log(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="amount"
                    label="Số lương"
                    name="amount"

                    autoComplete="amount"
                    value={formik.values.amount}
                    autoFocus
                    onChange={formik.handleChange}
                />
                {formik.errors.amount && formik.touched.amount && <Typography style={{ color: 'red' }}>{formik.errors.amount}</Typography>}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="unitPrice"
                    label="Số lương"
                    name="unitPrice"

                    autoComplete="unitPrice"
                    value={formik.values.unitPrice}
                    autoFocus
                    onChange={formik.handleChange}
                />

                {formik.errors.unitPrice && formik.touched.unitPrice && <Typography style={{ color: 'red' }}>{formik.errors.unitPrice}</Typography>}

                <TextField
                    margin="normal"
                    required
                    disabled
                    fullWidth
                    id="totalPrice"
                    label="Tổng giá"
                    name="Tổng giá"
                    autoComplete="totalPrice"
                    value={materialPrice}
                    autoFocus
                    onChange={formik.handleChange}
                />
            </Modal>
        </>
    )
}

export default ModalAddMaterialImport;