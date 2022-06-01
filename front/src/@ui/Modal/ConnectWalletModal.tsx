import Modal from '@ui/Modal/Modal'
import { IAnim, useAnimated } from '../utils/useAnimated'
import React, { ReactNode, useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import { IconRectangleButton } from '../Button/IconRectangleButton'
import { connectWallet } from '../../services/walletService'
import { useEthers } from '@usedapp/core'

interface IConnectWalletModal {
  opened: boolean
  onClose: () => void
}

export const ConnectWalletModal = (props: IConnectWalletModal) => {
  const { activate, activateBrowserWallet } = useEthers()
  const [showConnectWalletModal, setShowConnectWaletModal] = useState(
    props.opened
  )

  useEffect(() => {
    setShowConnectWaletModal(props.opened)
  }, [props.opened])

  const turnOnModalAnim = useAnimated(showConnectWalletModal, 500)

  const downloadWallet = () => {
    window.open('https://metamask.io/download/', '_blank')
  }

  return (
    <span>
      {turnOnModalAnim.state !== 'closed' && (
        <Modal onClose={props.onClose} anim={turnOnModalAnim} background={true}>
          <WAIcon src="/icons/connect_wallet.svg" alt="Connect wallet icon" />
          <Title>Connect to Wallet</Title>
          <DescriptionText>Connect your favourite wallet</DescriptionText>

          <IconRectangleButton
            style={{ marginTop: '32px' }}
            title={'Metamask'}
            description={'Connect using browser wallet'}
            icon={'/icons/metamask.png'}
            iconAlt={'Metamask browser extension connect option'}
            onClick={() => {
              activateBrowserWallet()
              props.onClose()
            }}
          />
          <IconRectangleButton
            style={{ marginTop: '16px' }}
            title={'WalletConnect'}
            description={'Connect using mobile connect'}
            icon={'/icons/walletconnect_logo.png'}
            iconAlt={'WalletConnect option'}
            onClick={() => {
              connectWallet(activate)
              props.onClose()
            }}
          />

          <NoWallet>Don&apos;t have wallet?</NoWallet>
          <Link onClick={downloadWallet}>Download here</Link>
        </Modal>
      )}
    </span>
  )
}

const Title = styled.h3((props) => ({
  fontFamily: "'Satoshi-Variable', Arial",
  fontWeight: 900,
  fontSize: '18px',
  lineHeight: '24px',
  textAlign: 'center',
  color: props.theme.palette.text.primary
}))

const DescriptionText = styled.p((props) => ({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '100%',
  textAlign: 'center',
  color: props.theme.palette.text.primary,
  opacity: 0.6,
  marginTop: '8px'
}))

const NoWallet = styled.p((props) => ({
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '24px',
  textAlign: 'center',
  color: props.theme.palette.text.primary,
  marginTop: '56px'
}))

const WAIcon = styled.img((props) => ({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '6px',
  marginBottom: '32px',
  width: '64px',
  height: '64px'
}))

const Link = styled.p((props) => ({
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '21px',
  textAlign: 'center',
  background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
  textFillColor: 'transparent',
  marginBottom: '80px',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  cursor: 'pointer',
  transition: '250ms ease',

  [`:hover`]: {
    transform: 'scale(0.95)'
  }
}))
