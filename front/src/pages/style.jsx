import styled from '@emotion/styled'

export const EntryPage = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  minHeight: '100vh',
  background: `url('/images/background.png')`,
  backgroundSize: '100% 100%',
  '&:before': {
    content: `url('/images/signlogo.png')`,
    margin: '50px 0px'
  }
})
