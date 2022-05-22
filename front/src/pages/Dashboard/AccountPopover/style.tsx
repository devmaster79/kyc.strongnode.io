import styled from '@emotion/styled'

export const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '& :first-child': {
    marginRight: '8px'
  }
})

export const AccountPopoverWrapper = styled.div((props) => ({
  position: 'absolute',
  top: '65px',
  right: '0px',
  display: 'flex',
  flexDirection: 'column',
  background: `${props.theme.palette.background.primary}`,
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  boxSizing: 'border-box',
  borderRadius: '10px',
  padding: '32px 40px',
  lineHeight: '140%',
  fontSize: '16px',
  textAlign: 'center',
  color: `${props.theme.palette.text.primary}`,

  '& > span': {
    color: `${props.theme.palette.text.secondary}`
  },

  '& > ul': {
    listStyle: 'none',
    textTransform: 'uppercase',
    fontSize: '14px',
    textAlign: 'left',
    marginBottom: '32px',

    '& > li': {
      padding: '16px 0px',
      borderBottom: `1px solid ${props.theme.palette.border.light}`,
      cursor: 'pointer'
    }
  }
}))

export const AvatarIconWrapper = styled.div((props) => ({
  width: '40px',
  height: '40px',
  background: `${props.theme.palette.icon.wrapper}`,
  boxShadow: `0px 1px 0px rgba(255, 255, 255, 0.25)
  inset 0px 0px 18px rgba(255, 255, 255, 0.12)`,
  borderRadius: '102px',
  display: 'block',
  position: 'relative',
  cursor: 'pointer',

  '& svg': {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}))
