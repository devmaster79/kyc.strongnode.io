import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { EntryPage } from '../style'
import EntryCard from '../../components/EntryCard'
import userService from 'services/userService'

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
      } catch (e) {
        setShowError(true)
      }
    })()
  }, [])

  return (
    <EntryPage>
      <EntryCard>
        <AuthMsg>
          {showError && <Error>Something went wrong. Try again later.</Error>}
        </AuthMsg>
      </EntryCard>
    </EntryPage>
  )
}

const AuthMsg = styled.div``
const Error = styled.span`
  color: red;
`
