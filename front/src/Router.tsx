import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard'
import Dashboard from './pages/Dashboard'
import Profile from './pages/profile'
import ContactSupport from './pages/contactSupport'
import { Register } from './pages/auth/Register'
import { VerifyEmail } from './pages/auth/VerifyEmail'
import { SignInWithPassword } from './pages/auth/SignInWithPassword'
import { SignInWithAuthenticator } from './pages/auth/SingInWithAuthenticator'
import { SignInWithSMS } from './pages/auth/SignInWithSMS'
import { SignInWithToken } from './pages/auth/SignInWithToken'
import PrivateSaleInterestForm from './pages/privatesaleinterestform'
import AddData from './pages/AddData'
import * as SHARED_ROUTES from 'shared/routes'
import NFTDashboard from 'pages/Dashboard/NFTDashboard/NFTDashboard'
import Kyc from 'pages/Dashboard/KYC/KYC'
import AuthLayout from 'layouts/auth'
import Identity from 'pages/Identity/Identity'
import PrivacyPolicy from './pages/privacyPolicy'
import TermsOfUse from './pages/termsOfUse'

export const ROUTES = {
  DASHBOARD: {
    LAYOUT: '/dashboard',
    NFT: '/dashboard/nft',
    KYC: '/dashboard/kyc',
    IDENTITY: 'dashboard/identity',
    APP: '/dashboard/app',
    PROFILE: '/dashboard/profile',
    CONTACT_SUPORT: 'contact-support',
    GROWTH: '/dashboard/growth',
    SYNC: '/dashboard/sync',
    SHIELD: '/dashboard/shield',
    ADD_DATA: '/dashboard/add_data'
  },
  AUTH: {
    VERIFY_EMAIL: SHARED_ROUTES.VERIFY_EMAIL,
    REGISTER: SHARED_ROUTES.REGISTER,
    SIGN_IN_WITH_PASSWORD: SHARED_ROUTES.SIGN_IN_WITH_PASSWORD,
    SIGN_IN_WITH_AUTHENTICATOR: SHARED_ROUTES.SIGN_IN_WITH_AUTHENTICATOR,
    SIGN_IN_WITH_SMS: SHARED_ROUTES.SIGN_IN_WITH_SMS,
    SIGN_IN_WITH_TOKEN: SHARED_ROUTES.SIGN_IN_WITH_TOKEN
  },
  // TODO: review these routes, and rename/relocate/remove if needed
  PROFILE: '/profile',
  PRIVATE_SALE_INTEREST_FORM: '/private-sale-interest-form',
  TERMS_OF_USE: '/terms-of-use',
  PRIVACY_POLICY: '/privacy-policy'
}

/* prettier-ignore */
export default function Router () {
  const loggedin = localStorage.getItem('loggedin')
  if (loggedin) {
    return (
      <>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD.APP} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD.CONTACT_SUPORT} element={<ContactSupport />} />
            <Route path={ROUTES.DASHBOARD.GROWTH} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD.SYNC} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD.SHIELD} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD.ADD_DATA} element={<AddData />} />
            <Route path={ROUTES.DASHBOARD.NFT} element={<NFTDashboard />} />
            <Route path={ROUTES.DASHBOARD.KYC} element={<Kyc />} />
            <Route path={ROUTES.DASHBOARD.IDENTITY} element={<Identity />} />
            <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
            <Route path={ROUTES.TERMS_OF_USE} element={<TermsOfUse />} />
          </Route>
          <Route
            path='*'
            element={<Navigate to={ROUTES.DASHBOARD.APP} replace />}
          />
        </Routes>
      </>
    )
  } else {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.VERIFY_EMAIL} element={<VerifyEmail />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
          <Route path={ROUTES.AUTH.SIGN_IN_WITH_PASSWORD} element={<SignInWithPassword />} />
          <Route path={ROUTES.AUTH.SIGN_IN_WITH_AUTHENTICATOR} element={<SignInWithAuthenticator />} />
          <Route path={ROUTES.AUTH.SIGN_IN_WITH_SMS} element={<SignInWithSMS />} />
          <Route path={ROUTES.AUTH.SIGN_IN_WITH_TOKEN} element={<SignInWithToken />} />
        </Route>
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.PRIVATE_SALE_INTEREST_FORM} element={<PrivateSaleInterestForm />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMS_OF_USE} element={<TermsOfUse />} />
        <Route
          path='*'
          element={<Navigate to={ROUTES.AUTH.VERIFY_EMAIL} replace />}
        />
      </Routes>
    )
  }
}
