import React from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import Dashboard from './pages/Dashboard';

import Profile from './pages/profile';
import Signup from './pages/signup';
import Signin from './pages/signin';
import SentEmail from './pages/sentemail';
import MagicLink from './pages/magiclink';
import SigninPass from './pages/signinpass';
import SigninTwoStep from './pages/signintwostep';
import SigninSMS from './pages/singinsms';
import CreateAccountPassword from './pages/createaccountpassword'
import PrivateSaleInterestForm from './pages/privatesaleinterestform'

export default function Router() {
  return useRoutes([
    {
      path: '*',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'dashboard/app', element: <Dashboard /> },
        { path: 'dashboard/member', element: <Dashboard /> },
        { path: 'dashboard/growth', element: <Dashboard /> },
        { path: 'dashboard/sync', element: <Dashboard /> },
        { path: 'dashboard/shield', element: <Dashboard /> },
      ]
    },
    {
      path: '*',
      // element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/signup" replace /> },
        { path: 'signup', element: <Signup /> },
        { path: 'signin', element: <Signin/> },
        { path: 'magiclink', element: <MagicLink/> },
        { path: 'signinpass', element: <SigninPass/> },
        { path: 'signintwostep', element: <SigninTwoStep/> },
        { path: 'signinsms', element: <SigninSMS/> },
        { path: 'profile', element: <Profile /> },
        { path: 'sent-email', element: <SentEmail /> },
        { path: 'create-account-password', element: <CreateAccountPassword /> },
        { path: 'private-sale-interest-form', element: <PrivateSaleInterestForm /> },
        // { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [{ path: '/', element: <Frontend /> }]
    // },
    // { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
