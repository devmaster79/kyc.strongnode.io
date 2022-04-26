import { Box, SxProps } from '@mui/material';

interface LogoProps {
  sx: SxProps;
}

export default function Logo({ sx }: LogoProps) {
  return <Box component="img" src="/images/logo.png" sx={{ ...sx }} />;
}
