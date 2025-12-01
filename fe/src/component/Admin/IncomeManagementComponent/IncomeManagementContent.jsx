import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import { Tabs } from "antd";
import Loading from "../../ui/Loading";

import {
  fetchAllIncome,
  fetchAllNetIncome,
  fetchAllTotalSpendIncome,
} from "../../../redux/IncomeSlice/listIncomeSlice";
import ChartIncome from "./ChartIncome";
import moment from "moment/moment";

const IncomeManagementContent = () => {
  const listIncome = useSelector((state) => state.listIncome.listIncome);
  const listNetIncome = useSelector((state) => state.listIncome.listNetIncome);
  const listTotalSpendIncome = useSelector(
    (state) => state.listIncome.listTotalSpendIncome
  );
  const totalIncome = useSelector((state) => state.listIncome.totalIncome);
  const totalNetIncome = useSelector(
    (state) => state.listIncome.totalNetIncome
  );
  const totalSpendIncome = useSelector(
    (state) => state.listIncome.totalSpendIncome
  );

  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.listIncome.pageSize);
  const totalPages = useSelector((state) => state.listIncome.totalPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [dataChart, setDataChart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    const cookIncome = listIncome?.map((item) => ({
      ...item,
      value: item.price,
      type: "Doanh thu",
    }));
    const cookNetIncome = listNetIncome?.map((item) => ({
      ...item,
      value: item.price,
      type: "Thực thu",
    }));
    const cookTotalSpend = listTotalSpendIncome?.map((item) => ({
      ...item,
      value: item.price,
      type: "Tổng chi",
    }));
    setDataChart([...cookIncome, ...cookNetIncome, ...cookTotalSpend]);
  }, [listTotalSpendIncome, listNetIncome, listIncome]);

  const formatter = new Intl.NumberFormat({
    style: "currency",
    currency: "VND",
  });

  const handleFetchData = async (filter = null) => {
    setLoading(true);
    await dispatch(fetchAllIncome(filter || {}));
    await dispatch(fetchAllNetIncome(filter || {}));
    await dispatch(fetchAllTotalSpendIncome(filter || {}));
    setLoading(false);
  };

  const onFetchDataByDate = (date) => {
    let filter = {
      startDate: null,
      endDate: null,
    };
    if (date) {
      filter = {
        startDate: moment(date[0]).format("YYYY-MM-DD"),
        endDate: moment(date[1]).format("YYYY-MM-DD"),
      };
    }
    handleFetchData(filter);
  };

  const InComeTable = () => {
    return (
      <StyledTable size="small" className="shadow-md mb-10">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Nguồn thu nhập</StyledTableCell>
            <StyledTableCell>Ngày thu</StyledTableCell>
            <StyledTableCell>Số Tiền ( VND )</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listIncome.map((item, index) => (
            <StyledTableRow size="medium">
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
              <StyledTableCell>{formatter.format(item.price)}</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableCell
            colSpan={3}
            style={{ fontWeight: "bold", fontSize: "20px", textAlign: "end" }}
          >
            Tổng tiền : {formatter.format(totalIncome)} VND
          </StyledTableCell>
        </TableBody>
      </StyledTable>
    );
  };
  const NetIncomeTable = () => {
    return (
      <StyledTable size="small" className="shadow-md mb-10">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Nguồn thu nhập</StyledTableCell>
            <StyledTableCell>Ngày thu</StyledTableCell>
            <StyledTableCell>Số Tiền ( VND )</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listNetIncome.map((item, index) => (
            <StyledTableRow size="medium">
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
              <StyledTableCell>{formatter.format(item.price)}</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableCell
            colSpan={3}
            style={{ fontWeight: "bold", fontSize: "20px", textAlign: "end" }}
          >
            Tổng tiền : {formatter.format(totalNetIncome)} VND
          </StyledTableCell>
        </TableBody>
      </StyledTable>
    );
  };

  const TotalSpendTable = () => {
    return (
      <StyledTable size="small" className="shadow-md mb-10">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Nguồn thu nhập</StyledTableCell>
            <StyledTableCell>Ngày thu</StyledTableCell>
            <StyledTableCell>Số Tiền ( VND )</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {listTotalSpendIncome.map((item, index) => (
            <StyledTableRow size="medium">
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.date}</StyledTableCell>
              <StyledTableCell>{formatter.format(item.price)}</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableCell
            colSpan={3}
            style={{ fontWeight: "bold", fontSize: "20px", textAlign: "end" }}
          >
            Tổng tiền : {formatter.format(totalSpendIncome)} VND
          </StyledTableCell>
        </TableBody>
      </StyledTable>
    );
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-4">Quản lý Thu nhập</h2>
      <ChartIncome
        data={dataChart}
        isLoading={loading}
        onChangeDateRange={onFetchDataByDate}
      />
      <Tabs
        defaultActiveKey="1"
        className="mt-3"
        items={[
          {
            label: <p className="mb-0 font-medium text-lg">Doanh thu</p>,
            key: "1",
            children: <InComeTable />,
          },
          {
            label: <p className="mb-0 font-medium text-lg">Thực thu</p>,
            key: "2",
            children: <NetIncomeTable />,
          },
          {
            label: <p className="mb-0 font-medium text-lg">Tổng chi</p>,
            key: "3",
            children: <TotalSpendTable />,
          },
        ]}
      />
    </>
  );
};

export default IncomeManagementContent;
