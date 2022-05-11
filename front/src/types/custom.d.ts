import type { CustomTheme } from '../theme'
import '@material-ui/core/styles';
declare module '@emotion/styled' {
  export interface Theme extends CustomTheme { }
}
declare module '@emotion/css' {
  export interface Theme extends CustomTheme { }
}
declare module '@emotion/react' {
  export interface Theme extends CustomTheme { }
}
declare module '@mui/material/styles' {
  export interface Theme {
    customShadows: {
      z1: string
      z8: string
      z12: string
      z16: string
      z20: string
      z24: string
      primary: string
      secondary: string
      info: string
      success: string
      warning: string
      error: string
    }
  }
  export interface Palette {
    gradients: {
      button: string
    }
  }
  export interface PaletteOptions {
    border?: {
      light: string
      button: string
    }
    icon?: {
      wrapper: string
      wallet: string
      active: string
      secondary: string
      primary: string
    }
    progressCircle?: {
      trailColorPrimary: string
      trailColorSecondary: string
    }
    button?: {
      invert: string
      text: string
      background?: {
        invert: string
      }
    }
  }
  export interface TypeBackground {
    secondary: string
    light: string
    walletGradient: string
    wallet: string
    primary: string
    modalSecondary: string
    modal: string
    input: string
    label: string
    switch: string
    white: string
  }
  export interface PaletteColorOptions {
    light?: string
    main?: string
    75?: string
  }

  export interface TypeText {
    whiteButton: string
  }
}



declare module '@mui/material' {
  export interface Color {
    '500_8': string
    '500_12': string
    '500_16': string
    '500_24': string
    '500_32': string
    '500_48': string
    '500_56': string
    '500_80': string
  }

  export interface TypeBackground {
    paper: string
    default: string
    neutral: string
  }
}
