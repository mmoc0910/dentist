import { Avatar, Box, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

function NotiCard({ message, time, seen }) {
  const formatTime = (time) => {
    let date = moment(time?.substring(0, 10)).format("DD/MM/YYYY");
    if (date === moment().format("DD/MM/YYYY")) {
      date = "Hôm nay";
    }
    return {
      time: time?.substring(11, 16),
      date,
    };
  };
  return (
    <Box
      className={`relative flex gap-2 w-[270px] p-2 shadow-sm cursor-pointer mb-1 hover:bg-slate-100`}
    >
      <Avatar
        alt={message}
        src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?w=2000"
      />
      <Box>
        <p className={`${!seen ? "font-bold" : ""} text-sm mb-1`}>{message}</p>
        <p className={`text-xs mb-0`}>
          Vào lúc {formatTime(time).time} {formatTime(time).date}
        </p>
      </Box>
      <Box hidden={seen} className="w-[10px] h-[10px] bg-blue-500 rounded-full absolute top-3 right-1" />
    </Box>
  );
}

export default NotiCard;
