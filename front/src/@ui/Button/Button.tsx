import styled from '@emotion/styled'
interface StyledButtonProps {
  variant?: 'normal' | 'medium' | 'large' | 'xl'
  justify?: 'center' | 'space-between'
  color?: 'default' | 'invert' | 'white'
  invert?: boolean
}

const Button = styled.button<StyledButtonProps>(
  {
    background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
    boxShadow:
      '0px 16px 40px rgba(170, 31, 236, 0.32), inset 0px 1px 1px rgba(255, 255, 255, 0.4)',
    borderRadius: '92px',
    fontFamily: 'Satoshi-Variable',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '12px',
    lineHeight: '100%',
    textTransform: 'uppercase',
    padding: '12px 54px',
    border: '0px',
    margin: '16px 0px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },

  (props) =>
    `
    color: ${props.theme.palette.button.text};
`,

  (props) =>
    props.variant === 'medium' &&
    `
  font-size: 14px;
  padding: 21px;
  min-width: 200px;
  margin: 8px;
  `,

  (props) =>
    props.variant === 'xl' &&
    `
    min-width: 530px;
    font-size: 14px;
    padding: 15px 24px;
    @media only screen and (max-width: 550px) {
      min-width: 85vw;
    }
  `,

  (props) =>
    props.variant === 'large' &&
    `
      min-width: 360px;
      font-size: 14px;
      padding: 21px;

      @media only screen and (max-width: 400px) {
        min-width: 85vw;
      }
    `,

  (props) =>
    props.justify === 'space-between' &&
    `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  (props) =>
    props.color === 'invert' &&
    `
      background: ${props.theme.palette.button.background.invert};
      border: 1px solid ${props.theme.palette.border.button};
      box-shadow: none;
      color: ${props.theme.palette.button.invert};
    `,

  (props) =>
    props.color === 'white' &&
    `
    background: ${props.theme.palette.background.white};
    color: ${props.theme.palette.text.whiteButton};
    box-shadow: none;
  `,

  (props) =>
    props.disabled &&
    `
  cursor: inherit;
  opacity: 0.4;
`
)

export default Button
