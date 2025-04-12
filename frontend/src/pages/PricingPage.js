import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from "@mui/material";
import PublicNavbar from "../components/PublicNavbar";

const plans = [
  {
    name: "AgeWell Basic",
    price: "$9.99/month",
    billing: "Billed monthly",
    features: [
      "Health vitals tracking",
      "Emergency contacts setup",
      "Basic caregiver tools",
    ],
  },
  {
    name: "AgeWell Plus",
    price: "$99.99/year",
    billing: "Billed annually",
    features: [
      "Everything in Basic",
      "Family dashboard access",
      "Medication alerts",
      "Video call support",
    ],
  },
  {
    name: "AgeWell Premium",
    price: "$149.99/year",
    billing: "Billed annually",
    features: [
      "Everything in Plus",
      "Dedicated caregiver assistant",
      "Health trend analytics",
      "24/7 support line",
    ],
  },
];

const PricingPage = () => {
  return (
    <>
      <PublicNavbar />

      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          💳 Choose Your AgeWell Plan
        </Typography>
        <Typography align="center" color="text.secondary" mb={4}>
          Flexible options designed to suit every family's needs.
        </Typography>

        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3, p: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plan.billing}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {plan.features.map((feature, i) => (
                    <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                      • {feature}
                    </Typography>
                  ))}

                  <Box mt={3}>
                    <Button variant="contained" color="primary" fullWidth disabled>
                      Select (Disabled in Demo)
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default PricingPage;
