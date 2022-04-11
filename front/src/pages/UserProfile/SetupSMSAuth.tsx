import {
  Button,
  Input,
  InputAdornment,
  Stack,
  styled,
  TextField
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { sendSMSAndSaveNumber, enableSMSAuth } from 'services/auth'
import InputGroup from 'components/InputGroup'
import LockIcon from '@mui/icons-material/Lock'
import {
  useServices,
  SingleServiceData,
  ServicesProps
} from 'hooks/useService'
import PhoneInput from 'material-ui-phone-number'

const authServices = {
  sendSMSAndSaveNumber,
  verifyOTPAndEnableSMSAuth: enableSMSAuth
}

interface SetupSMSAuthProps {
  onSuccess: () => void;
}

export function SetupSMSAuth ({ onSuccess }: SetupSMSAuthProps) {
  const [smsCode, setSmsCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const authService = useServices(authServices)

  const setOTPValue = (val: string) => {
    val = val.slice(0, 4)
    setSmsCode(val)
  }

  const verifySMSCode = () => {
    authService.verifyOTPAndEnableSMSAuth(smsCode).then((data) => {
      if (data.result == 'success') {
        onSuccess()
      }
    })
  }

  return (
    <Stack spacing={3} width={300}>
      <Stack direction='row'>
        <PhoneInput
          sx={{ flex: 1 }}
          label='Enter phone number'
          defaultCountry='us'
          onChange={(e) => {
            if (typeof e === 'string') {
              setPhoneNumber(e)
            }
          }}
        />
        <SendButtonWithCounter
          onClick={() => authService.sendSMSAndSaveNumber(phoneNumber)}
          disabled={authService.data.result == 'loading'}
        />
      </Stack>
      <TextField
        type='number'
        label='Enter your SMS code'
        id='smsConfirm'
        value={smsCode}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <LockIcon />
            </InputAdornment>
          )
        }}
        onChange={(e) => setOTPValue(e.target.value)}
      />
      <Msgs authService={authService} />
      <Button
        variant='contained'
        sx={{ width: '100%' }}
        onClick={verifySMSCode}
        disabled={authService.data.result == 'loading'}
      >
        Confirm
      </Button>
    </Stack>
  )
}

const Msgs = (props: { authService: ServicesProps<typeof authServices> }) => {
  if (props.authService.last === 'sendSMSAndSaveNumber') { return <SendSMSAndSaveNumberMsg data={props.authService.data} /> }
  if (props.authService.last === 'verifyOTPAndEnableSMSAuth') { return <VerifyOTPAndEnableSMSAuthMsg data={props.authService.data} /> }
  return (
    <Info>Fill in your phone number and we will send you a password.</Info>
  )
}

interface MsgProps<T extends (...args: any) => any> {
  data: SingleServiceData<T>;
}

const SendSMSAndSaveNumberMsg = (
  props: MsgProps<typeof sendSMSAndSaveNumber>
) => {
  if (props.data.result == 'loading') return <Info>Sending the SMS...</Info>
  if (props.data.result == 'success') { return <Info>We have sent you an SMS with the password.</Info> }
  if (props.data.result == 'banned') {
    return (
      <Error>
        We have sent you an SMS already. You can try it again
        {' ' + Math.floor(props.data.remainingTimeMs / 1000)} seconds later.
      </Error>
    )
  }
  if (props.data.result == 'validation-error') { return <Error>Wrong phone number.</Error> }
  return <Error>We could not send you an SMS. Please try again later.</Error>
}

const VerifyOTPAndEnableSMSAuthMsg = (
  props: MsgProps<typeof enableSMSAuth>
) => {
  if (props.data.result == 'loading') { return <Info>Verifying the password...</Info> }
  if (props.data.result == 'validation-error') { return <Error>Wrong password.</Error> }
  return (
    <Error>We could not verify your password. Please try again later.</Error>
  )
}

interface SendButtonWithCounterProps {
  onClick: () => void;
  disabled: boolean;
}

const SendButtonWithCounter = ({
  onClick,
  disabled
}: SendButtonWithCounterProps) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count === 0) return
    const timeout = setTimeout(() => {
      if (count !== 0) {
        setCount(count - 1)
      }
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [count])

  return (
    <SendButton
      onClick={() => {
        setCount(30)
        onClick()
      }}
      disabled={disabled || count !== 0}
    >
      {count !== 0 ? count : 'Send'}
    </SendButton>
  )
}

const Error = styled('p')({
  textAlign: 'center',
  marginBottom: '10px',
  color: '#d74646'
})

const Info = styled('p')({
  textAlign: 'center',
  marginBottom: '10px',
  color: '#dddddd'
})

const SendButton = styled(Button)({
  marginLeft: '10px',
  height: 'auto',
  flex: '0'
})
