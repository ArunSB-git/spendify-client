import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, IconButton } from "@mui/material";

export default function TopBar({ theme, toggleTheme }) {
  const navigate = useNavigate();

  // Grab the icon component from theme
  const ThemeIcon = theme.themeIcon;

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: 60,
        p: 1,
        bgcolor: theme.sidebarBackground,
        borderBottom: `1px solid ${theme.border}`,
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Left Section: Title */}
      <h2 style={{ color: theme.text, margin: 0 }}>Trackify</h2>

      {/* Center Section: Navigation Buttons */}
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: theme.sidebarInput,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": { bgcolor: theme.progressCircle },
          }}
        >
          📊 Dashboard
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/statistics")}
          sx={{
            bgcolor: theme.sidebarInput,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": { bgcolor: theme.progressCircle },
          }}
        >
          📈 Statistics
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/profile")}
          sx={{
            bgcolor: theme.sidebarInput,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": { bgcolor: theme.progressCircle },
          }}
        >
          👤 Profile
        </Button>
      </Stack>

      {/* Right Section: Theme Toggle Icon */}
<IconButton onClick={toggleTheme} sx={{ color: theme.themeIconColor }}>
  <ThemeIcon fontSize="large" />
</IconButton>

    </Stack>
  );
}
