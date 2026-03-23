import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const LoginContainer = ({ children }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 520,
      }}
    >
      {children}
    </Box>
  );
};