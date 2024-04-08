import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const Footer = ({ name }) => {
  const copyright = (year) => {
    const currentYear = new Date().getFullYear();
    return (year === currentYear) ? year : `${year}-${currentYear % 100}`;
  }

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography>
        Copyright &copy; {copyright(2024)}. All rights reserved by{" "}
        <Link href="/">
          <a>{name}</a>
        </Link>.
      </Typography>
    </Box>
  );
};

export default Footer;
