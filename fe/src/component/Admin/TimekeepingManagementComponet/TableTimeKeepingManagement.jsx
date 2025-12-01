import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import moment from "moment";

const TableTimeKeepingManagement = (props) => {
  const { listTimekeeping, role, currentPage } = props;
  const renderTime = (time) => {
    if (time === null) return "";
    return moment(time).format("DD/MM/YYYY, h:mm:ss a");
  };
  const renderStatus = (time) => {
    if (time === null) return "Checked in";
    else return "Checked out";
  };

  return (
    <>
        <StyledTable size="small" className="shadow-md">
          <TableHead>
            <TableRow>
              <StyledTableCell>STT</StyledTableCell>
              {role === "Admin" && <StyledTableCell>Họ và Tên</StyledTableCell>}
              <StyledTableCell>Thời gian check-in</StyledTableCell>
              <StyledTableCell>Thời gian check-out</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listTimekeeping.map((item, index) => (
              <StyledTableRow key={item.timekeepingId}>
                <StyledTableCell>
                  {parseInt(currentPage) * 10 + index + 1}
                </StyledTableCell>
                {role === "Admin" && (
                  <StyledTableCell>{item.fullName}</StyledTableCell>
                )}
                <StyledTableCell>
                  {renderTime(item.timeCheckin)}
                </StyledTableCell>
                <StyledTableCell>
                  {renderTime(item.timeCheckout)}
                </StyledTableCell>
                <StyledTableCell>
                  <Chip
                    size="small"
                    label={renderStatus(item.timeCheckout)}
                    style={{
                      background: `${
                        item.timeCheckout ? "#59995c" : "#418eed"
                      }`,
                      color: "#fff",
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
    </>
  );
};

export default TableTimeKeepingManagement;
