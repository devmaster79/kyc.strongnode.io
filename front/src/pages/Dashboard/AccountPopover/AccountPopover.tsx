import { useState, useEffect } from 'react'
import TextButton from '../../../@ui/Button/TextButton'
import styled from '@emotion/styled/macro'
import { AccountPopoverWrapper, AvatarIconWrapper, IconWrapper } from './style'
import { ConnectButton } from 'components/ConnectButton'
import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'
import * as authService from 'services/auth'
import Icon from '@ui/Icon/Icon'
import { useTheme } from '@mui/styles'
import { useEthers } from '@usedapp/core'
import { useGetTokenBalanceFormatted } from '../../../hooks/useGetTokenBalanceFormatted'
import { tokenAddressDictionary } from '../../../services/walletService'
import { CustomTheme } from 'theme'

export default function AccountPopover() {
  const navigate = useNavigate()
  const { account, activateBrowserWallet } = useEthers()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [showModal, setShowModal] = useState(false)
  const SNEBalance = useGetTokenBalanceFormatted(
    account,
    tokenAddressDictionary.strongnode
  )

  useEffect(() => {
    setEmail(localStorage.getItem('email') || '')
    userService
      .getProfile()
      .then((r) => {
        setUserName(r.data[0].first_name + ' ' + r.data[0].last_name)
        setAvatar(r.data[0].profile_img_url || '')
      })
      .catch((error) => console.error(error))
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

  return (
    <>
      <IconWrapper onClick={() => setShowModal(!showModal)}>
        <Icon
          name="arrowDown"
          width={8}
          height={6}
          viewBox="0 0 8 6"
          style={
            showModal
              ? { transform: 'rotate(180deg)', transition: '450ms ease' }
              : { transition: '450ms ease' }
          }
          color={theme.palette.icon.secondary}
        />

        <AvatarIconWrapper>
          <Icon
            name="avatar"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            color={theme.palette.icon.active}
          />
        </AvatarIconWrapper>
      </IconWrapper>
      {showModal && (
        <AccountPopoverWrapper>
          {userName}
          <span>{email}</span>
          <ConnectButton />
          {!account && (
            <MetamaskBrowserLink onClick={activateBrowserWallet}>
              connect Metamask extension
            </MetamaskBrowserLink>
          )}
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
    </>
  )
}

const MetamaskBrowserLink = styled.div`
  margin-bottom: 16px;
  cursor: pointer;
`
