import { AccessWarningModal, AccessWarningModalProps } from './AccessWarningModal'
import { PasswordSetupModal } from './PasswordSetupModal'
import { SwitchWithModal, SwitchWithModalProps } from './SwitchWithModal'

export type PasswordSwitchProps = {
  registerProps: SwitchWithModalProps['registerProps']
  isDirty: SwitchWithModalProps['isDirty']
}

export const PasswordSwitch = ({ registerProps, isDirty }: PasswordSwitchProps) => {
  return (
    <SwitchWithModal
      isDirty={isDirty}
      TurnOnModal={PasswordSetupModal}
      TurnOffModal={TurnOffWarning}
      registerProps={registerProps}
      helpText='Set an additional password authentication step'
      label='Use password'
    />
  )
}

const TurnOffWarning = (props: Omit<AccessWarningModalProps, 'icon' | 'title'>) => (
  <AccessWarningModal
    title='Without password'
    icon='kyc'
    {...props}
  />
)
