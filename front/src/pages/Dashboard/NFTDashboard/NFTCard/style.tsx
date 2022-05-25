import styled from '@emotion/styled'

export const Card = styled.div((props) => ({
  background: `props.theme.palette.background.light`,
  color: props.theme.palette.text.primary,
  padding: '8px',
  border: `1px solid ${props.theme.palette.border.light}`,
  boxSizing: 'border-box',
  borderRadius: '8px',
  fontFamily: 'Satoshi-Variable',
  fontStyle: 'normal',
  fontWeight: '900',
  fontSize: '14px',
  lineHeight: '19px',
  width: 'fit-content',
  marginRight: '16px',
  marginBottom: '40px',
  img: {
    width: '280px',
    height: '240px',
    borderRadius: '10px'
  }
}))

export const CardContent = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'space-between',
  div: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    fontWeight: '900'
  },

  span: {
    fontFamily: 'Satoshi-Regular',
    color: props.theme.palette.text.secondary
  }
}))
