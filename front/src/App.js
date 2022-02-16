import React, { Suspense } from 'react';
import Routes from './routers';
import { SnackbarProvider } from 'notistack5';

const ThemeConfig = React.lazy(() => import('./theme'));

function App() {
  return (
    <Suspense fallback={<div></div>}>
      <ThemeConfig>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          maxSnack={2}>
          <div className="App">
            <Routes />
          </div>
        </SnackbarProvider>
      </ThemeConfig>
    </Suspense>
  );
}

export default App;
