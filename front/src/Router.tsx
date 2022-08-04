import { Navigate, Route, Routes } from 'react-router-dom'
import * as SHARED_ROUTES from 'shared/routes'
import React, { ReactElement, Suspense } from 'react'

export const ROUTES = {
  DASHBOARD: {
    LAYOUT: '/dashboard',
    NFT: '/dashboard/nft',
    PROFILE: {
      LAYOUT: '/dashboard/profile',
      GENERAL: '/dashboard/profile/general',
      IDENTITY_VERIFICATION: '/dashboard/profile/identity'
    },
    DVPN: '/dashboard/dvpn',
    APP: '/dashboard/app',
    CONTACT_SUPORT: 'contact-support',
    GROWTH: '/dashboard/growth',
    SYNC: '/dashboard/sync',
    SHIELD: '/dashboard/shield',
    VERIFICATION_REQUEST_ADMIN: '/dashboard/verification-request-admin'
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
  PRIVATE_SALE_INTEREST_FORM: '/private-sale-interest-form',
  TERMS_OF_USE: '/terms-of-use',
  PRIVACY_POLICY: '/privacy-policy'
}

const DashboardLayout = React.lazy(() => import('./layouts/dashboard'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Profile = React.lazy(() => import('./pages/Dashboard/Profile/Profile'))
const ProfileGeneral = React.lazy(
  () => import('pages/Dashboard/Profile/General/General')
)
const ProfileIdentityVerification = React.lazy(
  () => import('pages/Dashboard/Profile/IdentityVerification')
)
const DVPN = React.lazy(() => import('./pages/Dashboard/DVPN/DVPN'))
const NFTDashboard = React.lazy(
  () => import('./pages/Dashboard/NFTDashboard/NFTDashboard')
)
const ContactSupport = React.lazy(() => import('./pages/contactSupport'))
const PrivateSaleInterestForm = React.lazy(
  () => import('./pages/privatesaleinterestform')
)
const AuthLayout = React.lazy(() => import('layouts/auth'))
const PrivacyPolicy = React.lazy(() => import('./pages/privacyPolicy'))
const TermsOfUse = React.lazy(() => import('./pages/termsOfUse'))
const Register = React.lazy(async () => {
  const imported = await import('./pages/auth/Register')
  return { default: imported.Register }
})
const VerifyEmail = React.lazy(async () => {
  const imported = await import('./pages/auth/VerifyEmail')
  return { default: imported.VerifyEmail }
})
const SignInWithPassword = React.lazy(async () => {
  const imported = await import('./pages/auth/SignInWithPassword')
  return { default: imported.SignInWithPassword }
})
const SignInWithAuthenticator = React.lazy(async () => {
  const imported = await import('./pages/auth/SingInWithAuthenticator')
  return { default: imported.SignInWithAuthenticator }
})
const SignInWithSMS = React.lazy(async () => {
  const imported = await import('./pages/auth/SignInWithSMS')
  return { default: imported.SignInWithSMS }
})
const SignInWithToken = React.lazy(async () => {
  const imported = await import('./pages/auth/SignInWithToken')
  return { default: imported.SignInWithToken }
})
const VerificationRequestAdmin = React.lazy(async () => {
  const imported = await import(
    'pages/Dashboard/VerificationRequestAdmin/VerificationRequestAdmin'
  )
  return { default: imported.VerificationRequestAdmin }
})

/**
 * without this the lazy components would fallback the root suspense and the whole router would unmount/remount
 * For e.g, for dashboard we want to show a "dashboard" loader, which makes sense, because we want to keep the layout with its navbar and sidebar etc...
 * so we cannot show a global fallback that would unmount everything.
 * So use this for nested routes.
 */
const withLoader = (element: ReactElement) => (
  <Suspense fallback={<>...</>}>{element}</Suspense>
)

/* prettier-ignore */
export default function Router () {
  const loggedin = localStorage.getItem('loggedin')
  if (loggedin) {
    return (
      <>
        <Routes>
          <Route element={<Suspense fallback={<></>}><DashboardLayout /></Suspense>}>
            {/* Acessible from sidebar */}
            <Route path={ROUTES.DASHBOARD.APP} element={withLoader(<Dashboard />)} />
            <Route path={ROUTES.DASHBOARD.NFT} element={withLoader(<NFTDashboard />)} />
            <Route path={ROUTES.DASHBOARD.PROFILE.LAYOUT} element={withLoader(<Profile />)}>
              <Route path={ROUTES.DASHBOARD.PROFILE.GENERAL} element={<ProfileGeneral />} />
              <Route path={ROUTES.DASHBOARD.PROFILE.IDENTITY_VERIFICATION} element={<ProfileIdentityVerification />} />
            </Route>
            <Route path={ROUTES.DASHBOARD.DVPN} element={withLoader(<DVPN />)} />
            {/* Others */}
            <Route path={ROUTES.DASHBOARD.CONTACT_SUPORT} element={withLoader(<ContactSupport />)} />
            <Route path={ROUTES.DASHBOARD.GROWTH} element={withLoader(<Dashboard />)} />
            <Route path={ROUTES.DASHBOARD.SYNC} element={withLoader(<Dashboard />)} />
            <Route path={ROUTES.DASHBOARD.SHIELD} element={withLoader(<Dashboard />)} />
            <Route path={ROUTES.DASHBOARD.VERIFICATION_REQUEST_ADMIN} element={withLoader(<VerificationRequestAdmin />)} />
            <Route path={ROUTES.PRIVACY_POLICY} element={withLoader(<PrivacyPolicy />)} />
            <Route path={ROUTES.TERMS_OF_USE} element={withLoader(<TermsOfUse />)} />
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
