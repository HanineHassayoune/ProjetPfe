import * as React from "react";

import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function SimpleFade() {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return <Switch checked={checked} onChange={handleChange} color="secondary" />;
}
