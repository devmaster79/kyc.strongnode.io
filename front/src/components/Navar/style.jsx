import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  padding: 0 64px;
  margin-bottom: ${(props) => (props.privatesale ? '80px' : '102px')};
  color: #000000;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

export const NavItemLink = styled(Link)`
  color: #000000;
  font-size: 16px;
  font-style: normal;
  line-height: 19.36px;
  font-weight: 600;

  ${(props) =>
    props.fill &&
    css`
      padding: 8px 16px;
      border-radius: 4px;
      background-color: #2f8bfd;
      transition: background-color 0.2s;
      &:hover {
        background-color: #0072ff;
      }
    `}
`

export const NavItem = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

export const UserInfoWrapper = styled.div`
  margin: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  p {
    color: #210e43;
    font-size: 18px;
    line-height: 27px;
    font-style: medium;
    font-weight: 500;
  }
  span {
    color: #9086a1;
    font-style: regular;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
  }
`
