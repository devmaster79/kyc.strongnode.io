import { AccessWarningModal, AccessWarningModalProps } from './AccessWarningModal';
import { PasswordSetupModal } from './PasswordSetupModal';
import { SwitchWithModal, SwitchWithModalProps } from './SwitchWithModal';

export type PasswordSwitchProps = {
  registerProps: SwitchWithModalProps['registerProps'];
  isDirty: SwitchWithModalProps['isDirty'];
};

export const PasswordSwitch = ({ registerProps, isDirty }: PasswordSwitchProps) => {
  return (
    <SwitchWithModal
      isDirty={isDirty}
      TurnOnModal={PasswordSetupModal}
      TurnOffModal={TurnOffWarning}
      registerProps={registerProps}
      label="Password"
    />
  );
};

const TurnOffWarning = (props: Omit<AccessWarningModalProps, 'icon' | 'title'>) => (
  <AccessWarningModal title="Without password" {...props} />
);
