import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Sidebar from "../SidebarComponent/Sidebar";
import { Outlet } from "react-router-dom";

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
    ...(!open && {
      overflowX: "hidden",
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

function DashboardContent({ component }) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box
        style={{
          background: "linear-gradient(-90deg,#CAF8FF 0%,#F7B89C 100%)",
        }}
        sx={{
          // backgroundColor: (theme) =>
          //   theme.palette.mode === "light"
          //     ? 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,58,121,0.5830707282913166) 43%, rgba(2,159,200,1) 100%)'
          //     : '',
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
        }}
        className="relative p-10"
      >
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
            <HeaderAdmin title={"Dashboard"} />
          </Toolbar>
        </AppBar> */}
        <Box className="p-3 bg-white rounded-lg relative">
          <Drawer
            variant="permanent"
            sx={{
              borderColor: "#fff !important",
            }}
            className="rounded-lg w-full border-0"
            open={open}
          >
            {/* <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar> */}
            <Box>
              <Sidebar isOpenSideBar={open} />
              <Box role="button" className="text-center">
                <ChevronLeftIcon onClick={toggleDrawer} />
              </Box>
            </Box>
          </Drawer>
        </Box>
        <Box style={{ padding: "60px" }} className="float-right mx-auto">
          {/* <Grid container spacing={3} textAlign="center" display={"block"}>
            </Grid> */}
            {/* {component} */}
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DashboardContent;
