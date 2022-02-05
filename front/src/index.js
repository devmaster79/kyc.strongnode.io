// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { BrowserRouter } from 'react-router-dom';
import { ChainId, DAppProvider, useEtherBalance, useEthers } from '@usedapp/core';
import { GlobalStyle } from './reset.css';
import './index.css';

const config = {
  readOnlyChainId: ChainId.Mainnet
};

ReactDOM.render(
  <DAppProvider config={config}>
    <SettingsProvider>
      <CollapseDrawerProvider>
        <BrowserRouter>
          <GlobalStyle />
          <App />
        </BrowserRouter>
      </CollapseDrawerProvider>
    </SettingsProvider>
  </DAppProvider>,
  document.getElementById('root')
);
