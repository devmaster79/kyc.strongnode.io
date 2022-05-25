import styled from '@emotion/styled'

export const StyledLine = styled.div((props) => ({
  width: props.full ? '100%' : '20%',
  height: '1px',
  background: '#bcb7c7',
  marginTop: '40px'
}))
