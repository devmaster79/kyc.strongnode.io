import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Icon from '@ui/Icon/Icon'
import { MouseEventHandler, ReactNode } from 'react'

type ModalProps = {
  children: ReactNode,
  icon: string,
  title: string,
  onClose: MouseEventHandler<HTMLDivElement> | undefined,
  onApprove: MouseEventHandler<HTMLDivElement> | undefined
}

function Modal (props: ModalProps) {
  return <ModalWrapper>
    <StyledModal>
      <IconWrapper onClick={props.onClose}>
        <Icon name="close" width={18} height={18} viewBox="0 0 18 18" style={{ cursor: 'pointer' }} />
      </IconWrapper>
      <Icon name={props.icon} width={64} height={64} viewBox="0 0 64 64" />
      <h1>{props.title}</h1>
      {props.children}
      <ButtonWrapper>
        <Button type="hugeInvert" onClick={props.onClose} >Cancel</Button>
        <Button type="huge" onClick={props.onApprove}>Approve</Button>
      </ButtonWrapper>
    </StyledModal>
     </ModalWrapper>
}

export default Modal

const ModalWrapper = styled.div`
      height: 100vh;
      width: 100vw;
      background-color: rgba(8, 7, 41, 0.8);
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1300;
`
const IconWrapper = styled.div`
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: end;
`
const StyledModal = styled.div`
      min-width: 642px;
      background: ${props => props.theme.palette.background.secondary};
      border: 1px solid ${props => props.theme.palette.border.light};
      box-sizing: border-box;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      line-height: 24px;

      color: ${props => props.theme.palette.text.secondary};

      h1 {
        font-size: 18px;
        margin-top: 24px;
        padding-bottom: 8px;
      }
`
const ButtonWrapper = styled.div`
      padding-top: 23px;
      padding-bottom: 40px;
`
