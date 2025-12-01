import React, { useEffect, useCallback } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import Logo from "../../../img/logo.png";
import { menu } from "./constant";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
const Sidebar = ({ isOpenSideBar = false }) => {
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [role, setRole] = useState(null);
  const handleClickCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);

  const location = useLocation();

  const activeTab = useCallback(
    (item) => {
      console.log(`/${location.pathname.split("/")[1]}` , item.href.split("/")[1]);
      return `${location.pathname.split("/")[1]}` === item.href.split("/")[1];
    },
    [location]
  );

  return (
    <div className="decoration-white text-black h-4/5">
      <div className="mb-2">
        <Link to="/patient-management">
          <img
            className="cursor-pointer"
            src={Logo}
            width={130}
            style={{ margin: "auto", borderRadius: "10px" }}
            alt=""
          />
        </Link>
      </div>

      <Box className="flex flex-col gap-2 h-full pb-5 overflow-x-hidden overflow-y-scroll">
        {menu.map((item) => (
          <Box hidden={!item.permission.includes(role)}>
            {item?.subItem ? (
              <Box>
                <ListItemButton
                  sx={{
                    justifyContent: "flex-start",
                    borderRadius: "10px",
                  }}
                  onClick={handleClickCollapse}
                >
                  <ListItemIcon className="ml-2">{item.icon}</ListItemIcon>
                  <Box className="flex justify-between w-full">
                    {item.title}
                    {isOpenCollapse ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </ListItemButton>
                <Collapse in={isOpenCollapse} timeout="auto" unmountOnExit>
                  {item.subItem.map((sub) => (
                    <Box
                      hidden={!sub.permission.includes(role)}
                      className="ml-5"
                    >
                      <Link
                        to={sub.href}
                        className={`decoration-transparent  ${
                          activeTab(sub) ? "text-sky-500" : "text-black"
                        } rounded-full`}
                      >
                        <ListItemButton
                          sx={{
                            justifyContent: "flex-start",
                            borderRadius: "10px",
                            background: `${activeTab(sub) ? "#CAF8FF" : ""}`,
                            boxShadow: `${activeTab(sub) ? "#CAF8FF" : ""}`,
                          }}
                        >
                          <ListItemIcon className="ml-[-2px]">
                            {activeTab(sub) ? sub.iconActive : sub.icon}
                          </ListItemIcon>
                          {sub.title}
                        </ListItemButton>
                      </Link>
                    </Box>
                  ))}
                </Collapse>
              </Box>
            ) : (
              <Link
                to={item.href}
                className={`h-10 decoration-transparent  ${
                  activeTab(item) ? "text-sky-500" : "text-black"
                } rounded-full`}
              >
                <Tooltip
                  arrow
                  title={!isOpenSideBar ? item.title : ""}
                  placement="left"
                >
                  <ListItemButton
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: "10px",
                      background: `${activeTab(item) ? "#CAF8FF" : ""}`,
                    }}
                  >
                    <ListItemIcon className="ml-2">
                      {activeTab(item) ? item.iconActive : item.icon}
                    </ListItemIcon>
                    {item.title}
                  </ListItemButton>
                </Tooltip>
              </Link>
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Sidebar;
