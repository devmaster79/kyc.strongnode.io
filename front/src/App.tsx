import React, { Suspense } from 'react';
import Routes from './routers';
import { SnackbarProvider } from 'notistack5';
import { useSearchParams } from 'react-router-dom';
import * as authService from 'services/auth';

const ThemeConfig = React.lazy(() => import('./theme'));

function App() {
  // Setup token given in the URL.
  // Used by authentication.
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (token) {
    authService.setToken(token);
  }

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
