// ----------------------------------------------------------------------

import { Theme } from '@mui/material/styles'

export default function Lists(theme: Theme) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(0)
        }
      }
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: theme.spacing(2)
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '0px !important',
          marginRight: 0,
          justifyContent: 'center'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          marginTop: 0,
          marginBottom: 0
        },
        multiline: {
          marginTop: 0,
          marginBottom: 0
        }
      }
    }
  }
}
