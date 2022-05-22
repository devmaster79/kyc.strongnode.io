import styled from '@emotion/styled'

export const StyledButton = styled.button((props) => ({
  width: `${props.full ? '100%' : null}`,
  minWidth: '64px',
  height: '40px',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  outline: 'none',
  background: '#aa1fec',
  boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)',
  color: 'white',
  fontSize: '19px',
  letterSpacing: '0.02857rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    boxShadow: `0px 5px 5px rgba(255, 255, 255, 0.25)`
  }
}))
