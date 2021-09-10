import { alpha } from '@material-ui/core/styles'

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
}

const PRIMARY = {
  main: '#4D79F6',
  75: alpha('#4D79F6', 0.75),
  50: alpha('#4D79F6', 0.5),
  30: alpha('#4D79F6', 0.3),
  10: alpha('#4D79F6', 0.1),
  contrastText: '#fff',
}
const SECONDARY = {
  main: '#33D69F',
  75: alpha('#33D69F', 0.75),
  50: alpha('#33D69F', 0.5),
  30: alpha('#33D69F', 0.3),
  10: alpha('#33D69F', 0.1),
  contrastText: '#fff',
}
const INFO = {
  main: '#296CF2',
  light: alpha('#296CF2', 0.1),
  contrastText: '#fff',
}
const SUCCESS = {
  main: '#34C759',
  light: alpha('#34C759', 0.1),
  contrastText: GREY[800],
}
const WARNING = {
  main: '#FF9500',
  light: alpha('#FF9500', 0.1),
  contrastText: GREY[800],
}
const ERROR = {
  main: '#FF3B30',
  light: alpha('#FF3B30', 0.1),
  contrastText: '#fff',
}

const TYPOGRAPHY = {
  main: '#2D405A',
  75: alpha('#2D405A', 0.75),
  50: alpha('#2D405A', 0.5),
  30: alpha('#2D405A', 0.3),
  10: alpha('#2D405A', 0.1),
}

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  typography: { ...TYPOGRAPHY },
  grey: GREY,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
}

const palette = {
  light: {
    ...COMMON,
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: '#fff', default: '#fff', neutral: GREY[200] },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action },
  },
}

export default palette
