import styled from 'styled-components';

export const StyledEntryCard = styled.div`
  width: 100%;
  max-width: ${props => props.emailsent ? '522px' : '482px'}; 
  padding: 40px;
  margin-bottom: 40px;
  background-color: #ffffff;
  box-shadow: 0px 15px 30px rgba(16, 16, 16, 0.08);
  border-radius: 12px;
  text-align: center;
  h2 {
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 34px;
    color: #210E43;
  }
  span {
    display: block;
    margin-top: 40px;
    color: #888888;
    font-size: 14px;
  }
  a {
    margin-left: 4px;
    color: #2f8bfd;
  }
  h5 {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;
    color: #627083;
    margin-top: 20px;
  }
`