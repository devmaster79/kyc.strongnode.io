import useTheme from '@mui/material/styles/useTheme'
import { CSSProperties, SVGProps } from 'react'
import { Icons } from './CustomIcons'

export type IconProps = {
  name: keyof typeof Icons
  color?: string
  height?: number
  width?: number
  viewBox?: string
  style?: CSSProperties
}

function Icon(props: IconProps) {
  const theme = useTheme()
  const CurrentIcon = Icons[props.name]

  return (
    <CurrentIcon
      height={props.height}
      width={props.width}
      color={props.color || theme.palette.text.secondary}
      style={props.style}
    />
  )
}

export default Icon
