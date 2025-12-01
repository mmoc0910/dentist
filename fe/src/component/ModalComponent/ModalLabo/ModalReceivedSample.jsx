import { Box, Chip, TableBody, TableHead } from "@mui/material";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListReceive,
  updateReceiveSample,
} from "../../../redux/LaboSlice/choosenLaboSlice";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { statusLaboColor, statusLaboFormatter } from "../../style-config/index";
import { Checkbox } from "antd";

const ModalReceivedSample = ({ isShow, setIsShow }) => {
  const dispatch = useDispatch();
  const laboId = useSelector((state) => state.modal.laboId);
  const receiveSamples = useSelector(
    (state) => state.choosenLabo.receiveSamples
  );

  const [listSample, setListSample] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
    if (laboId && isShow) {
      dispatch(fetchListReceive(laboId));
      setIsCheckedAll(false);
    }
  }, [isShow]);

  useEffect(() => {
    setListSample(receiveSamples);
  }, [receiveSamples]);

  const handleCookList = (item, checked) => {
    const dataCheckBox = listSample.map((val) => {
      if (val.specimenId === item.specimenId) {
        return { ...val, checked };
      }
      return val;
    });
    setListSample(dataCheckBox);
  };

  const onCheckedAll = (checked) => {
    const dataCheckBox = listSample.map((val) => ({ ...val, checked }));
    setListSample(dataCheckBox);
  };

  const handleSubmit = () => {
    const finalData = listSample.filter((item) => item.checked);
    dispatch(updateReceiveSample(finalData));
    setListSample([]);
    setIsShow(false);
  };

  return (
    <Modal
      width={1000}
      open={isShow}
      onOk={handleSubmit}
      onCancel={() => {
        setListSample([]);
        setIsShow(false);
      }}
    >
      <Box>
        <Checkbox
          checked={isCheckedAll}
          onChange={(e) => {
            setIsCheckedAll(true);
            onCheckedAll(e.target.checked);
          }}
        />
        <span className="text-xl font-bold ml-3">Chọn tất cả</span>
      </Box>
      <StyledTable className="shadow-md mt-3">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Tên mẫu vật</StyledTableCell>
            <StyledTableCell>Số lượng</StyledTableCell>
            <StyledTableCell>Đơn giá</StyledTableCell>
            <StyledTableCell>Tên bệnh nhân</StyledTableCell>
            <StyledTableCell>Dịch vụ</StyledTableCell>
            <StyledTableCell>Trạng thái</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listSample.map((item, index) => (
            <StyledTableRow>
              <StyledTableCell>
                <Checkbox
                  checked={item?.checked}
                  onChange={(e) => handleCookList(item, e.target.checked)}
                />
              </StyledTableCell>
              <StyledTableCell>{item.specimenName}</StyledTableCell>
              <StyledTableCell>{item.amount}</StyledTableCell>
              <StyledTableCell>{item.unitPrice}</StyledTableCell>
              <StyledTableCell>{item.patientName}</StyledTableCell>
              <StyledTableCell>{item.serviceName}</StyledTableCell>
              <StyledTableCell>
                <Chip
                  size="small"
                  style={{
                    backgroundColor: `${statusLaboColor(item?.status)}`,
                    color: "#fff",
                  }}
                  label={statusLaboFormatter(item?.status)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </Modal>
  );
};

export default ModalReceivedSample;
