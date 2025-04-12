import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

const CaregiverDashboard = ({ user }) => {
  const [assignedElderly, setAssignedElderly] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedElderly = async () => {
      try {
        const res = await api.get("/api/caregiver/my-elderly", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAssignedElderly(res.data);
      } catch (error) {
        console.error("Error fetching assigned elderly:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedElderly();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        👥 My Assigned Elderly Users
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : assignedElderly.length === 0 ? (
        <Typography>No elderly users assigned yet.</Typography>
      ) : (
        <List>
          {assignedElderly.map((elderly) => (
            <ListItem key={elderly._id || elderly.id} disableGutters>
              <Card sx={{ width: "100%", mb: 2 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Avatar
                    src={elderly.profilePicture || ""}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  >
                    {elderly.name?.charAt(0).toUpperCase() || "👤"}
                  </Avatar>
                  <ListItemText
                    primary={<Typography variant="h6">{elderly.name}</Typography>}
                    secondary={elderly.email}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/elderly/${elderly._id || elderly.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default CaregiverDashboard;
