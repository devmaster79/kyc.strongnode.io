import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from '../../components/icon/Icon'
import { useNavigate } from 'react-router'
import { useTheme } from '@mui/styles'
import Tooltip from "../Tooltip/Tooltip"

const Svg = styled(Icon)`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: 250ms ease;
  fill: transparent;

  path {
    transition: 250ms ease;
  }
`

const ButtonWrapper = styled.button`
  width: 100%;
  height: 72px;
  position: relative;
  cursor: pointer;
  transition: 250ms ease;
  border: none;
  background: transparent;
  
  &:hover {
    background: rgba(170, 31, 236, 0.12);
  }
  
  &:hover ${Svg} path {
    stroke: ${props => props.theme.palette.icon.primary};
  }
`

type buttonProps = {
  icon: string,
  tooltipHint: string,
  active: boolean,
  onPress?: any,
  url?: string
}

const SidebarButton = ({icon, tooltipHint, active, onPress, url}: buttonProps) => {
  const navigate: any = useNavigate()
  const theme: any = useTheme()

  const buttonActiveStyle = {
    backgroundColor: 'rgba(170, 31, 236, 0.12)'
  }

  const activePathStyle = {
    stroke: theme.palette.icon.primary
  }

  const resolveIconContent = () => {
    switch (icon) {
      case 'defi':
        return <g><path style={active ? activePathStyle : {}} d="M7 13H1V1H19V9.171" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M11 12V16C11 17.657 13.686 19 17 19C20.314 19 23 17.657 23 16V12" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M11 16V20C11 21.657 13.686 23 17 23C20.314 23 23 21.657 23 20V16" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M17 15C20.3137 15 23 13.6569 23 12C23 10.3431 20.3137 9 17 9C13.6863 9 11 10.3431 11 12C11 13.6569 13.6863 15 17 15Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/><path style={active ? activePathStyle : {}} d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44772 6 9 6.44772 9 7C9 7.55228 9.44772 8 10 8Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/><path style={active ? activePathStyle : {}} d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44772 6 9 6.44772 9 7C9 7.55228 9.44772 8 10 8Z" fill="#9593C8"/></g>
      case 'nft':
        return <g><path style={active ? activePathStyle : {}} d="M16 6H6V16H16V6Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/><path style={active ? activePathStyle : {}} d="M18.723 1H21V3.277C20.6961 3.45047 20.4435 3.70123 20.2679 4.00382C20.0922 4.30642 19.9996 4.6501 19.9996 5C19.9996 5.3499 20.0922 5.69358 20.2679 5.99618C20.4435 6.29877 20.6961 6.54953 21 6.723V9.277C20.6961 9.45047 20.4435 9.70123 20.2679 10.0038C20.0922 10.3064 19.9996 10.6501 19.9996 11C19.9996 11.3499 20.0922 11.6936 20.2679 11.9962C20.4435 12.2988 20.6961 12.5495 21 12.723V15.277C20.6961 15.4505 20.4435 15.7012 20.2679 16.0038C20.0922 16.3064 19.9996 16.6501 19.9996 17C19.9996 17.3499 20.0922 17.6936 20.2679 17.9962C20.4435 18.2988 20.6961 18.5495 21 18.723V21H18.723C18.5495 20.6961 18.2988 20.4435 17.9962 20.2679C17.6936 20.0922 17.3499 19.9996 17 19.9996C16.6501 19.9996 16.3064 20.0922 16.0038 20.2679C15.7012 20.4435 15.4505 20.6961 15.277 21H12.723C12.5495 20.6961 12.2988 20.4435 11.9962 20.2679C11.6936 20.0922 11.3499 19.9996 11 19.9996C10.6501 19.9996 10.3064 20.0922 10.0038 20.2679C9.70123 20.4435 9.45047 20.6961 9.277 21H6.723C6.54953 20.6961 6.29877 20.4435 5.99618 20.2679C5.69358 20.0922 5.3499 19.9996 5 19.9996C4.6501 19.9996 4.30642 20.0922 4.00382 20.2679C3.70123 20.4435 3.45047 20.6961 3.277 21H1V18.723C1.30387 18.5495 1.55646 18.2988 1.73215 17.9962C1.90783 17.6936 2.00037 17.3499 2.00037 17C2.00037 16.6501 1.90783 16.3064 1.73215 16.0038C1.55646 15.7012 1.30387 15.4505 1 15.277V12.723C1.30387 12.5495 1.55646 12.2988 1.73215 11.9962C1.90783 11.6936 2.00037 11.3499 2.00037 11C2.00037 10.6501 1.90783 10.3064 1.73215 10.0038C1.55646 9.70123 1.30387 9.45047 1 9.277V6.723C1.30387 6.54953 1.55646 6.29877 1.73215 5.99618C1.90783 5.69358 2.00037 5.3499 2.00037 5C2.00037 4.6501 1.90783 4.30642 1.73215 4.00382C1.55646 3.70123 1.30387 3.45047 1 3.277V1H3.277C3.45047 1.30387 3.70123 1.55646 4.00382 1.73215C4.30642 1.90783 4.6501 2.00037 5 2.00037C5.3499 2.00037 5.69358 1.90783 5.99618 1.73215C6.29877 1.55646 6.54953 1.30387 6.723 1H9.277C9.45047 1.30387 9.70123 1.55646 10.0038 1.73215C10.3064 1.90783 10.6501 2.00037 11 2.00037C11.3499 2.00037 11.6936 1.90783 11.9962 1.73215C12.2988 1.55646 12.5495 1.30387 12.723 1H15.277C15.4505 1.30387 15.7012 1.55646 16.0038 1.73215C16.3064 1.90783 16.6501 2.00037 17 2.00037C17.3499 2.00037 17.6936 1.90783 17.9962 1.73215C18.2988 1.55646 18.5495 1.30387 18.723 1V1Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/></g>
      case 'kyc':
        return <g><path style={active ? activePathStyle : {}} d="M10.5779 4C10.1185 2.9472 9.31048 2.08471 8.28988 1.55757C7.26927 1.03043 6.09828 0.870777 4.97381 1.10547C3.84934 1.34016 2.83997 1.95487 2.11543 2.84625C1.39089 3.73763 0.995361 4.8513 0.995361 6C0.995361 7.1487 1.39089 8.26237 2.11543 9.15375C2.83997 10.0451 3.84934 10.6598 4.97381 10.8945C6.09828 11.1292 7.26927 10.9696 8.28988 10.4424C9.31048 9.91529 10.1185 9.0528 10.5779 8H14.9999L16.9999 10L18.9999 8H20.9999L21.9999 4H10.5779Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" fill="#9593C8"/><path style={active ? activePathStyle : {}} d="M5.99982 15V18L4.41382 19.586" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/><path style={active ? activePathStyle : {}} d="M18 15V18L19.589 19.589" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/><path style={active ? activePathStyle : {}} d="M3 23C4.10457 23 5 22.1046 5 21C5 19.8954 4.10457 19 3 19C1.89543 19 1 19.8954 1 21C1 22.1046 1.89543 23 3 23Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M12 23C13.1046 23 14 22.1046 14 21C14 19.8954 13.1046 19 12 19C10.8954 19 10 19.8954 10 21C10 22.1046 10.8954 23 12 23Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M21 23C22.1046 23 23 22.1046 23 21C23 19.8954 22.1046 19 21 19C19.8954 19 19 19.8954 19 21C19 22.1046 19.8954 23 21 23Z" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10"/><path style={active ? activePathStyle : {}} d="M12 19V12" stroke="#9593C8" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/></g>
    }
  }

  const onClick = () => {
    if (onPress)
      onPress()

    if (url)
      navigate(url)
  }

  return (
    <ButtonWrapper onClick={() => {onClick()}} style={active ? buttonActiveStyle : {}}>
      <Tooltip tooltip={tooltipHint}>
        <Svg viewBox="0 0 24 24">
          {resolveIconContent()}
          {tooltipHint}
        </Svg>
      </Tooltip>
    </ButtonWrapper>
  )
}

export default SidebarButton
