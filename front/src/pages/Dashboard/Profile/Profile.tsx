import styled from '@emotion/styled'
import { Banner } from '@ui/Banner/Banner'
import Media from 'theme/mediaQueries'
import { Outlet, useNavigate } from 'react-router-dom'
import * as ProgressCircleSteps from '@ui/Dashboard/ProgressCircleSteps'
import { ROUTES } from 'Router'
import { useCallback, useEffect, useState } from 'react'
import userService from 'services/userService'
import { GetProfile } from 'shared/endpoints/user'

export interface ProfileOutletContext {
  profile: GetProfile.Profile
  resetProfile: () => void
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<null | GetProfile.Profile>(null)
  const resetProfile = useCallback(() => {
    userService
      .getProfile()
      .then((response) => {
        if (response.result === 'success') {
          setProfile(response.data)
        }
      })
      .done()
  }, [])
  useEffect(() => {
    resetProfile()
  }, [resetProfile])
  return (
    <Container>
      <Banner
        title="StrongNode dVPN coming soon."
        description="Stay tuned for more information."
        soon
      />
      <Title>StrongNode ID and KYC</Title>
      <ProgressCircleSteps.Container>
        <ProgressCircleSteps.Step
          label="General"
          progressAmount={60}
          progressLabel="A"
          progressBorder={false}
          disabled={false}
          onClick={() => navigate(ROUTES.DASHBOARD.PROFILE.GENERAL)}
        />
        <ProgressCircleSteps.Separator />
        <ProgressCircleSteps.Step
          label="Indentity verification"
          progressAmount={getVerificationProgress(profile?.identityVerified)}
          progressLabel="B"
          progressBorder={false}
          disabled={false}
          onClick={() =>
            navigate(ROUTES.DASHBOARD.PROFILE.IDENTITY_VERIFICATION)
          }
        />
      </ProgressCircleSteps.Container>
      {profile ? (
        <Outlet context={{ profile, resetProfile }}></Outlet>
      ) : (
        'Loading..'
      )}
    </Container>
  )
}

const getVerificationProgress = (
  identityVerified?: GetProfile.VerificationStatus | null
) => {
  switch (identityVerified?.status) {
    case null:
    case undefined:
    case 'Rejected':
      return 0
    case 'Submitted':
      return 33
    case 'VerifiedByAi':
      return 66
    case 'VerifiedByAdmin':
      return 100
  }
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '95px',
  paddingBottom: '70px',
  gap: '32px',
  width: '100%',
  margin: 'auto',
  textAlign: 'center',
  [Media.phone]: {
    width: '100%'
  }
})

const Title = styled.h1({
  [Media.phone]: {
    fontSize: '20px'
  }
})
