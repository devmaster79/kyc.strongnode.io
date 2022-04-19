import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'
import { ErrorMessage } from '@ui/Dashboard/Form'
import styled from '@emotion/styled'

/**
 * Get user data like email and user_name by the stored token
 */
export function SignInWithToken () {
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    (async function () {
      try {
        const user = await userService.getProfile()
        if (user.data[0]?.email) {
          localStorage.setItem('email', user.data[0].email)
          localStorage.setItem('username', user.data[0].user_name)
          localStorage.setItem('loggedin', 'true')
          navigate('/dashboard/app')
        }
      } catch (error) {
        setShowError(true)
      }
    })()
  }, [navigate])

  return (
    <>
      <Title>
        <b>Strongnode</b><br />
        TOKEN VERIFICATION
      </Title>
      {showError &&
        <HelpText>
          <ErrorMessage>
            We could not send you an SMS. Please try again later.
          </ErrorMessage>
        </HelpText>}
    </>
  )
}

const Title = styled.h1`
  font-style: normal;
  font-weight: 100;
  font-size: 32px !important;
  line-height: 43.2px;
  margin:0 !important;
  padding:0 !important;
  b {
    font-weight: 900;
  }
  color: ${props => props.theme.palette.text.primary};
`

const HelpText = styled.p`
  margin: 32px 0 24px 0;
`
