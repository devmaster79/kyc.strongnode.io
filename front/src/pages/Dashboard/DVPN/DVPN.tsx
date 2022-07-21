import { UserCredentials } from '@ui/dVPN/UserCredentials'
import UsageWidget from '@ui/Crypto/UsageWidget'
import styled from '@emotion/styled'
import Media from 'theme/mediaQueries'

export default function DVPN() {
  return (
    <Wrapper>
      <Container>
        <h1 style={{ marginTop: '56px' }}>dVPN Usage</h1>
        <UsageWidget />
        <GridContainer>
          <Grid>
            <UserCredentials style={{ width: '50%' }} />
          </Grid>
        </GridContainer>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

const Container = styled.div({
  maxWidth: '1536px',
  width: '100%',
  paddingBottom: '100px'
})

const GridContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingRight: '5px',

  [Media.tablet]: {
    paddingRight: '15px',
    flexDirection: 'column',
    margin: '0px'
  },
  [Media.phone]: {
    paddingRight: '0px'
  }
})

const Grid = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '10px',

  [Media.tablet]: {
    flexDirection: 'column',
    margin: '0px'
  }
})
