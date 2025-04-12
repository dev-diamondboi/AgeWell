import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2E82E4" },
    secondary: { main: "#FFD700" },
    background: { default: "#F0F8FF" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h4: { fontWeight: "bold", color: "#2E82E4" },
    body1: { fontSize: "16px", color: "#333" },
  },
});

export default theme;
