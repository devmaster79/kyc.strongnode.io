import {
  AccessWarningModal,
  AccessWarningModalProps
} from './AccessWarningModal'
import { AuthenticatorSetupModal } from './AuthenticatorSetupModal'
import { SwitchWithModal, SwitchWithModalProps } from './SwitchWithModal'

export type AuthenticatorSwitchProps = {
  registerProps: SwitchWithModalProps['registerProps']
  isDirty: SwitchWithModalProps['isDirty']
}

export const AuthenticatorSwitch = ({
  registerProps,
  isDirty
}: AuthenticatorSwitchProps) => {
  return (
    <SwitchWithModal
      isDirty={isDirty}
      TurnOnModal={AuthenticatorSetupModal}
      TurnOffModal={TurnOffWarning}
      registerProps={registerProps}
      label="Authenticator"
    />
  )
}

const TurnOffWarning = (
  props: Omit<AccessWarningModalProps, 'icon' | 'title'>
) => <AccessWarningModal title="Without Authenticator" {...props} />
