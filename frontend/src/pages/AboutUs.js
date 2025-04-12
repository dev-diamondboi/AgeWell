import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import PublicNavbar from "../components/PublicNavbar";

const AboutUs = () => {
  return (
    <>
      <PublicNavbar />
      <Paper sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", pt: 8, pb: 10 }} elevation={0}>
        <Container maxWidth="lg">
          {/* 🏁 Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              About AgeWell
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Empowering elders to live independently while staying connected with loved ones and caregivers.
            </Typography>
          </Box>

          {/* 📘 Our Story */}
          <Box mb={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Story
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem">
              AgeWell was born from the realization that aging should not mean isolation.
              Our founders, with backgrounds in healthcare and technology, saw the struggles
              elders and caregivers face daily — from managing medications, to emergency
              response delays, and disconnection from family. AgeWell bridges these gaps by
              offering intuitive tools to help elders live with dignity and autonomy, while
              keeping families and caregivers informed in real time.
            </Typography>
          </Box>

          {/* 📸 Visual Sections */}
          <Grid container spacing={4}>
            {[
              {
                image: "/images/elderlywithfamily.jpg",
                title: "Connection is Care",
                text: "We prioritize meaningful relationships. AgeWell helps families stay involved in the health journeys of their loved ones, from daily check-ins to shared updates on health progress.",
              },
              {
                image: "/images/caregivermedtools.jpg",
                title: "Empowering Caregivers",
                text: "Caregivers use AgeWell to manage medications, emergencies, and schedules efficiently. By simplifying tools, we reduce burnout and improve the quality of care.",
              },
              {
                image: "/images/healthcareusingdashboard.jpg",
                title: "Smart Healthcare Tools",
                text: "Healthcare professionals use our dashboards to track trends, monitor vitals remotely, and intervene early when risks arise — all while respecting privacy.",
              },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                  <CardMedia component="img" height="200" image={item.image} alt={item.title} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">{item.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* 🌱 Mission, Vision, Values */}
          <Box mt={10} textAlign="center">
            <Divider sx={{ my: 4 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Our Mission
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem" maxWidth="800px" mx="auto">
              To bridge the gap between elderly individuals and their support systems by providing a
              platform that promotes independence, ensures safety, and fosters meaningful relationships.
            </Typography>

            <Typography variant="h4" fontWeight="bold" gutterBottom mt={6}>
              Our Vision
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem" maxWidth="800px" mx="auto">
              A future where every elder can live confidently, knowing that care is only a tap away,
              and loved ones are never out of reach.
            </Typography>

            <Typography variant="h4" fontWeight="bold" gutterBottom mt={6}>
              Our Core Values
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem" maxWidth="800px" mx="auto">
              <strong>Compassion</strong> — We lead with empathy.<br />
              <strong>Accessibility</strong> — We design for all.<br />
              <strong>Reliability</strong> — We deliver when it matters most.
            </Typography>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default AboutUs;
