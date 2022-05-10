import { alpha } from '@mui/material/styles'

function createGradient(color1: string, color2: string): string {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}

const WHITE = {
  100: '#FFF',
  60: 'rgba(255, 255, 255, 0.6)',
  40: 'rgba(255, 255, 255, 0.4)',
  12: 'rgba(255, 255, 255, 0.12)',
  8: 'rgba(255, 255, 255, 0.08)'
}

const NIGHTBLUE = {
  100: '#141343',
  90: '#141245',
  85: 'rgba(8, 7, 41, 0.8)',
  80: '#101054',
  60: alpha('#141245', 0.6),
  40: alpha('#141245', 0.4),
  10: '#AA1FEC'
}

const NEW_GREY = {
  70: '#9593C8',
  65: '#6E6D8F',
  60: 'rgba(153, 153, 153, 0.12)',
  50: '#E5E5E5',
  30: '#F6F6FD',
  10: 'rgba(110, 109, 143, 0.08)',
  5: 'rgba(20, 18, 69, 0.12);'
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
  '500_8': alpha('#919EAB', 0.08),
  '500_12': alpha('#919EAB', 0.12),
  '500_16': alpha('#919EAB', 0.16),
  '500_24': alpha('#919EAB', 0.24),
  '500_32': alpha('#919EAB', 0.32),
  '500_48': alpha('#919EAB', 0.48),
  '500_56': alpha('#919EAB', 0.56),
  '500_80': alpha('#919EAB', 0.8)
}

const PRIMARY = {
  main: '#964CFA',
  75: alpha('#964CFA', 0.75),
  50: alpha('#964CFA', 0.5),
  30: alpha('#964CFA', 0.3),
  10: alpha('#964CFA', 0.1),
  contrastText: '#fff'
}
const SECONDARY = {
  main: '#33D69F',
  75: alpha('#33D69F', 0.75),
  50: alpha('#33D69F', 0.5),
  30: alpha('#33D69F', 0.3),
  10: alpha('#33D69F', 0.1),
  contrastText: '#fff'
}
const INFO = {
  main: '#556BE0',
  light: alpha('#556BE0', 0.1),
  contrastText: '#fff'
}
const SUCCESS = {
  main: '#34C759',
  light: alpha('#34C759', 0.1),
  contrastText: GREY[800]
}
const WARNING = {
  main: '#E7B32E',
  light: alpha('#E7B32E', 0.1),
  contrastText: GREY[800]
}
const ERROR = {
  main: '#DF53BB',
  light: alpha('#DF53BB', 0.1),
  contrastText: '#fff'
}

const TYPOGRAPHY = {
  main: '#2D405A',
  75: alpha('#2D405A', 0.75),
  50: alpha('#2D405A', 0.5),
  30: alpha('#2D405A', 0.3),
  10: alpha('#2D405A', 0.1)
}

const GRADIENTS = {
  button: 'linear-gradient(180deg, #AF56B8 0%, #a91ed1 100%)',
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
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
  gradients: GRADIENTS,
  divider: GREY['500_24'],
  action: {
    hover: GREY['500_8'],
    selected: GREY['500_16'],
    disabled: GREY['500_80'],
    disabledBackground: GREY['500_24'],
    focus: GREY['500_24'],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
}

const palette = {
  light: {
    ...COMMON,
    text: {
      primary: NIGHTBLUE[90],
      secondary: NIGHTBLUE[60],
      disabled: GREY[600],
      dark: NIGHTBLUE[90],
      whiteButton: NEW_GREY[65]
    },
    background: {
      primary: WHITE[100],
      secondary: NEW_GREY[30],
      light: WHITE[40],
      white: '#6e6d8f14',
      label: '#FAFAFE',
      switch: NEW_GREY[5],
      input: WHITE[100],
      inputModal: NEW_GREY[30],
      floatingModalInput: NEW_GREY[30],
      default: NEW_GREY[60],
      paper: GREY[800],
      neutral: GREY['500_16'],
      gradient: 'linear-gradient(180deg, #FAFAFF 0%, #F3F3FC 100%);',
      walletGradient:
        'linear-gradient(91.67deg, #F5F5FD 1.25%, rgba(245, 245, 253, 0) 98.45%)',
      qr: 'difference',
      modal: 'rgba(151,151,176,0.8)',
      modalSecondary: WHITE[100],
      wallet: 'rgba(110, 109, 143, 0.12)'
    },
    button: {
      text: WHITE[100],
      invert: NEW_GREY[65],
      background: {
        invert: NEW_GREY[10]
      }
    },
    border: {
      light: NEW_GREY[60],
      button: 'rgba(110, 109, 143, 0.1)'
    },
    action: { active: GREY[500], ...COMMON.action },
    icon: {
      primary: NEW_GREY[70],
      active: NIGHTBLUE[90],
      secondary: GREY['600'],
      wallet: NEW_GREY[65],
      wrapper: '#E0E0EE'
    },
    progressCircle: {
      trailColorPrimary: '#EEDCFB',
      trailColorSecondary: '#EDD9FC'
    }
  },
  dark: {
    ...COMMON,
    text: {
      primary: WHITE[100],
      secondary: WHITE[60],
      disabled: GREY[600],
      dark: NIGHTBLUE[90],
      whiteButton: NIGHTBLUE[90]
    },
    background: {
      primary: NIGHTBLUE[90],
      secondary: NIGHTBLUE[100],
      light: WHITE[8],
      white: WHITE[100],
      label: '#262652',
      input: WHITE[8],
      inputModal: WHITE[8],
      floatingModalInput: '#242454',
      switch: WHITE[8],
      default: NIGHTBLUE[80],
      paper: GREY[800],
      neutral: GREY['500_16'],
      gradient: 'linear-gradient(111.76deg, #14133E 0%, #0B0B77 104.05%)',
      walletGradient:
        'linear-gradient(91.67deg, #111056 1.25%, rgba(17, 16, 86, 0) 98.45%)',
      qr: 'lighten',
      modal: NIGHTBLUE[85],
      modalSecondary: NIGHTBLUE[100],
      wallet: WHITE[8]
    },
    button: {
      text: WHITE[100],
      invert: WHITE[100],
      background: {
        invert: WHITE[8]
      }
    },
    border: {
      light: WHITE[12],
      button: WHITE[12]
    },
    action: { active: GREY[500], ...COMMON.action },
    icon: {
      primary: NEW_GREY[70],
      active: WHITE[100],
      secondary: WHITE[100],
      wrapper: 'rgba(255, 255, 255, 0.12)',
      wallet: WHITE[100]
    },
    progressCircle: {
      trailColorPrimary: '#25136B',
      trailColorSecondary: '#251362'
    }
  }
}

export default palette
