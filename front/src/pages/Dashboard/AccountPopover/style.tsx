import styled from '@emotion/styled'

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  & :first-child {
    margin-right: 8px;
  }
`

export const AccountPopoverWrapper = styled.div`
  position: absolute;
  top: 65px;
  right: 25px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.palette.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  padding: 32px 40px;
  font-family: 'Satoshi';
  line-height: 140%;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.palette.text.primary};

  & > span {
    color: ${props => props.theme.palette.text.secondary};
  }

  & > ul {
    list-style:none;
    text-transform: uppercase;
    font-size: 14px;
    text-align: left;
    margin-bottom: 32px;

    & > li {
      padding: 16px 0px;
      border-bottom: 1px solid ${props => props.theme.palette.border.light};
      cursor: pointer;
    }
  }
`
