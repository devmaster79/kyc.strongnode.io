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
  leftTooltip?: string
  rightTooltip?: string
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
              <LeftIconWrapper title={props.leftTooltip}>
                <Icon
                  name={props.leftIcon}
                  color="rgba(255, 255, 255, 0.5)"
                  height={12}
                  width={12}
                />
              </LeftIconWrapper>
              <RightIconWrapper title={props.rightTooltip}>
                <Icon
                  name={props.rightIcon}
                  color="rgba(255, 255, 255, 0.5)"
                  height={12}
                  width={12}
                />
              </RightIconWrapper>
              <IconWrapper
                className="iconWrapper"
                title={props.checked ? props.rightTooltip : props.leftTooltip}>
                <Icon
                  name={props.checked ? props.rightIcon : props.leftIcon}
                  color="black"
                  height={12}
                  width={12}
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

const LeftIconWrapper = styled.div({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '24px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const RightIconWrapper = styled.div({
  position: 'absolute',
  top: '2px',
  left: '24px',
  width: '24px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const IconWrapper = styled.div({
  position: 'relative',
  top: '2px',
  left: '2px',
  width: '24px',
  height: '20px',
  background: '#fafafa',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const Container = styled.div({
  display: 'flex',
  flexFlow: 'column',
  gap: '0.5em',
  fontSize: '14px',
  fontFamily: 'Satoshi-Variable',
  fontStyle: 'normal',
  fontWeight: 900
})

const SwitchWrapper = styled.label({
  display: 'block'
})

const StyledInput = styled.input<{ checked: boolean }>(
  {
    display: 'inline-block',
    position: 'absolute',
    marginTop: '2px',
    width: '50px',
    height: '22px',
    borderRadius: '20px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    opacity: 0,
    marginLeft: '14px'
  },

  (props) =>
    props.checked &&
    `+ .switch .iconWrapper {
      left: 24px;
      transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }`,

  (props) =>
    !props.checked &&
    `+ .switch .iconWrapper {
      transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }`
)

const StyledButton = styled.label({
  display: 'inline-block',
  position: 'relative',
  width: '50px',
  height: '24px',
  borderRadius: '20px',
  background: '#aa1fec',
  verticalAlign: 'middle',
  cursor: 'pointer',
  marginLeft: '14px'
})

const Help = styled.div((props) => ({
  fontWeight: 500,
  fontSize: '0.9em',
  color: props.theme.palette.primary[75]
}))
