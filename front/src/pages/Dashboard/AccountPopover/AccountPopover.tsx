import { useState, useEffect } from 'react'
import TextButton from '../../../@ui/Button/TextButton'
import { AccountPopoverWrapper, AvatarIconWrapper, IconWrapper } from './style'
import { ConnectButton } from 'components/ConnectButton'
import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'
import authService from 'services/auth'
import Icon from '@ui/Icon/Icon'
import { useTheme } from '@mui/styles'
import { useEthers } from '@usedapp/core'
import { useGetTokenBalanceFormatted } from '../../../hooks/useGetTokenBalanceFormatted'
import { getTokenAddress } from '../../../services/walletService'
import { CustomTheme } from 'theme'
import { ConnectWalletModal } from '../../../@ui/Modal/ConnectWalletModal'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'

const baseUrl = REACT_APP_BASE_URL + '/uploads/'

type FormValues = {
  file?: File[]
}

export default function AccountPopover() {
  const navigate = useNavigate()
  const { account } = useEthers()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [openAvatarModal, setAvatarModal] = useState(false)
  const [isError, setError] = useState(false)
  const { register, handleSubmit } = useForm()
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
  const SNEBalance = useGetTokenBalanceFormatted(
    account,
    getTokenAddress('strongnode')
  )

  useEffect(() => {
    setEmail(localStorage.getItem('email') || '')
    getProfile()
  }, [])

  const signOut = () => {
    authService.signOut()
    setShowModal(false)
    navigate('/verify-email')
  }

  const navigateToKyc = () => {
    setShowModal(false)
    navigate('/dashboard/kyc')
  }

  const theme: CustomTheme = useTheme()

  const getProfile = () => {
    try {
      userService.getProfile().then((response) => {
        if (response.result === 'success') {
          setUserName(response.data.firstName + ' ' + response.data.lastName)
          setAvatar(response.data.profileImgUrl)
        }
      })
    } catch (error) {}
  }

  const getAvatar = () => {
    return avatar ? (
      <img src={baseUrl + avatar}></img>
    ) : (
      <Icon
        name="avatar"
        width={20}
        height={20}
        color={theme.palette.icon.active}
      />
    )
  }

  const onAvatarEdit = () => {
    setAvatarModal(true)
  }
  const onSubmit = async (data: FormValues) => {
    const file = data?.file ? data?.file[0] : null
    if (file) {
      if (file.type && file.type.indexOf('image') === -1) {
        setError(true)
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', email)
      userService.updateAvatar({ body: formData }).then((response) => {
        if (response.result === 'success') {
          getProfile()
          setAvatarModal(false)
        }
      })
    }
  }

  return (
    <>
      <ConnectWalletModal
        opened={showConnectWalletModal}
        onClose={() => {
          setShowConnectWalletModal(false)
        }}
      />
      <IconWrapper onClick={() => setShowModal(!showModal)}>
        <Icon
          name="arrowDown"
          width={8}
          height={6}
          style={
            showModal
              ? { transform: 'rotate(180deg)', transition: '450ms ease' }
              : { transition: '450ms ease' }
          }
          color={theme.palette.icon.secondary}
        />

        <AvatarIconWrapper>{getAvatar()}</AvatarIconWrapper>
      </IconWrapper>
      {showModal && (
        <AccountPopoverWrapper>
          <AvatarIconWrapper style={{ margin: 'auto' }} onClick={onAvatarEdit}>
            {getAvatar()}
          </AvatarIconWrapper>
          {userName}
          <span>{email}</span>
          <ConnectButton
            onClick={() => {
              setShowConnectWalletModal(true)
            }}
          />
          <ol>
            <li>
              SNE balance{' '}
              <span style={{ float: 'right' }}>{SNEBalance || '-'}</span>
            </li>
          </ol>
          <ul>
            <li onClick={navigateToKyc} aria-hidden>
              My Account
            </li>
          </ul>
          <TextButton onClick={signOut}>Sign out</TextButton>
        </AccountPopoverWrapper>
      )}

      <Dialog
        open={openAvatarModal}
        onClose={() => setAvatarModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Upload Avatar Image</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                {...register('file')}
              />
              {isError ? <ErrorLabel>File is not an image</ErrorLabel> : ''}
            </div>

            {/* <input type="submit" /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAvatarModal(false)}>Close</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

const ErrorLabel = styled.label({
  margin: '16px 0px',
  color: 'red'
})
