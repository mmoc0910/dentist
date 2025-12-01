import React from "react";
import Doctor from "../../img/doctor.jpg";
import LeaderNurse from "../../img/leadernurse.png";
import Nurse from "../../img/nurse.png";
import Admin from "../../img/admin.png";
import Receptionist from "../../img/receptionist.jpg";

import { useMemo } from "react";
import { Box } from "@mui/material";

function RoleTag({ role, title="", left }) {
  const RoleTagCompoent = useMemo(() => {
    let bgColor = "bg-red-500";
    let imgSrc = Admin;
    let text = role;
    switch (role) {
      case "Doctor":
        bgColor = "bg-blue-500";
        imgSrc = Doctor;
        text = "Bác sĩ";
        break;
      case "LeaderNurse":
        bgColor = "bg-yellow-400";
        imgSrc = LeaderNurse;
        text = "Y tá trưởng";
        break;
      case "Nurse":
        bgColor = "bg-pink-400";
        imgSrc = Nurse;
        text = "Y tá";
        break;
      case "Receptionist":
        bgColor = "bg-green-500";
        imgSrc = Receptionist;
        text = "Lễ tân";
        break;
    }
    return (
      <Box
        className={`flex gap-2 justify-between items-center py-1 px-3 shadow-md rounded-md text-white text-center ${!left && 'mx-auto'} ${bgColor} ${!title && 'w-[150px]'}`}
      >
        {title || text}
        <img
          width="25px"
          height="25px"
          className="rounded-full"
          src={imgSrc}
          alt=""
        />
      </Box>
    );
  }, [role]);
  return <Box className="w-full">{RoleTagCompoent}</Box>;
}

export default RoleTag;
