import styled from '@emotion/styled'
import { ComponentProps, ReactNode } from 'react'

export type SwitchButtonProps = ComponentProps<typeof StyledInput> & {
  children?: ReactNode
  checked: boolean
  label: string
  help?: ReactNode
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
          {props.children}
        </StyledButton>
      </SwitchWrapper>
      {props.help && <Help>{props.help}</Help>}
    </Container>
  )
}

const Container = styled.div({
  display: 'flex',
  flexFlow: 'column',
  gap: '0.5em',
  fontSize: '14px',
  fontFamily: 'Satoshi-Variable',
  fontStyle: 'normal',
  fontWeight: '900'
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
    transition: `background 0.28s cubic-bezier(0.4, 0, 0.2, 1)`,
    opacity: 0,
    marginLeft: '14px'
  },

  (props) =>
    props.checked &&
    `+ .switch {
    background: #AA1FEC;
  }`,

  (props) =>
    props.checked &&
    `+ .switch::before {
      left: 24px;
      background: #fff;
    }`
)

const StyledButton = styled.label((props) => ({
  display: 'inline-block',
  position: 'relative',
  width: '50px',
  height: '24px',
  borderRadius: '20px',
  background: props.theme.palette.background.switch,
  verticalAlign: 'middle',
  cursor: 'pointer',
  marginLeft: '14px',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '20px',
    background: '#fafafa',
    borderRadius: '10px',
    transition: `left 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
  }
}))

const Help = styled.div((props) => ({
  fontWeight: '500',
  fontSize: '0.9em',
  color: props.theme.palette.primary ? props.theme.palette.primary[75] : null
}))
