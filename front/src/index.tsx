// scroll bar
import 'simplebar/src/simplebar.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ReactDOM from 'react-dom'
import App from './App'
// contexts
import { SettingsProvider } from './contexts/SettingsContext'
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext'
import { BrowserRouter } from 'react-router-dom'
import { DAppProvider } from '@usedapp/core'
import { GlobalStyle } from './reset.css'
import './index.css'
import 'utils/axios'
import { StrictMode } from 'react'
import { DAppProviderConfig } from './services/walletService'

ReactDOM.render(
  <StrictMode>
    <DAppProvider config={DAppProviderConfig}>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <GlobalStyle />
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </DAppProvider>
  </StrictMode>,
  document.getElementById('root')
)
