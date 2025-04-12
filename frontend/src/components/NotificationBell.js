import React, { useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import api from "../api";
import notificationSound from "../assets/notification.mp3";

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const audio = new Audio(notificationSound);

  useEffect(() => {
    if (!userId) return;

    console.log("🔔 NotificationBell - userId in bell:", userId);

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/api/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("🔔 Notifications fetched:", res.data);

        const unread = res.data.filter((n) => !n.read);

        if (unread.length > notifications.length) {
          audio.play();
        }

        setNotifications(unread);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId, notifications.length]);

  const handleMarkAsRead = async () => {
    try {
      await api.post(`/api/notifications/mark-read/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications([]);
      setAnchorEl(null);
    } catch (error) {
      console.error("❌ Error marking notifications as read:", error);
    }
  };

  const handleRespond = async (notificationId, type, accept) => {
    let endpoint = `/api/notifications/respond/${notificationId}`;
    let payload = { accept };

    if (type === "family_request") {
      endpoint = `/api/users/respond-family-request/${notificationId}`;
      payload = { accept };
    }

    try {
      await api.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("❌ Error responding to request:", error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {notifications.length === 0 ? (
          <MenuItem>No Notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index} sx={{ whiteSpace: "normal", maxWidth: 300 }}>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  {notification.type.replace("_", " ")}
                </Typography>

                <Typography variant="body2">{notification.message}</Typography>

                {["caregiver_request", "family_request"].includes(notification.type) && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleRespond(notification._id, notification.type, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleRespond(notification._id, notification.type, false)}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </Stack>
              {index < notifications.length - 1 && <Divider sx={{ mt: 1 }} />}
            </MenuItem>
          ))
        )}

        {notifications.length > 0 && (
          <MenuItem onClick={handleMarkAsRead} sx={{ justifyContent: "center" }}>
            Mark All as Read
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationBell;
