import styled from '@emotion/styled'
import Media from 'theme/mediaQueries'
interface StyledButtonProps {
  variant?: 'normal' | 'medium' | 'large' | 'xl'
  justify?: 'center' | 'space-between'
  color?: 'default' | 'invert' | 'white'
  invert?: boolean
}

const Button = styled.button<StyledButtonProps>(
  {
    background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
    boxShadow:
      '0px 16px 40px rgba(170, 31, 236, 0.32), inset 0px 1px 1px rgba(255, 255, 255, 0.4)',
    borderRadius: '92px',
    fontFamily: 'Satoshi-Variable',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '12px',
    lineHeight: '100%',
    textTransform: 'uppercase',
    padding: '12px 54px',
    border: '0px',
    margin: '16px 0px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },

  (props) => ({
    color: props.theme.palette.button.text
  }),

  (props) =>
    props.variant === 'normal' && {
      fontSize: '14px',
      padding: '21px',
      minWidth: '246px',
      margin: '8px'
    },

  (props) =>
    props.variant === 'medium' && {
      fontSize: '14px',
      padding: '21px',
      minWidth: '200px',
      margin: '8px'
    },

  (props) =>
    props.variant === 'xl' && {
      minWidth: '530px',
      fontSize: '14px',
      padding: '15px 24px',
      [Media.phone]: {
        minWidth: '85vw'
      }
    },

  (props) =>
    props.variant === 'large' && {
      minWidth: '360px',
      fontSize: '14px',
      padding: '21px',

      [Media.phone]: {
        minWidth: '85vw'
      }
    },

  (props) =>
    props.justify === 'space-between' && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },

  (props) =>
    props.color === 'invert' && {
      background: props.theme.palette.button.background.invert,
      border: `1px solid ${props.theme.palette.border.button}`,
      boxShadow: 'none',
      color: props.theme.palette.button.invert
    },

  (props) =>
    props.color === 'white' && {
      background: props.theme.palette.background.white,
      color: props.theme.palette.text.whiteButton,
      boxShadow: 'none'
    },

  (props) =>
    props.disabled && {
      cursor: 'inherit',
      opacity: 0.4
    }
)

export default Button
