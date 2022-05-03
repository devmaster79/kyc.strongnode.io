// ----------------------------------------------------------------------

import { css } from '@emotion/react'
import { Theme } from '@mui/material/styles'

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: css({
          '&:hover': {
            boxShadow: 'none'
          }
        }),
        sizeLarge: css({
          height: 52,
          fontSize: 24,
          lineHeight: '20px',
          fontWeight: 600
        }),
        sizeMedium: css({
          height: 52
        }),
        // contained
        containedInherit: css({
          color: theme.palette.grey[800],
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400]
          }
        }),
        containedPrimary: css({
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxSizing: 'border-box',
          borderRadius: '16px',
          background: theme.palette.gradients.button,
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.25)'
        }),
        containedSecondary: css({
          boxShadow: theme.customShadows.secondary
        }),
        containedInfo: css({
          boxShadow: theme.customShadows.info
        }),
        containedSuccess: css({
          boxShadow: theme.customShadows.success
        }),
        containedWarning: css({
          boxShadow: theme.customShadows.warning
        }),
        containedError: css({
          boxShadow: theme.customShadows.error
        }),
        // outlined
        outlinedInherit: css({
          border: `1px solid ${theme.palette.grey['500_32']}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }),
        textInherit: css({
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        })
      }
    }
  }
}
