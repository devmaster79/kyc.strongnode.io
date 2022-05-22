import styled from '@emotion/styled'

export const StyledInput = styled.input({
  width: '100%',
  maxWidth: '402px',
  height: '52px',
  outline: 'none',
  padding: '16px 20px',
  borderRadius: '6px',
  fontSize: '18px',
  transition: 'box-shadow 0.2s',
  background: 'rgba(238, 238, 238, 0.0001)',
  border: '1px solid #1df4f6',
  boxSizing: 'border-box',
  boxShadow: 'inset 0px 10px 10px rgba(0, 0, 0, 0.25)',
  color: 'white',
  '&::placeholder': {
    color: 'white',
    fontSize: '18px'
  },
  '&:focus': {
    boxShadow: `0 0 0 2px rgb(169, 172, 255, 0.5)`
  }
})
