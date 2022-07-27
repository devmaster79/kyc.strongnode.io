import styled from '@emotion/styled'

type AlertProps = { type: 'success' | 'error' | 'info' }
export const Alert = styled('div', {
  shouldForwardProp: (prop) => prop !== 'type'
})<AlertProps>((props) => {
  const colorByType = {
    success: props.theme.palette.success.main,
    error: props.theme.palette.error.main,
    info: props.theme.palette.info.main
  }
  return {
    borderRadius: '8px',
    background: props.theme.palette.background.primary,
    color: props.theme.palette.text.primary,
    padding: '1em',
    marginBottom: '3em',
    border: `1px solid ${props.theme.palette.border.light}`,
    borderBottom: `1px solid ${colorByType[props.type]}`
  }
})
