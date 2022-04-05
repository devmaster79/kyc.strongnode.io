import styled from '@emotion/styled'

function SwitchButton ({ children, ...props }: any) {
  return <SwitchWrapper style={{ display: 'block' }}>
    {props.label}
    <StyledInput type="checkbox" hidden={true} id={props.id} {...props} />
    <StyledButton className="switch" htmlFor={props.id}>{children}</StyledButton>
  </SwitchWrapper>
}

export default SwitchButton

const SwitchWrapper = styled.label`
  display:block;
  font-size: 14px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
  padding: 14px;
`

const StyledInput = styled.input`
    display: inline-block;
    position: absolute;
    margin-top: 2px;
    width: 50px;
    height: 22px;
    border-radius: 20px;
    vertical-align: middle;
    cursor: pointer;
    transition: background 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    margin-left: 14px;

    &:checked + .switch {
      background: #AA1FEC;
    }
    &:checked + .switch::before {
        left: 27px;
        background: #fff;
    }

`

const StyledButton = styled.label`
  display: inline-block;
  position: relative;
  width: 50px;
  height: 25px;
  border-radius: 20px;
  background:  ${props => props.theme.palette.background.switch};
  vertical-align: middle;
  cursor: pointer;
  margin-left: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: #fafafa;
    border-radius: 50%;
    transition: left 0.20s cubic-bezier(0.4, 0, 0.2, 1);
  }
`
