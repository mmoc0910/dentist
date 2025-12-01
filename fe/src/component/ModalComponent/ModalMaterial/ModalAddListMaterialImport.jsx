import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import { Typography, TextField, Box, OutlinedInput } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
import { listAllMaterialAPI } from "../../../config/baseAPI";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axiosInstance from "../../../config/customAxios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, IconButton } from "@mui/material";
import _ from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import { addListMaterialImportAPI } from "../../../config/baseAPI";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { toast } from "react-toastify";
import { toastCss } from "../../../redux/toastCss";
import { addMaterialImport } from "../../../redux/MaterialSlice/listMaterialImportSlice";

const ModalAddListMaterialImport = ({ modalAddOpen, setModalAddOpen }) => {
  const dispatch = useDispatch();

  const [materialIds, setMaterialIds] = useState([]);
  const [materialImport, setMaterialImport] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMaterial = async () => {
    try {
      const res = await axiosInstance.get(listAllMaterialAPI);
      setMaterialIds(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadMaterial();
  }, []);

  return (
    <>
      <Modal
        okText={"Lưu"}
        title="Nhập vật liệu"
        open={modalAddOpen}
        width="80%"
        onOk={() => {
          const error = materialImport.some((item) => !item.supplyName);
          if (error) {
            setErrorMessage(
              "Kiểm tra lại dữ liệu nhập. Hãng cung cấp không thể để trống!"
            );
            return;
          }
          setErrorMessage("");
          setModalAddOpen(false);
          setMaterialImport([]);
          dispatch(addMaterialImport(materialImport));
        }}
        onCancel={() => {
          setErrorMessage("");
          setMaterialImport([]);
          setModalAddOpen(false);
        }}
      >
        <Box className="text-right">
          <Button
            variant="contained"
            color="success"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              setMaterialImport((prev) => [
                ...prev,
                {
                  materialId: materialIds?.[0].materialId,
                  supplyName: null,
                  amount: 1,
                  unitPrice: 0,
                  total: 0,
                },
              ]);
            }}
          >
            <span className="leading-none">Thêm mới</span>
          </Button>
        </Box>
        <StyledTable
          size="small"
          className="mb-3 shadow-md"
          style={{ marginTop: "15px" }}
        >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ width: "20%" }}>
                Tên sản phẩm
              </StyledTableCell>
              <StyledTableCell>Hãng cung cấp</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Đơn Giá</StyledTableCell>
              <StyledTableCell>Tổng giá</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {materialImport?.map((materialImportItem, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Select
                    id="materialId"
                    fullWidth
                    className="h-[30px]"
                    value={materialImportItem?.materialId}
                    onChange={(e) => {
                      setMaterialImport((prev) => {
                        prev[index].materialId = e.target.value;
                        return _.cloneDeep(prev);
                      });
                    }}
                  >
                    {materialIds?.map((item) => (
                      <MenuItem key={item.materialId} value={item.materialId}>
                        {item.materialName}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledTableCell>
                <StyledTableCell padding="none">
                  <OutlinedInput
                    endAdornment={<p className="mb-0 leading-0 text-xs"></p>}
                    size="small"
                    id="supplyName"
                    placeholder="Tên hãng nhập"
                    value={materialImportItem.supplyName}
                    className="h-[30px] bg-white"
                    onChange={(e) =>
                      setMaterialImport((prev) => {
                        prev[index].supplyName = e.target.value;
                        return _.cloneDeep(prev);
                      })
                    }
                  />
                </StyledTableCell>
                <StyledTableCell padding="none">
                  <OutlinedInput
                    endAdornment={<p className="mb-0 leading-0 text-xs"></p>}
                    size="small"
                    id="amount"
                    type={"number"}
                    value={materialImportItem.amount}
                    inputProps={{ min: 1, max: 10 }}
                    className="h-[30px] bg-white"
                    onChange={(e) =>
                      setMaterialImport((prev) => {
                        prev[index].amount = +e.target.value;
                        prev[index].total =
                          e.target.value * prev[index].unitPrice;
                        return _.cloneDeep(prev);
                      })
                    }
                  />
                </StyledTableCell>
                <StyledTableCell padding="none">
                  <OutlinedInput
                    endAdornment={<p className="mb-0 leading-0 text-xs"></p>}
                    size="small"
                    id="unitPrice"
                    type={"number"}
                    value={materialImportItem.unitPrice}
                    className="h-[30px] bg-white"
                    onChange={(e) =>
                      setMaterialImport((prev) => {
                        prev[index].unitPrice = e.target.value;
                        prev[index].total = e.target.value * prev[index].amount;
                        return _.cloneDeep(prev);
                      })
                    }
                  />
                </StyledTableCell>
                <StyledTableCell padding="none" className="text-center">
                  {materialImportItem.total} VND
                </StyledTableCell>
                <StyledTableCell padding="none">
                  <Button
                    className="mr10"
                    onClick={() => {
                      setMaterialImport((prev) => {
                        prev.splice(index, 1);
                        return _.cloneDeep(prev);
                      });
                    }}
                  >
                    <ClearIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
        <p className="text-center text-red-500 mb-0 mt-3">{errorMessage}</p>
      </Modal>
    </>
  );
};

export default ModalAddListMaterialImport;
