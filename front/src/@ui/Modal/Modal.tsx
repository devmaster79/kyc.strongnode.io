import styled from '@emotion/styled';
import Icon, { IconProps } from '@ui/Icon/Icon';
import { IAnim } from '@ui/utils/useAnimated';
import { ReactNode } from 'react';

export type ModalProps = {
  children: ReactNode;
  icon?: IconProps['name'];
  iconProps?: IconProps;
  closeIconHidden: boolean;
  title?: string;
  onClose?: () => void;
  footer?: ReactNode;
  anim: IAnim;
  scrollable: boolean;
};

export default function Modal(props: ModalProps) {
  return (
    <ModalWrapper anim={props.anim}>
      <StyledModal scrollable={props.scrollable}>
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
  );
}

Modal.defaultProps = {
  iconProps: {
    height: 64,
    width: 64,
    viewBox: '0 0 64 64'
  },
  closeIconHidden: false,
  scrollable: false
};

interface ModalWrapperProps {
  anim: IAnim;
}

interface StyledModalProps {
  scrollable: boolean;
}

const ModalWrapper = styled.div<ModalWrapperProps>`
  height: 100vh;
  width: 100vw;
  padding: 8rem;
  background-color: ${(props) => props.theme.palette.background.modal};
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 1300;
  display: ${({ anim }) => (anim.state === 'closed' ? 'none' : 'flex')};
  opacity: ${({ anim }) => (anim.state === 'open' || anim.state === 'beforeOpening' ? '1' : '0')};
  transition: opacity ${({ anim }) => anim.delay}ms ease;
`;
const IconWrapper = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: end;
`;
const StyledModal = styled.div<StyledModalProps>`
  min-width: 642px;
  height: ${({ scrollable }) => (scrollable ? '100%' : 'unset')};
  overflow: auto;
  background: ${(props) => props.theme.palette.background.secondary};
  border: 1px solid ${(props) => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 24px;

  color: ${(props) => props.theme.palette.text.secondary};

  h1 {
    font-size: 18px;
    margin-top: 24px;
    padding-bottom: 8px;
  }

  @media only screen and (max-width: 600px) {
    min-width: 95vw;
    max-width: 95vw;
  }
`;
const Footer = styled.div`
  padding-top: 23px;
  padding-bottom: 40px;
`;
