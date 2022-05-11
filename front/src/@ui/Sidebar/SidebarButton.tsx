import styled from '@emotion/styled/macro'
import Icon, { IconProps } from '../Icon/Icon'
import { CustomTheme } from '../../theme/index'
import { useNavigate } from 'react-router'
import { useTheme } from '@mui/styles'
import Tooltip from '../Tooltip/Tooltip'

export type SidebarButtonProps = {
  icon: IconProps['name']
  tooltipHint: string
  active: boolean
  disabled?: boolean
  onPress?: unknown
  url?: string
}

const SidebarButton = ({
  icon,
  tooltipHint,
  active,
  onPress,
  url,
  disabled
}: SidebarButtonProps) => {
  const navigate = useNavigate()
  const theme: CustomTheme = useTheme()

  const buttonActiveStyle = {
    backgroundColor: 'rgba(170, 31, 236, 0.12)'
  }

  const onClick = () => {
    if (onPress && typeof onPress === 'function') {
      onPress()
    }
    if (url) {
      navigate(url)
    }
  }

  return (
    <ButtonWrapper
      onClick={
        !disabled
          ? () => {
              onClick()
            }
          : undefined
      }
      style={active ? buttonActiveStyle : { opacity: disabled ? 0.2 : 1 }}>
      <Tooltip tooltip={tooltipHint}>
        <Svg
          name={icon}
          height={24}
          width={24}
          viewBox="0 0 24 24"
          color={
            active
              ? theme?.palette?.icon?.active
              : theme?.palette?.icon?.primary
          }>
          {tooltipHint}
        </Svg>
      </Tooltip>
    </ButtonWrapper>
  )
}

export default SidebarButton

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
    stroke: ${(props) => props.theme?.palette?.icon?.primary};
  }
`
