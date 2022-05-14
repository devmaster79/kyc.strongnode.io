import styled from '@emotion/styled'
import Icon, { IconProps } from '@ui/Icon/Icon'
import { ComponentProps, ReactNode } from 'react'

export type SwitchButtonProps = ComponentProps<typeof StyledInput> & {
  children?: ReactNode
  checked: boolean
  label?: string
  help?: ReactNode
  leftIcon?: IconProps['name']
  rightIcon?: IconProps['name']
} & ({ name: string } | { id: string })

export default function SwitchButton(props: SwitchButtonProps) {
  return (
    <Container>
      <SwitchWrapper style={{ display: 'block' }}>
        {props.label}
        <StyledInput
          type="checkbox"
          hidden
          id={props.id || props.name}
          {...props}
        />
        <StyledButton className="switch" htmlFor={props.id || props.name}>
          {props.rightIcon && props.leftIcon && (
            <>
              <LeftIconWrapper>
                <Icon
                  name={props.leftIcon}
                  color="rgba(255, 255, 255, 0.5)"
                  height={12}
                  width={12}
                  viewBox="0 0 12 12"
                />
              </LeftIconWrapper>
              <RightIconWrapper>
                <Icon
                  name={props.rightIcon}
                  color="rgba(255, 255, 255, 0.5)"
                  height={12}
                  width={12}
                  viewBox="0 0 12 12"
                />
              </RightIconWrapper>
              <IconWrapper className="iconWrapper">
                <Icon
                  name={props.checked ? props.rightIcon : props.leftIcon}
                  color="black"
                  height={12}
                  width={12}
                  viewBox="0 0 12 12"
                />
              </IconWrapper>
            </>
          )}
          {props.children}
        </StyledButton>
      </SwitchWrapper>
      {props.help && <Help>{props.help}</Help>}
    </Container>
  )
}

const LeftIconWrapper = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RightIconWrapper = styled.div`
  position: absolute;
  top: 2px;
  left: 24px;
  width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const IconWrapper = styled.div`
  position: relative;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 20px;
  background: #fafafa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

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

const StyledInput = styled.input<{ checked: boolean }>`
  display: inline-block;
  position: absolute;
  margin-top: 2px;
  width: 50px;
  height: 22px;
  border-radius: 20px;
  vertical-align: middle;
  cursor: pointer;
  opacity: 0;
  margin-left: 14px;
  ${(props) =>
    props.checked &&
    `+ .switch .iconWrapper {
      left: 24px;
      transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }`}
  ${(props) =>
    !props.checked &&
    `+ .switch .iconWrapper {
      transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }`}
`

const StyledButton = styled.label`
  display: inline-block;
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 20px;
  background: #aa1fec;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 14px;
`

const Help = styled.div`
  font-weight: 500;
  font-size: 0.9em;
  color: ${(props) => props.theme.palette.primary[75]};
`
