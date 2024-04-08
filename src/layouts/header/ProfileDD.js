import React from "react";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import { Box, Menu, Typography, ListItemButton, List, ListItemText, Button } from "@mui/material";

const ProfileDD = ({ user, logout }) => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };
  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              color="textSecondary"
              variant="h5"
              fontWeight="400"
              sx={{ ml: 1 }}
            >
              Hello,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {(user && user.user) && user.user.name || "Admin"}
            </Typography>
            <FeatherIcon icon="chevron-down" width="20" height="20" />
          </Box>
        </Box>
      </Button >
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        sx={{
          "& .MuiMenu-paper": {
            width: "250px",
          },
        }}
      >
        <Box>
          <Box px={2}>
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              onClick={handleClose4}
            >
              <ListItemButton>
                <Link href="/"><ListItemText align="center" primary="Home Page" /></Link>
              </ListItemButton>
              <ListItemButton>
                <Button onClick={logout} variant="contained" color='error' sx={{width: '100%'}}>Logout</Button>
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;
