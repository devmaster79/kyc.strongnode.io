import styled from '@emotion/styled'

export const StyledInputGroup = styled.div({
  marginBottom: '20px',
  textAlign: 'left',
  position: 'relative',
  label: {
    display: 'inline-block',
    marginBottom: '0.5rem',
    color: '#88888'
  },
  svg: {
    fill: 'white',
    position: 'absolute',
    top: 'calc(50% - 1px)',
    left: '15px',
    transform: 'translateY(-50%)'
  }
})
