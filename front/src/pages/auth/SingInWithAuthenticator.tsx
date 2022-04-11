import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EntryPage } from '../style'
import Button from '../../components/Button'
import EntryCard from '../../components/EntryCard'
import Input from '../../components/Input'
import InputGroup from '../../components/InputGroup'
import * as authService from 'services/auth'
import styled from 'styled-components'
import { OtherOptions } from '../../components/OtherOptions'
import { useService } from 'hooks/useService'

export function SignInWithAuthenticator () {
  const navigate = useNavigate()
  const [totp, setTOTP] = useState('')
  const { data: authState, call: authByAuthenticator } = useService(authService.authByAuthenticator)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await authByAuthenticator(totp)
    if (authState.result === 'success') {
      navigate('/sign-in-with-token')
    }
  }

  const handleTOTPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6)
      setTOTP(event.target.value)
    } else {
      setTOTP(event.target.value)
    }
  }

  return (
    <EntryPage>
      <EntryCard style={{ width: '454px', padding: '40px 25px' }}>
        <Title>2-STEP VERIFICATION</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <TOTPInput onChange={handleTOTPInputChange} value={totp} />
          </InputGroup>
          <AuthMsg>
            {authState.result === 'loading' && 'Verifying the TOTP...'}
            {authState.result === 'validation-error' && (
              <Error>Wrong TOTP. Please try agian.</Error>
            )}
            {authState.result === 'unexpected-error' && (
              <Error>Something went wrong. Please try again later.</Error>
            )}
            {authState.result === 'unauthorized-error' && (
              <Error>You do not have access to this feature.</Error>
            )}
            {authState.result === 'banned' && (
              <Error>
                Too many trials. You can try it again {Math.floor(authState.remainingTimeMs / 1000)}{' '}
                seconds later.
              </Error>
            )}
          </AuthMsg>
          <Button type='submit' full>
            CONFIRM
          </Button>
        </Form>
        <OtherOptions hideAuthenticator />
      </EntryCard>
    </EntryPage>
  )
}

const Title = styled.h2`
  font-weight: bold;
  font-family: Halyard;
`

const TOTPInput = styled(Input).attrs({ placeholder: 'Enter your TOTP', type: 'input' })`
  padding: 16px 20px 16px 30px;
  color: rgba(255, 255, 255, 0.5);
`

const Form = styled.form`
  margin-top: 30px;
  margin-left: 60px;
  margin-right: 60px;
`

const AuthMsg = styled.div``
const Error = styled.span`
  color: #e7b3ff;
`
