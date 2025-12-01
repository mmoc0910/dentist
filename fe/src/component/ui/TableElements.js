import { TableCell, TableRow, Table } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    height: "20px",
    textAlign: "center",
    backgroundColor: "#000000ba",
    fontWeight: "bold",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    height: "55px",
    textAlign: "center",
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const StyledTableRowClick = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  ":hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));
export const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
}));
