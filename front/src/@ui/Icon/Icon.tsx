import useTheme from '@mui/material/styles/useTheme'
import { CSSProperties } from 'react'
import styled from 'styled-components'
import { Icons } from './CustomIcons'

export type IconProps = {
  name: keyof typeof Icons,
  color?: string,
  height?: number,
  width?: number,
  viewBox?: string,
  style?: CSSProperties
}

function Icon (props: IconProps) {
  const theme = useTheme()

  return <SvgIcon height={props.height} width={props.width} viewBox={props.viewBox} color={props.color || theme.palette.text.secondary} style={props.style}>
        { Icons[props.name]}
      </SvgIcon>
}

export default Icon

Icon.defaultProps = {
  height: 16,
  width: 16,
  viewBox: '0 0 16 16',
  style: {}
}

const SvgIcon = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
  fill: 'none'
})``
