import React from "react";
import styled, { keyframes } from "styled-components";
import {Backdrop, CircularProgress} from '@mui/material'

function Loading() {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10000 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loading;
