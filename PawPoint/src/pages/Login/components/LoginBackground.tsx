import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const LoginBackground = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f4ef",
        px: 2,
        py: 4,
      }}
    >
      {children}
    </Box>
  );
};