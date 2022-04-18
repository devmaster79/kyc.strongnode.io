import useTheme from '@mui/material/styles/useTheme'
import { CSSProperties, SVGProps } from 'react'
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
  const CurrentIcon = Icons[props.name]

  return (
    <SvgIcon
      height={props.height}
      width={props.width}
      viewBox={props.viewBox}
      color={props.color || theme.palette.text.secondary}
      style={props.style}
    >
      {CurrentIcon}
    </SvgIcon>
  )
}

export default Icon

export function SvgIcon (props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      height={props.height || 16}
      width={props.width || 16}
      viewBox={props.viewBox || '0 0 16 16'}
      version={props.version || '1.1'}
      xmlns={props.xmlns || 'http://www.w3.org/2000/svg'}
      xmlnsXlink={props.xmlnsXlink || 'http://www.w3.org/1999/xlink'}
      fill={props.fill || 'none'}
      style={{overflow: 'initial'}}
    />
  )
}
