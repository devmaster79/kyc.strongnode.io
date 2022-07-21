import { useState } from 'react'
import { CSSProperties } from 'react'
import styled from '@emotion/styled'
import * as DashboardForm from '@ui/Dashboard/Form'
import Button from './../Button/Button'

interface IUserCredentials {
  style?: CSSProperties
}

// todo create interface for the userAccess object

export const UserCredentials = (props: IUserCredentials) => {
  const [userAccess, setUserAccess] = useState(false)
  // todo add the API
  // todo fetch the user's email
  // todo fetch the access

  return (
    <CredentialsWrapper style={props.style}>
      <TitleWrapper>
        <ActiveCircle />
        <p>dVPN</p>
      </TitleWrapper>

      <InputGroup>
        <DashboardForm.Input inputProps={{ value: 'test', readOnly: true }} />
        <DashboardForm.Input />
      </InputGroup>
      <ButtonWrapper>
        <Button variant="normal" color={'invert'}>
          CANCEL SUBSCRIPTION
        </Button>
        <Button variant="normal">RESET CREDENTIALS</Button>
      </ButtonWrapper>
    </CredentialsWrapper>
  )
}

const TitleWrapper = styled.div({
  width: 'max-content',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: '18px',
  lineHeight: '24px',
  fontFamily: 'Satoshi-Variable',
  fontStyle: 'normal'
})

const ActiveCircle = styled.div({
  width: '6px',
  height: '6px',
  backgroundColor: '#32DD39',
  borderRadius: '50%',
  marginRight: '4px'
})

const CredentialsWrapper = styled.div({
  background: '#141343',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  padding: '32px'
})

const ButtonWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '50px'
})

const InputGroup = styled.div({
  marginTop: '30px',
  display: 'flex',
  flexFlow: 'column',
  gap: '16px'
})
