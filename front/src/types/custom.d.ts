import type { CustomTheme as CustomTheme } from '../theme'

// and extend them!
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
  export interface Theme extends CustomTheme { }
  export interface ThemeOptions extends CustomTheme { }
  export interface Palette {
    gradients: {
      button: string
    }
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
    paper: string,
    default: string,
    neutral: string
  }
}
