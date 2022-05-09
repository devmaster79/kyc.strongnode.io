import styled from '@emotion/styled'
import Icon from '../../../@ui/Icon/Icon'

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
  right: 0px;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.palette.background.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  padding: 32px 40px;
  line-height: 140%;
  font-size: 16px;
  text-align: center;
  color: ${(props) => props.theme.palette.text.primary};

  & > span {
    color: ${(props) => props.theme.palette.text.secondary};
  }

  & > ul {
    list-style: none;
    text-transform: uppercase;
    font-size: 14px;
    text-align: left;
    margin-bottom: 32px;

    & > li {
      padding: 16px 0px;
      border-bottom: 1px solid ${(props) => props.theme.palette.border.light};
      cursor: pointer;
    }
  }

  & > ol {
    list-style: none;
    text-transform: uppercase;
    font-size: 14px;
    text-align: left;
    margin-bottom: 0;

    & > li {
      padding: 16px 0px;
      border-bottom: 1px solid ${(props) => props.theme.palette.border.light};
    }
  }
`

export const AvatarIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.palette.icon.wrapper};
  box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.25), inset 0px 0px 18px rgba(255, 255, 255, 0.12);
  border-radius: 102px;
  display: block;
  position: relative;
  cursor: pointer;

  & svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`
