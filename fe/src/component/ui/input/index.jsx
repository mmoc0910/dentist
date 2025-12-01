import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
const InputDentist = ({
  value,
  label,
  id,
  isFlex,
  onChange,
  placeholder = null,
  isEdit = false,
  required = false,
  validate = false,
  disabled = false,
  type="text",
  error = { message: "", touched: false },
}) => {
  const [selfDisable, setSelfDisable] = useState(true);
  return (
    <div>
      <Box className={`mb-2 text-left ${isFlex && "flex items-center"}`}>
        <p className={`mb-1 font-bold ${isFlex && "w-1/3"}`}>
          {label} {required && <span className="text-red-600">*</span>}
        </p>
        <Box className="w-full">
          <Box className="flex gap-3 items-center">
            <TextField
              className="bg-white rounded-md"
              multiline
              fullWidth
              id={id}
              value={value}
              disabled={isEdit ? selfDisable : disabled}
              required={required}
              type={type}
              placeholder={placeholder || label}
              onChange={onChange}
            />
            {isEdit && <EditIcon className="text-slate-500 cursor-pointer" onClick={()=> setSelfDisable(!selfDisable)} />}
          </Box>
          {(validate || required) && error?.touched && (
            <Typography
              style={{ color: "red", fontStyle: "italic", fontSize: "14px" }}
            >
              {error.message}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default InputDentist;
