import { useState, useEffect } from 'react'
import { CSSProperties } from 'react'
import styled from '@emotion/styled'
import Button from './../Button/Button'
import {
  hasAccess,
  generateAccount,
  cancelAccess
} from '../../services/dvpnService'
import InputField from '@ui/Input/InputField'

interface IUserCredentials {
  style?: CSSProperties
}

// todo create interface for the userAccess object

export const UserCredentials = (props: IUserCredentials) => {
  const [userAccess, setUserAccess] = useState(false)
  const [newlyGeneratedCredentials, setNewlyGeneratedCredentials] = useState('')

  useEffect(() => {
    const loadUserAccess = async () => {
      const access = await hasAccess()

      if (access.result === 'success') {
        setUserAccess(access.dvpnAccess)
      }
    }

    // todo, load the user access
    loadUserAccess()
  }, [])

  // method for canceling subscription
  const cancelSubscribsion = async () => {
    const canceled = await cancelAccess()

    if (canceled.result === 'success') {
      setUserAccess(false)
    }
  }

  // method for temp calling credential generation
  const generateDvpnCredentials = async () => {
    const generatedAccount = await generateAccount()

    if (generatedAccount.result === 'success') {
      setNewlyGeneratedCredentials(generatedAccount.generatedPassword as string)
      setUserAccess(true)
    } else {
      // todo show error
    }
  }

  return (
    <CredentialsWrapper style={props.style}>
      <TitleWrapper>
        <ActiveCircle />
        <p>dVPN</p>
      </TitleWrapper>

      <div style={{ marginTop: '32px' }}>
        <InputField
          inputProps={{
            value: localStorage.getItem('email')
              ? (localStorage.getItem('email') as string)
              : 'todo error message',
            readOnly: true
          }}
        />
      </div>
      <div style={{ marginTop: '16px' }}>
        <InputField
          inputProps={{
            type: newlyGeneratedCredentials === '' ? 'password' : 'text',
            value:
              newlyGeneratedCredentials !== ''
                ? newlyGeneratedCredentials
                : 'So you wanted to see me?',
            readOnly: true
          }}
        />
      </div>

      <ButtonWrapper>
        <Button
          onClick={cancelSubscribsion}
          color={'invert'}
          disabled={!userAccess}>
          CANCEL DVPN ACCESS
        </Button>
        <Button
          onClick={generateDvpnCredentials}
          style={{ marginLeft: '16px' }}>
          {userAccess ? 'RESET CREDENTIALS' : 'GET DVPN'}
        </Button>
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
  padding: '32px',
  marginTop: '32px'
})

const ButtonWrapper = styled.div({
  width: 'max-content',
  display: 'flex',
  marginLeft: 'auto',
  marginTop: '50px'
})
