import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Sidebar from "../Admin/SidebarComponent/Sidebar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderAdmin from "../Admin/HeaderComponent/HeaderAdmin";
import { menu } from "../Admin/SidebarComponent/constant";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: "none",
    boxSizing: "border-box",
    overflow: "hidden",
    ...(!open && {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function LayoutDefault({ component }) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const roleAccount = localStorage.getItem("role");
  React.useEffect(() => {
    const mapPermission = menu.map((item) => ({
      pathName: item.href,
      permission: item.permission,
    }));
    const check = mapPermission.find(
      (item) => item.pathName === location.pathname
    );
    if (!check || !check.permission.includes(roleAccount)) {
      navigate("/patient-management");
    }
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box
        style={{
          background:
            "linear-gradient(244.89deg, rgb(226, 251, 255) 7.39%, rgb(234, 225, 217) 74.76%, rgb(247, 184, 156) 100%)",
        }}
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
        }}
        className="relative p-10"
      >
        <Box className="absolute right-10 top-5">
          <HeaderAdmin />
        </Box>
        {/* <CssBaseline /> */}
        {/* <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar> */}
        <Box className="p-3 bg-white rounded-lg sticky top-0 shadow-md">
          <Drawer
            variant="permanent"
            sx={{
              borderColor: "#fff !important",
              overflow: "hidden",
            }}
            className="rounded-lg w-full h-full border-0 overflow-hidden"
            open={open}
          >
            <Box className="relative h-full flex flex-col justify-between">
              <Sidebar isOpenSideBar={open} />
              <Box
                role="button"
                className="text-center z-10 bg-white"
                onClick={toggleDrawer}
              >
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </Box>
            </Box>
          </Drawer>
        </Box>
        <Box className="w-full ml-10 float-right">
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LayoutDefault;
