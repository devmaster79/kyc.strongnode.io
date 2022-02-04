import { Box } from '@material-ui/core';

export default function Logo({ sx }) {
  return <Box component="img" src="/images/logo.png" sx={{ ...sx }} />;
}
