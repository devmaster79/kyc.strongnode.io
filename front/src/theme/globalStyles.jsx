import { withStyles } from '@mui/styles'

// ----------------------------------------------------------------------

const GlobalStyles = withStyles((theme) => ({
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    html: {
      width: '100%',
      height: '100%',
      '-ms-text-size-adjust': '100%',
      '-webkit-overflow-scrolling': 'touch'
    },
    body: {
      color: theme?.palette?.text?.primary,
      width: '100%',
      height: '100%',
      background: '#F3F5F9',
      fontFamily: 'Satoshi-Regular'
    },
    h2: {
      fontFamily: 'Satoshi-Variable',
      fontWeight: 900
    },
    h1: {
      fontFamily: 'Satoshi-Variable',
      fontWeight: 900,
      fontSize: '32px',
      paddingBottom: 40,
      color: theme?.palette?.text?.primary
    },
    '#root': {
      width: '100%',
      height: '100%'
    },
    input: {
      '&[type=number]': {
        MozAppearance: 'textfield',
        '&::-webkit-outer-spin-button': { margin: 0, WebkitAppearance: 'none' },
        '&::-webkit-inner-spin-button': { margin: 0, WebkitAppearance: 'none' }
      }
    },
    textarea: {
      '&::-webkit-input-placeholder': { color: theme.palette.text.disabled },
      '&::-moz-placeholder': { opacity: 1, color: theme.palette.text.disabled },
      '&:-ms-input-placeholder': { color: theme.palette.text.disabled },
      '&::placeholder': { color: theme.palette.text.disabled }
    },
    a: { color: theme.palette.primary.main },
    img: { display: 'block', maxWidth: '100%' },

    // Lazy Load Img
    '.blur-up': {
      WebkitFilter: 'blur(5px)',
      filter: 'blur(5px)',
      transition: 'filter 400ms, -webkit-filter 400ms'
    },
    '.blur-up.lazyloaded ': {
      WebkitFilter: 'blur(0)',
      filter: 'blur(0)'
    },

    // Custom styles overwriting for recharts components that does not supports custom styling via props
    '.recharts-tooltip-cursor': {
      stroke: '#AA1FEC !important',
      border: '3px solid #AA1FEC',
      'box-shadow': '0px 4px 4px rgba(0, 0, 0, 0.25)'
    },
    '.recharts-dot': {
      fill: '#ffffff',
      stroke: '#AA1FEC !important',
      border: '3px solid #AA1FEC'
    }
  }
}))(() => null)

export default GlobalStyles
