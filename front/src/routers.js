import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';

import Profile from './pages/profile';
import Signup from './pages/signup';
import Signin from './pages/signin';
import SentEmail from './pages/sentemail';
import MagicLink from './pages/magiclink';
import SigninPass from './pages/signinpass';
import SigninTwoStep from './pages/signintwostep';
import SigninSMS from './pages/signinsms';
import CreateAccountPassword from './pages/createaccountpassword';
import PrivateSaleInterestForm from './pages/privatesaleinterestform';
import KYC from './pages/kyc';
import AddData from './pages/AddData';
import ForgottenPassword from './pages/forgottenPassword';
import CreateNewPassword from './pages/createNewPassword';
import ContactSupport from './pages/contactSupport'

export default function Router() {
  const token = localStorage.getItem('token');
  return useRoutes([
    {
      path: 'dashboard',
      element: token ? <DashboardLayout /> : <Navigate to="/signin" replace />,
      children: [
        { path: '/dashboard', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <Dashboard /> },
        { path: 'profile', element: <UserProfile /> },
        { path: 'contact-support', element: <ContactSupport /> },
        { path: 'change-password', element: <ChangePassword /> },
        { path: 'growth', element: <Dashboard /> },
        { path: 'sync', element: <Dashboard /> },
        { path: 'shield', element: <Dashboard /> },
        { path: 'add_data', element: <AddData /> }
      ]
    },
    {
      path: '*',
      children: [
        { path: '*', element: token ? <Navigate to="/dashboard/app" replace /> : <Navigate to="/signin" replace /> },
        { path: 'signin', element: <Signin /> },
        { path: 'signup', element: <Signup /> },
        { path: 'magiclink', element: <MagicLink /> },
        { path: 'signinpass', element: <SigninPass /> },
        { path: 'signintwostep', element: <SigninTwoStep /> },
        { path: 'signinsms', element: <SigninSMS /> },
        { path: 'profile', element: <Profile /> },
        { path: 'forgotten-password', element: <ForgottenPassword /> },
        { path: 'create-new-password', element: <CreateNewPassword /> },
        { path: 'sent-email', element: <SentEmail /> },
        { path: 'verifyEmail', element: <CreateAccountPassword /> },
        {
          path: 'private-sale-interest-form',
          element: <PrivateSaleInterestForm />
        },
        { path: 'kyc', element: <KYC /> }
      ]
    }
  ]);
}
