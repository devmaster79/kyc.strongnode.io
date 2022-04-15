import styled from '@emotion/styled'
import { ComponentProps, ReactNode } from 'react'

export type SwitchButtonProps = ComponentProps<typeof StyledInput> & {
  children?: ReactNode,
  label: string,
  help?: ReactNode,
} & ({ name: string} | { id: string });

export default function SwitchButton ({ children, name, label, help, ...props }: SwitchButtonProps) {
  return (
    <Container>
      <SwitchWrapper style={{ display: 'block' }}>
        {label}
        <StyledInput type='checkbox' hidden id={props.id || name} {...props} />
        <StyledButton className='switch' htmlFor={props.id || name}>{children}</StyledButton>
      </SwitchWrapper>
      {help && <Help>{help}</Help>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  gap: 0.5em;
  font-size: 14px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
`

const SwitchWrapper = styled.label`
  display: block;
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
        left: 24px;
        background: #fff;
    }

`

const StyledButton = styled.label`
  display: inline-block;
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 20px;
  background:  ${props => props.theme.palette.background.switch};
  vertical-align: middle;
  cursor: pointer;
  margin-left: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 20px;
    background: #fafafa;
    border-radius: 10px;
    transition: left 0.20s cubic-bezier(0.4, 0, 0.2, 1);
  }
`

const Help = styled.div`
  font-weight: 500;
  font-size: 0.9em;
  color:  ${props => props.theme.palette.primary[75]};
`
