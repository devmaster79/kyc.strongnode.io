import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Profile from './pages/profile';
import { Register } from './pages/auth/Register';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { SignInWithPassword } from './pages/auth/SignInWithPassword';
import { SignInWithAuthenticator } from './pages/auth/SingInWithAuthenticator';
import { SignInWithSMS } from './pages/auth/SignInWithSMS';
import { SignInWithToken } from './pages/auth/SignInWithToken';
import PrivateSaleInterestForm from './pages/privatesaleinterestform';
import KYC from './pages/kyc';
import AddData from './pages/AddData';
import SHARED_ROUTES from 'shared/shared-routes';

export default function Router() {
  const loggedin = localStorage.getItem('loggedin');
  return useRoutes([
    {
      path: 'dashboard',
      element: loggedin ? <DashboardLayout /> : <Navigate to="/signin" replace />,
      children: [
        { path: SHARED_ROUTES.DASHBOARD, element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <Dashboard /> },
        { path: 'profile', element: <UserProfile /> },
        { path: 'growth', element: <Dashboard /> },
        { path: 'sync', element: <Dashboard /> },
        { path: 'shield', element: <Dashboard /> },
        { path: 'add_data', element: <AddData /> }
      ]
    },
    {
      path: '*',
      children: [
        {
          path: '*',
          element: loggedin ? (
            <Navigate to="/dashboard/app" replace />
          ) : (
            <Navigate to={SHARED_ROUTES.VERIFY_EMAIL} replace />
          )
        },
        { path: SHARED_ROUTES.VERIFY_EMAIL, element: <VerifyEmail /> },
        { path: SHARED_ROUTES.REGISTER, element: <Register /> },
        { path: SHARED_ROUTES.SIGN_IN_WITH_PASSWORD, element: <SignInWithPassword /> },
        { path: SHARED_ROUTES.SIGN_IN_WITH_AUTHENTICATOR, element: <SignInWithAuthenticator /> },
        { path: SHARED_ROUTES.SIGN_IN_WITH_SMS, element: <SignInWithSMS /> },
        { path: SHARED_ROUTES.SIGN_IN_WITH_TOKEN, element: <SignInWithToken /> },
        { path: 'profile', element: <Profile /> },
        {
          path: 'private-sale-interest-form',
          element: <PrivateSaleInterestForm />
        },
        { path: 'kyc', element: <KYC /> }
      ]
    }
  ]);
}
