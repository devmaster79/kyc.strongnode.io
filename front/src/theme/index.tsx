import React, { useMemo } from 'react'
import {
  CssBaseline,
  PaletteColorOptions,
  PaletteOptions,
  ThemeOptions,
  TypeBackground,
  TypeText
} from '@mui/material'
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  Theme
} from '@mui/material/styles'
import useSettings from '../hooks/useSettings'
import palette from './palette'
import typography from './typography'
import breakpoints from './breakpoints'
import GlobalStyles from './globalStyles'
import componentsOverride from './overrides'
import shadows, { customShadows } from './shadows'
import { CacheProvider } from '@emotion/react'
import { cache } from '@emotion/css'
import { TypographyOptions } from '@mui/material/styles/createTypography'
cache.compat = true

interface ThemeConfigProps {
  children: React.ReactNode
}

export interface CustomThemeOption extends ThemeOptions {
  customShadows?: { [key: string]: string }
  palette: CustomPaletteOptions
}

interface CustomTypeBackground extends TypeBackground {
  floatingLabel: string
}

interface CustomPaletteOptions extends PaletteOptions {
  background: Partial<CustomTypeBackground>
  text: Partial<TypeText>
  primary: PaletteColorOptions
  error: PaletteColorOptions
  info: PaletteColorOptions
}

export const getTheme = (
  isLight: boolean,
  customPalette: typeof palette
): CustomThemeOption => ({
  palette: isLight
    ? { ...customPalette.light, mode: 'light' }
    : { ...customPalette.dark, mode: 'dark' },
  typography: typography as TypographyOptions,
  breakpoints,
  shadows: isLight ? shadows.light : shadows.dark,
  customShadows: isLight ? customShadows.light : customShadows.dark
})

export function ThemeConfig({ children }: ThemeConfigProps) {
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'

  const themeOptions: CustomThemeOption = useMemo(
    () => getTheme(isLight, palette),
    [isLight]
  )

  const theme: Theme = createTheme(themeOptions)
  theme.components = componentsOverride(theme)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <CacheProvider value={cache}>{children}</CacheProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export type CustomTheme = ReturnType<typeof getTheme>
