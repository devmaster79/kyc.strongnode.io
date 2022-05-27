import styled from '@emotion/styled'

export const StyledEntryCard = styled.div((props) => ({
  width: '100%',
  maxWidth: props.emailsent ? '449px' : '482px',
  padding: '40px',
  marginBottom: '40px',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid #1df4f6',
  boxSizing: 'border-box',
  boxSn: '0px 10px 10px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(10px)',
  /* Note: backdrop-filter has minimal browser support */

  borderRadius: '5px',
  textAlign: 'center',
  h2: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '34px',
    lineHeight: '34px',
    color: 'white'
  },
  h5: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '26px',
    color: 'white',
    marginTop: '20px'
  }
}))
