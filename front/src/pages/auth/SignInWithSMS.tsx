import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Box } from '@mui/material'
import { EntryPage } from '../style'
import Button from '../../components/Button'
import EntryCard from '../../components/EntryCard'
import Input from '../../components/Input'
import InputGroup from '../../components/InputGroup'
import { ReactComponent as LockIcon } from '../../icons/lock.svg'
import * as authService from 'services/auth'
import { OtherOptions } from '../../components/OtherOptions'
import { useService } from 'hooks/useService'

const LENGTH_OF_SMS_CODE = 4
export function SignInWithSMS () {
  const navigate = useNavigate()
  const { data: sendState, call: sendSMS } = useService(
    authService.sendSMSToUser
  )
  const { data: authState, call: authBySMSCode } = useService(
    authService.authBySMSCode
  )
  const [smsCode, setSmsCode] = useState('')

  const handleSubmit = async () => {
    const state = await authBySMSCode(smsCode)
    if (state.result == 'success') {
      navigate('/sign-in-with-token')
    }
  }

  // send sms after the component is loaded
  useEffect(() => {
    sendSMS()
  }, [])

  const handleSMSCodeChange = (val: string) => {
    val = val.slice(0, 4)
    setSmsCode(val)
  }

  return (
    <EntryPage>
      <EntryCard>
        <Box padding="0px 20px">
          <h2 style={{ fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
          <SendMsg>
            {sendState.result === 'loading' && 'Sending the SMS...'}
            {sendState.result === 'success' &&
              'We have sent you an SMS to your given phone number.'}
            {sendState.result === 'unexpected-error' && (
              <Error>
                We could not send you an SMS. Please try again later.
              </Error>
            )}
            {sendState.result === 'unauthorized-error' && (
              <Error>You do not have access to this feature.</Error>
            )}
            {sendState.result === 'banned' && (
              <Error>
                We have sent you an SMS already. You can try it again{' '}
                {Math.floor(sendState.remainingTimeMs / 1000)} seconds later.
              </Error>
            )}
          </SendMsg>
          <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
            <InputGroup>
              <LockIcon />
              <SBInput
                type="number"
                placeholder="Enter your SMS code"
                id="smsConfirm"
                value={smsCode}
                style={{ padding: '16px 20px 16px 40px' }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSMSCodeChange(e.target.value)
                }
              />
            </InputGroup>
            <AuthMsg>
              {authState.result === 'loading' && 'Validating...'}
              {authState.result === 'validation-error' && (
                <Error>Invalid code please try again.</Error>
              )}
              {authState.result === 'banned' && (
                <Error>Too many trials, try again later.</Error>
              )}
              {authState.result === 'unauthorized-error' && (
                <Error>You do not have access to this feature.</Error>
              )}
              {authState.result === 'unexpected-error' && (
                <Error>
                  Some error occurred during the authorization. Please try again
                  later.
                </Error>
              )}
            </AuthMsg>
            <Button
              type="submit"
              full
              disabled={smsCode.length < LENGTH_OF_SMS_CODE}
            >
              CONFIRM
            </Button>
          </form>
          <OtherOptions hideSMS />
        </Box>
      </EntryCard>
    </EntryPage>
  )
}

const SBInput = styled(Input)`
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
  }
`
const SendMsg = styled.div`
  display: flex;
  margin-top: 50px;
`
const AuthMsg = styled.div`
  margin-bottom: 10px;
`
const Error = styled.span`
  color: red;
`
