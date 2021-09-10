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
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <Dashboard /> },
        { path: 'member', element: <Dashboard /> },
        { path: 'growth', element: <Dashboard /> },
        { path: 'sync', element: <Dashboard /> },
        { path: 'shield', element: <Dashboard /> },
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
