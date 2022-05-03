import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import styled from '@mui/material/styles/styled'
import SvgIconStyle from './SvgIconStyle'
import useSettings from '../hooks/useSettings'

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52,
  height: 24,
  margin: '0 auto',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    backgroundColor: '#AA1FEC',
    '&.Mui-checked': {
      transform: 'translateX(23px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#AA1FEC !important',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 24,
    height: 20,
    borderRadius: 47
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: '#AA1FEC',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

const SunIcon = styled(SvgIconStyle)`
  position: absolute;
  left: 20px;
`

export default function ThemeSwitch({ sx, color }) {
  const { themeMode, onChangeMode } = useSettings()
  const handleChange = (event) => {
    onChangeMode(event.target.checked ? 'dark' : 'light')
  }
  return (
    <div style={sx}>
      <SunIcon
        src="/icons/sun.svg"
        sx={{ width: 24, height: 24, background: 'white' }}
      />
      <IOSSwitch onChange={handleChange} checked={themeMode === 'dark'} />
    </div>
  )
}
