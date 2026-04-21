import { Box, Container } from "@mui/material";
import AssistantChat from "./components/AssistantChat";
import type { AppTextSize } from "../../utils/textSize";

type AssistantProps = {
  darkMode?: boolean;
  lightMode?: boolean;
  fontScale?: AppTextSize;
};

export const Assistant = ({ darkMode, lightMode, fontScale }: AssistantProps) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <AssistantChat
          darkMode={darkMode}
          lightMode={lightMode}
          fontScale={fontScale}
        />
      </Box>
    </Container>
  );
};