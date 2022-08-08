import Modal from '@ui/Modal/Modal'
import { useEffect, useState } from 'react'
import { useAnimated } from '../utils/useAnimated'
import Icon from '../Icon/Icon'
import { IconRectangleButton } from '../Button/IconRectangleButton'
import styled from '@emotion/styled/macro'

interface IDVPNAccessModal {
  opened: boolean
  onClose: () => void
  onCloseOnButtonClick?: () => void
}

export const DVPNAccessModal = (props: IDVPNAccessModal) => {
  const [showConnectWalletModal, setShowConnectWaletModal] = useState(
    props.opened
  )
  const turnOnModalAnim = useAnimated(showConnectWalletModal, 500)

  const downloadWallet = () => {
    window.open('https://metamask.io/download/', '_blank')
  }

  useEffect(() => {
    setShowConnectWaletModal(props.opened)
  }, [props.opened])

  return (
    <span>
      {turnOnModalAnim.state !== 'closed' && (
        <Modal onClose={props.onClose} anim={turnOnModalAnim} background={true}>
          <Icon
            name={'walletConnect'}
            height={64}
            width={64}
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '6px',
              marginBottom: '32px'
            }}
          />
          <Title>Welcome to dVPN product</Title>
          <DescriptionText>you can get access via</DescriptionText>

          <IconRectangleButton
            style={{ marginTop: '32px' }}
            title={'Stripe'}
            description={'Get access to dVPN via Stripe'}
            icon={'/icons/stripe_logo.png'}
            iconAlt={'Metamask browser extension connect option'}
            onClick={() => {
              if (props.onCloseOnButtonClick) props.onCloseOnButtonClick()
              else props.onClose()
            }}
          />

          <IconRectangleButton
            style={{ marginTop: '16px' }}
            title={'Strongnode transaction'}
            description={'Get access to dVPN via SNE token'}
            icon={'/icons/sne_logo.png'}
            iconAlt={'Metamask browser extension connect option'}
            onClick={() => {
              if (props.onCloseOnButtonClick) props.onCloseOnButtonClick()
              else props.onClose()
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
