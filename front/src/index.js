// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// contexts
import { SettingsProvider } from './contexts/SettingsContext'
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyle } from './reset.css'

ReactDOM.render(
  <SettingsProvider>
    <CollapseDrawerProvider>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </CollapseDrawerProvider>
  </SettingsProvider>,
  document.getElementById('root'),
)
