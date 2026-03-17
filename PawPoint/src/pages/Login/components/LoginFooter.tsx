import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginFooter = () => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="center"
      sx={{ mt: 3 }}
    >
      <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
        Don&apos;t have an account?
      </Typography>

      <Typography
        onClick={() => navigate("/")}
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#f5a623",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        Register
      </Typography>
    </Stack>
  );
};