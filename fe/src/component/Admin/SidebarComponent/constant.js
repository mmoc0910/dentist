import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BiotechIcon from "@mui/icons-material/Biotech";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import StoreIcon from '@mui/icons-material/Store';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ArchiveIcon from '@mui/icons-material/Archive';
import InventoryIcon from '@mui/icons-material/Inventory';
export const menu = [
  {
    icon: <GroupsIcon />,
    iconActive: <GroupsIcon color="info" />,
    title: "Bệnh nhân",
    href: "/patient-management",
    permission: ["Admin", "Doctor", "LeaderNurse", "Nurse", "Receptionist"],
  },
  {
    icon: <AddHomeWorkIcon />,
    iconActive: <AddHomeWorkIcon color="info" />,
    title: "Quản lý phòng chờ",
    href: "/waitting-room/list",
    permission: ["Admin", "Doctor", "LeaderNurse", "Nurse", "Receptionist"],
  },
  {
    icon: <ManageAccountsIcon />,
    iconActive: <ManageAccountsIcon color="info" />,
    title: "Quản lý tài khoản",
    href: "/accmanagement",
    permission: ["Admin"],
  },
  {
    icon: <ScheduleIcon />,
    iconActive: <ScheduleIcon color="info" />,
    title: "Quản lý lịch hẹn",
    href: "/schedule",
    permission: ["Admin", "LeaderNurse", "Nurse", "Receptionist"],
  },
  {
    icon: <InventoryIcon />,
    title: "Quản lý vật liệu",
    href: "",
    permission: ["Admin", "LeaderNurse", "Nurse"],
    subItem: [
      {
        icon: <NoteAltIcon />,
        iconActive: <NoteAltIcon color="info" />,
        title: "Vật liệu",
        href: "/materialmanagement",
        permission: ["Admin", "LeaderNurse", "Nurse"],
      },
      {
        icon: <ArchiveIcon />,
        iconActive: <ArchiveIcon color="info" />,
        title: "Nhập vật liệu",
        href: "/materialimport",
        permission: ["Admin", "LeaderNurse"],
      },
      {
        icon: <UnarchiveIcon />,
        iconActive: <UnarchiveIcon color="info" />,
        title: "Xuất vật liệu",
        href: "/materialexport",
        permission: ["Admin", "LeaderNurse", "Nurse"],
      },
    ],
  },
  {
    icon: <BiotechIcon />,
    iconActive: <BiotechIcon color="info" />,
    title: "Mẫu vật",
    href: "/specimen",
    permission: ["Admin", "Doctor", "Nurse", "LeaderNurse"],
  },
  {
    icon: <MeetingRoomIcon />,
    iconActive: <MeetingRoomIcon color="info" />,
    title: "Quản lý Labo",
    href: "/labo",
    permission: ["Admin", "LeaderNurse"],
  },
  {
    icon: <MedicalInformationIcon />,
    iconActive: <MedicalInformationIcon color="info" />,
    title: "Quản lý dịch vụ",
    href: "/serviceandcategory",
    permission: ["Admin"],
  },
  {
    icon: <CurrencyExchangeIcon />,
    iconActive: <CurrencyExchangeIcon color="info" />,
    title: "Thu nhập",
    href: "/income",
    permission: ["Admin"],
  },
  {
    icon: <ReceiptLongIcon />,
    iconActive: <ReceiptLongIcon color="info" />,
    title: "Quản lý hoá đơn",
    href: "/bill",
    permission: ["Admin", "Receptionist"],
  },
  {
    icon: <CalendarMonthIcon />,
    iconActive: <CalendarMonthIcon color="info" />,
    title: " Quản lý chấm công",
    href: "/timekeeping",
    permission: ["Admin", "Doctor", "LeaderNurse", "Nurse", "Receptionist"],
  },
];
