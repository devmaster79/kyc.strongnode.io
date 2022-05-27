import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'
import { Message } from '@ui/Dashboard/Form'
import styled from '@emotion/styled'

/**
 * Get user data like email and user_name by the stored token
 */
export function SignInWithToken() {
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    ;(async function () {
      try {
        const response = await userService.getProfile()
        if (response.result === 'success') {
          localStorage.setItem('email', response.data.email)
          localStorage.setItem('username', response.data.user_name)
          localStorage.setItem('loggedin', 'true')
          navigate('/dashboard/kyc')
        }
      } catch (error) {
        setShowError(true)
      }
    })()
  }, [navigate])

  return (
    <>
      <Title>
        <b>Strongnode</b>
        <br />
        TOKEN VERIFICATION
      </Title>
      {showError && (
        <HelpText>
          <Message error>We could not query your profile.</Message>
        </HelpText>
      )}
    </>
  )
}

const Title = styled.h1((props) => ({
  fontStyle: 'normal',
  fontWeight: '100',
  fontSize: '32px !important',
  lineHeight: '43.2px',
  margin: '0 !important',
  padding: '0 !important',
  b: {
    fontWeight: '900'
  },
  color: props.theme.palette.text.primary
}))

const HelpText = styled.div({
  margin: '32px 0 24px 0'
})
