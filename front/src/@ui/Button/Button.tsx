import { css } from '@emotion/react';
import styled from '@emotion/styled';
interface StyledButtonProps {
  variant?: 'normal' | 'medium' | 'large' | 'xl';
  justify?: 'center' | 'space-between';
  color?: 'default' | 'invert' | 'white';
  invert?: boolean;
}

const Button = styled.button<StyledButtonProps>`
  background: linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%);
  box-shadow: 0px 16px 40px rgba(170, 31, 236, 0.32), inset 0px 1px 1px rgba(255, 255, 255, 0.4);
  border-radius: 92px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
  line-height: 100%;
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.button.text};
  padding: 12px 54px;
  border: 0px;
  margin: 16px 0px;
  cursor: pointer;
  white-space: nowrap;

  ${(props) => {
    if (props.variant === 'medium') {
      return css`
        font-size: 14px;
        padding: 21px;
        min-width: 200px;
        margin: 8px;
      `;
    } else if (props.variant === 'xl') {
      return css`
        min-width: 530px;
        font-size: 14px;
        padding: 15px 24px;
        @media only screen and (max-width: 550px) {
          min-width: 85vw;
        }
      `;
    } else if (props.variant === 'large') {
      return css`
        min-width: 360px;
        font-size: 14px;
        padding: 21px;

        @media only screen and (max-width: 400px) {
          min-width: 85vw;
        }
      `;
    }
  }}
  ${(props) => {
    if (props.justify === 'space-between') {
      return css`
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
    }
  }}
  ${(props) => {
    if (props.color === 'invert') {
      return css`
        background: ${props.theme.palette.button.background.invert};
        border: 1px solid ${props.theme.palette.border.button};
        box-shadow: none;
        color: ${props.theme.palette.button.invert};
      `;
    } else if (props.color === 'white') {
      return css`
        background: ${props.theme.palette.background.white};
        color: ${props.theme.palette.text.dark};
        box-shadow: none;
      `;
    }
  }}
  ${(props) => {
    if (props.disabled) {
      return css`
        cursor: inherit;
        opacity: 0.4;
      `;
    }
  }}
`;

export default Button;
