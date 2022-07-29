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
import { ROUTES } from 'Router'
import { GetProfile } from 'shared/endpoints/user'

export default function AccountPopover() {
  const navigate = useNavigate()
  const { account } = useEthers()
  const [profile, setProfile] = useState<GetProfile.Profile>()
  const [showModal, setShowModal] = useState(false)
  const [openAvatarModal, setAvatarModal] = useState(false)
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
  const SNEBalance = useGetTokenBalanceFormatted(
    account,
    getTokenAddress('strongnode')
  )

  useEffect(() => {
    getProfile()
  }, [])

  const signOut = () => {
    authService.signOut()
    setShowModal(false)
    navigate('/verify-email')
  }

  const navigateTo = (route: string) => {
    setShowModal(false)
    navigate(route)
  }

  const theme: CustomTheme = useTheme()

  const getProfile = () => {
    try {
      userService
        .getProfile()
        .then((response) => {
          if (response.result === 'success') {
            setProfile(response.data)
          }
        })
        .done()
    } catch (error) {
      console.error('Error for set avatar', error)
    }
  }

  const getAvatar = () => {
    return profile?.profileImgUrl ? (
      <img src={profile.profileImgUrl} />
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
          {profile?.username}
          <span>{profile?.email}</span>
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
            <li onClick={() => navigateTo(ROUTES.DASHBOARD.PROFILE.GENERAL)}>
              My Account
            </li>
          </ul>
          {profile?.level === 'Admin' && (
            <>
              <span>Admin</span>
              <ul>
                <li
                  onClick={() =>
                    navigateTo(ROUTES.DASHBOARD.VERIFICATION_REQUEST_ADMIN)
                  }>
                  Submitted verification requests
                </li>
              </ul>
            </>
          )}
          <TextButton onClick={signOut}>Sign out</TextButton>
        </AccountPopoverWrapper>
      )}
      {profile?.email && openAvatarModal ? (
        <AccountDialog
          email={profile?.email}
          getProfile={getProfile}
          setClose={(status: boolean) => setAvatarModal(status)}
        />
      ) : (
        <></>
      )}
    </>
  )
}
