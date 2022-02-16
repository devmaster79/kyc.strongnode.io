import Box from '@material-ui/core/Box';

export default function Status({ sx, color }) {
  return (
    <Box
      component="span"
      sx={{ width: 7, height: 7, borderRadius: '50%', mr: '10px', backgroundColor: color, ...sx }}
    />
  );
}
