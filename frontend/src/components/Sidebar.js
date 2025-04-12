import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

import {
  Menu as MenuIcon,
  Dashboard,
  EventNote,
  Medication,
  Contacts,
  Logout,
  Favorite,
  Search as SearchIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Sidebar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", {
      state: { message: "✅ You have been logged out successfully." }
    });
  };

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "elderly":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
          { text: "Medication Reminder", icon: <Medication />, path: "/medications" },
          { text: "Health Details", icon: <Favorite />, path: "/health-details" },
          { text: "Daily Check-in", icon: <EventNote />, path: "/daily-checkin" },
          { text: "Emergency Contacts", icon: <Contacts />, path: "/emergency" },
          { text: "View Schedule", icon: <EventNote />, path: "/view-schedule" }
        ];

      case "caregiver":
        return [
          { text: "Caregiver Dashboard", icon: <Dashboard />, path: "/caregiver-dashboard" },
          { text: "Search Elderly", icon: <SearchIcon />, path: "/search-elderly" }
        ];

      case "admin":
        return [
          { text: "Admin Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
          { text: "System Performance", icon: <BarChartIcon />, path: "/system-performance" }

        ];

      case "family":
        return [
          { text: "Family Dashboard", icon: <Dashboard />, path: "/family-dashboard" }
        ];

      case "healthcare":
        return [
          { text: "Healthcare Dashboard", icon: <Dashboard />, path: "/healthcare-dashboard" }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#2E82E4" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AgeWell
          </Typography>

          {user && <NotificationBell userId={user.id} />}

          <IconButton edge="end" color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
