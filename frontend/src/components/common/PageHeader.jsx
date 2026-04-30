import { Box, Chip, Stack, Typography } from "@mui/material";
import { FiStar } from "react-icons/fi";
import AnimatedIcon from "./AnimatedIcon";

const PageHeader = ({ title, subtitle, chip }) => (
  <Box mb={3}>
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      {chip ? <Chip label={chip} color="primary" variant="outlined" /> : null}
      <AnimatedIcon rotate color="#0f8b8d" size={18}>
        <FiStar />
      </AnimatedIcon>
    </Stack>
    <Typography variant="h4" mb={0.6}>
      {title}
    </Typography>
    <Typography color="text.secondary">{subtitle}</Typography>
  </Box>
);

export default PageHeader;
