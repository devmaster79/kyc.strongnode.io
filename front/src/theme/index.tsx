import { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useSettings from '../hooks/useSettings';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { CacheProvider } from "@emotion/react";
import { cache } from "@emotion/css";
cache.compat = true;

interface ThemeConfigProps {
  children: React.ReactNode
}

export const getTheme = (isLight: boolean, custom_palette: typeof palette) => ({
  palette: isLight ? { ...custom_palette.light, mode: 'light' } : { ...custom_palette.dark, mode: 'dark' },
  typography,
  breakpoints,
  shadows: isLight ? shadows.light : shadows.dark,
  customShadows: isLight ? customShadows.light : customShadows.dark
});

export function ThemeConfig({ children }: ThemeConfigProps) {
  const { themeMode } = useSettings();
  const isLight = themeMode === 'light';

  const themeOptions: any = useMemo(
    () => getTheme(isLight, palette),
    [isLight]
  );

  const theme: any = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <CacheProvider value={cache}>
          {children}
        </CacheProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export type CustomTheme = ReturnType<typeof getTheme>;

