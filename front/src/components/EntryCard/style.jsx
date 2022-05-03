import styled from 'styled-components'

export const StyledEntryCard = styled.div`
  width: 100%;
  max-width: ${(props) => (props.emailsent ? '449px' : '482px')};
  padding: 40px;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #1df4f6;
  box-sizing: border-box;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 5px;
  text-align: center;
  h2 {
    font-style: normal;
    font-weight: normal;
    font-size: 34px;
    line-height: 34px;
    color: white;
  }
  h5 {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;
    color: white;
    margin-top: 20px;
  }
`
