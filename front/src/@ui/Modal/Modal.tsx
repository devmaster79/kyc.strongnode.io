import styled from '@emotion/styled'
import Icon, { IconProps } from '@ui/Icon/Icon'
import { IAnim } from '@ui/utils/useAnimated'
import { ReactNode } from 'react'
import Media from './../../theme/mediaQueries'

export type ModalProps = {
  children: ReactNode
  icon?: IconProps['name']
  iconProps?: IconProps
  closeIconHidden: boolean
  title?: string
  onClose?: () => void
  footer?: ReactNode
  anim: IAnim
  scrollable: boolean
  background?: boolean
}

export default function Modal(props: ModalProps) {
  return (
    <ModalWrapper anim={props.anim}>
      <StyledModal
        scrollable={props.scrollable}
        background={props.background ? props.background : false}>
        {!props.closeIconHidden && (
          <IconWrapper onClick={() => props.onClose && props.onClose()}>
            <Icon
              name="close"
              width={18}
              height={18}
              viewBox="0 0 18 18"
              style={{ cursor: 'pointer' }}
            />
          </IconWrapper>
        )}
        {props.icon && <Icon {...props.iconProps} name={props.icon} />}
        {props.title && <h1>{props.title}</h1>}
        {props.children}
        {props.footer && <Footer>{props.footer}</Footer>}
      </StyledModal>
    </ModalWrapper>
  )
}

Modal.defaultProps = {
  iconProps: {
    height: 64,
    width: 64,
    viewBox: '0 0 64 64'
  },
  closeIconHidden: false,
  scrollable: false
}

interface ModalWrapperProps {
  anim: IAnim
}

interface StyledModalProps {
  scrollable: boolean
  background: boolean
}

const ModalWrapper = styled.div<ModalWrapperProps>((props) => ({
  height: '100vh',
  width: '100vw',
  padding: '8rem',
  backgroundColor: props.theme.palette.background.modal,
  position: 'fixed',
  top: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '1300',
  display: props.anim.state === 'closed' ? 'none' : 'flex',
  opacity:
    props.anim.state === 'open' || props.anim.state === 'beforeOpening'
      ? '1'
      : '0',
  transition: `opacity ${props.anim.delay}ms ease`
}))

const IconWrapper = styled.div({
  width: '100%',
  padding: '16px',
  display: 'flex',
  justifyContent: 'end'
})

const StyledModal = styled.div<StyledModalProps>((props) => ({
  minWidth: '642px',
  overflow: 'auto',
  height: props.scrollable ? '100%' : 'unset',
  background: props.background
    ? props.theme.palette.background.modalSecondary
    : '#FFFFFF',
  backgroundImage: props.background
    ? props.theme.palette.background.modalBackground
    : 'none',
  backgorundSize: props.background ? 'cover' : 'none',
  border: `1px solid ${props.theme.palette.border.light}`,
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '10px',
  textAlign: 'center',
  lineHeight: '24px',

  color: props.theme.palette.text.secondary,

  h1: {
    fontSize: '18px',
    marginTop: '24px',
    paddingBottom: '8px'
  },

  [Media.phone]: {
    minWidth: '95vw',
    maxWidth: '95vw'
  }
}))

const Footer = styled.div({
  paddingTop: '23px',
  paddingBottom: '40px'
})
