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
import AccountDialog from './AccountDialog'

const baseUrl = REACT_APP_BASE_URL + '/uploads/'

export default function AccountPopover() {
  const navigate = useNavigate()
  const { account } = useEthers()
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [openAvatarModal, setAvatarModal] = useState(false)
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
      userService
        .getProfile()
        .then((response) => {
          if (response.result === 'success') {
            setUserName(response.data.firstName + ' ' + response.data.lastName)
            setAvatar(response.data.profileImgUrl)
          }
        })
        .done()
    } catch (error) {
      console.error('Error for set avatar', error)
    }
  }

  const getAvatar = () => {
    return avatar ? (
      <img src={avatar.includes('gravatar') ? avatar : baseUrl + avatar} />
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
      {openAvatarModal ? (
        <AccountDialog
          email={email}
          getProfile={getProfile}
          setClose={(status: boolean) => setAvatarModal(status)}
        />
      ) : (
        <></>
      )}
    </>
  )
}
