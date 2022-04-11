import {
  Button,
  Stack,
  InputAdornment,
  styled,
  TextField
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  ServicesProps,
  SingleServiceData,
  useServices
} from 'hooks/useService'
import { enableAuthenticatorAuth, generateAuthenticatorQRCode } from 'services/auth'

const authServices = {
  enableAuthenticatorAuth,
  generateAuthenticatorQRCode
}

export function SetupAuthenticatorAuth ({ onSuccess }: { onSuccess: () => void }) {
  const [totp, setTOTP] = useState('')
  const authService = useServices(authServices)

  const handleTOTPInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6)
      setTOTP(event.target.value)
    } else {
      setTOTP(event.target.value)
    }
  }

  const enableAuthenticatorAuth = () => {
    authService.enableAuthenticatorAuth(totp).then((data) => {
      if (data.result == 'success') {
        onSuccess()
      }
    })
  }

  useEffect(() => {
    authService.generateAuthenticatorQRCode()
  }, [])

  const qrCode =
    (authService.dataPerService.generateAuthenticatorQRCode.result == 'success' &&
      authService.dataPerService.generateAuthenticatorQRCode.qrcode) ||
    undefined

  return (
    <Stack spacing={3} width={250}>
      {qrCode && <QR src={qrCode} />}
      <Msgs authService={authService} />
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <LockIcon />
            </InputAdornment>
          )
        }}
        type='input'
        label='Enter your TOTP'
        id='totp'
        value={totp}
        onChange={handleTOTPInputChange}
      />
      <Button
        variant='contained'
        sx={{ width: '100%' }}
        onClick={enableAuthenticatorAuth}
      >
        Confirm
      </Button>
    </Stack>
  )
}

const Msgs = (props: { authService: ServicesProps<typeof authServices> }) => {
  if (props.authService.last === 'generateAuthenticatorQRCode') { return <GenerateQRCodeMsg data={props.authService.data} /> }
  if (props.authService.last === 'enableAuthenticatorAuth') { return <EnableAuthenticatorAuthMsg data={props.authService.data} /> }
  return (
    <Info>Please setup MFA on authenticator app like Google authenticator</Info>
  )
}

interface MsgProps<T extends (...args: any) => any> {
  data: SingleServiceData<T>;
}

const GenerateQRCodeMsg = (props: MsgProps<typeof generateAuthenticatorQRCode>) => {
  if (props.data.result == 'loading') return <></>
  if (props.data.result == 'success') return <></>
  return <Error>We could not send you an SMS. Please try again later.</Error>
}

const EnableAuthenticatorAuthMsg = (props: MsgProps<typeof enableAuthenticatorAuth>) => {
  if (props.data.result == 'loading') { return <Info>Verifying the password...</Info> }
  if (props.data.result == 'validation-error') { return <Error>Wrong password.</Error> }
  return (
    <Error>We could not verify your password. Please try again later.</Error>
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

const QR = styled('img')({
  margin: 'auto',
  width: '100%',
  imageRendering: 'pixelated',
  filter: 'invert(1)',
  mixBlendMode: 'lighten',
  transform: 'scale(1.2)'
})
