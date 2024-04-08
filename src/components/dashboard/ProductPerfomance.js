import React from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";

const products = [
  {
    id: "1",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Elite Admin",
    priority: "Low",
    pbg: "primary.main",
    budget: "3.9",
  },
  {
    id: "2",
    name: "Andrew McDownland",
    post: "Project Manager",
    pname: "Real Homes WP Theme",
    priority: "Medium",
    pbg: "secondary.main",
    budget: "24.5",
  },
  {
    id: "3",
    name: "Christopher Jamil",
    post: "Project Manager",
    pname: "MedicalPro WP Theme",
    priority: "High",
    pbg: "error.main",
    budget: "12.8",
  },
  {
    id: "4",
    name: "Nirav Joshi",
    post: "Frontend Engineer",
    pname: "Hosting Press HTML",
    priority: "Critical",
    pbg: "success.main",
    budget: "2.4",
  },
];

const ProductPerfomance = ({ data }) => {
  return (
    <BaseCard title="Top Products">
      <Table
        aria-label="simple table"
        sx={{
          mt: 3,
          whiteSpace: "nowrap",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Typography color="textSecondary" variant="h6">
                S.No.
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography color="textSecondary" variant="h6">
                Name
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="textSecondary" variant="h6">
                Sold Quantity
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color="textSecondary" variant="h6">
                Status
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography color="textSecondary" variant="h6">
                  {product.slug}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="textSecondary" variant="h6">
                  {product.qty}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  sx={{
                    pl: "4px",
                    pr: "4px",
                    backgroundColor: (product.qty > 3 && "success.main") || "warning.main",
                    color: "#fff",
                    fontWeight: "600",
                  }}
                  size="small"
                  label={(product.qty > 3 && "High Selling") || "Average Selling"}
                ></Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BaseCard>
  );
};

export default ProductPerfomance;
