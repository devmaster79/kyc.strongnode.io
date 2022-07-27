import styled from '@emotion/styled'
import Media from '../../theme/mediaQueries'

export const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

export const TittleWrapper = styled.div({
  display: 'flex',
  marginTop: '56px'
})

export const Container = styled.div({
  maxWidth: '1536px',
  width: '100%',
  paddingBottom: '100px'
})

export const GridContainer = styled.div({
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

export const Grid = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '10px',

  [Media.tablet]: {
    flexDirection: 'column',
    margin: '0px'
  }
})
