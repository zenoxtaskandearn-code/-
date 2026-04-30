import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0a5f61",
      light: "#0f8b8d",
      dark: "#073f40",
    },
    secondary: {
      main: "#cc7a00",
      light: "#ff9f1c",
      dark: "#995c00",
    },
    success: {
      main: "#00a854",
      light: "#00e676",
      dark: "#007a3d",
    },
    error: {
      main: "#d32f2f",
      light: "#ff5252",
      dark: "#9a0007",
    },
    background: {
      default: "#060a14",
      paper: "#0b1120",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#8892a0",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(160deg, #0b1120 0%, #0d1525 40%, #101a2f 100%)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(15,139,141,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "linear-gradient(160deg, rgba(11,17,32,0.92), rgba(13,21,37,0.95))",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, rgba(6,10,20,0.95), rgba(11,17,32,0.9))",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(15,139,141,0.12)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(180deg, #060a14 0%, #0b1120 40%, #0d1525 100%)",
          borderRight: "1px solid rgba(15,139,141,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: "rgba(15,139,141,0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.02)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(15,139,141,0.3)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        },
        head: {
          fontWeight: 700,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#8892a0",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          background: "rgba(255,255,255,0.02)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(160deg, #0b1120 0%, #0d1525 40%, #101a2f 100%)",
          border: "1px solid rgba(15,139,141,0.1)",
        },
      },
    },
  },
});
