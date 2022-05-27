import React, { Suspense } from 'react'
import Router from './Router'
import { SnackbarProvider } from 'notistack'
import { useSearchParams } from 'react-router-dom'
import authService from 'services/auth'
import { isExpired } from 'react-jwt'
const ThemeConfig = React.lazy(async () => ({
  default: (await import('./theme')).ThemeConfig
}))

function App() {
  // Setup token given in the URL.
  // Used by authentication.
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || localStorage.getItem('token')
  if (token) {
    const isTokenExpired = isExpired(token)
    isTokenExpired ? authService.signOut() : authService.setToken(token)
  }

  return (
    <Suspense fallback={<div />}>
      <ThemeConfig>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          maxSnack={2}>
          <div className="App">
            <Router />
          </div>
        </SnackbarProvider>
      </ThemeConfig>
    </Suspense>
  )
}

export default App
