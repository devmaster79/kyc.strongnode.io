import { Avatar, Stack, Typography } from '@material-ui/core'
import SvgIconStyle from 'components/SvgIconStyle'

export default function AccountPopover() {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          height: 54,
          border: '2px solid rgba(238, 238, 238, 0.5)',
          background: 'linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '100px',
          pl: 1,
          pr: 2,
        }}
        alignItems="center"
      >
        <Avatar src="/images/avatar.png" alt="avatar" />
        <Stack sx={{ color: 'black', ml: 2, mr: 3 }}>
          <Typography color="white" sx={{ fontSize: 18 }}>Lois James</Typography>
          <Typography color="white" sx={{ fontSize: 12 }}>
            David@gmail.com
          </Typography>
        </Stack>
        <SvgIconStyle
          src="/icons/arrow-down.svg"
          sx={{ width: '16px', height: '8px', backgroundColor:'black' }}
        />
      </Stack>
    </>
  )
}
