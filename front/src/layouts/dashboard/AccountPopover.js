import { Avatar, Stack, Typography } from '@material-ui/core';
import SvgIconStyle from 'components/SvgIconStyle';

export default function AccountPopover() {
  return (
    <>
      <Stack
        direction="row"
        sx={{ height: 54, background: '#EBFBF5', borderRadius: '100px', pl: 1, pr: 2 }}
        alignItems="center"
      >
        <Avatar src="/images/avatar.png" alt="avatar" />
        <Stack sx={{ color: 'black', ml: 2, mr: 3 }}>
          <Typography sx={{fontFamily: 'Poppins', fontSize: 16}}>Lois James</Typography>
          <Typography color="#899295" sx={{fontFamily: 'Poppins', fontSize: 11}}>David@gmail.com</Typography>
        </Stack>
        <SvgIconStyle
          src="/icons/arrow-down.svg"
          color="action"
          sx={{ width: '16px', height: '8px'}}
        />
      </Stack>
    </>
  );
}
