import { Box, CircularProgress } from "@mui/material";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const { isReady } = useAuthBootstrap();

  if (!isReady) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <AppRoutes />;
}

export default App;