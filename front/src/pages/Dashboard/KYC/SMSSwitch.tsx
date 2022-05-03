import {
  AccessWarningModal,
  AccessWarningModalProps
} from './AccessWarningModal'
import { SMSSetupModal } from './SMSSetupModal'
import { SwitchWithModal, SwitchWithModalProps } from './SwitchWithModal'

export type SMSSwitchProps = {
  registerProps: SwitchWithModalProps['registerProps']
  isDirty: SwitchWithModalProps['isDirty']
}

export const SMSSwitch = ({ registerProps, isDirty }: SMSSwitchProps) => {
  return (
    <SwitchWithModal
      isDirty={isDirty}
      TurnOnModal={SMSSetupModal}
      TurnOffModal={TurnOffWarning}
      registerProps={registerProps}
      label="SMS"
    />
  )
}

const TurnOffWarning = (
  props: Omit<AccessWarningModalProps, 'icon' | 'title'>
) => <AccessWarningModal title="Without SMS" {...props} />
