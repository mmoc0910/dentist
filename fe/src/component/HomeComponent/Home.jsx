import { Button, Modal } from "antd";
import "antd/dist/antd.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate("/patient-management")
  })
  return <></>;
};

export default HomePage;
