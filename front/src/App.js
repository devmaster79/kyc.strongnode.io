import React from 'react'
import Routes from './routers'
import ThemeConfig from './theme'
import { SnackbarProvider } from 'notistack5'

function App() {
  return (
    <ThemeConfig>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="App">
          <Routes />
        </div>
      </SnackbarProvider>
    </ThemeConfig>
  )
}

export default App
