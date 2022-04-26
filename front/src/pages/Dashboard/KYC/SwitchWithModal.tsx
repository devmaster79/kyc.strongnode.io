import SwitchButton from '@ui/Button/SwitchButton';
import { IAnim, useAnimated } from '@ui/utils/useAnimated';
import { FunctionComponent, ReactNode, useState } from 'react';

export interface ModalProps {
  onSuccess: () => void;
  onClose: () => void;
  anim: IAnim;
}

export type SwitchWithModalProps = {
  TurnOnModal: FunctionComponent<ModalProps>;
  TurnOffModal: FunctionComponent<ModalProps>;
  registerProps: {
    name: string;
    value: boolean;
    onChange: (value: boolean) => void;
  };
  isDirty: boolean;
  helpText?: ReactNode;
  label: string;
};

export const SwitchWithModal = ({
  registerProps,
  TurnOnModal,
  TurnOffModal,
  helpText,
  label,
  isDirty
}: SwitchWithModalProps) => {
  const [showTurnOnModal, setShowTurnOnModal] = useState(false);
  const [showTurnOffModal, setShowTurnOffModal] = useState(false);
  const turnOnModalAnim = useAnimated(showTurnOnModal, 500);
  const turnOffModalAnim = useAnimated(showTurnOffModal, 500);

  const handleChange = (checked: boolean) => {
    const isChange = !isDirty;
    if (isChange) {
      if (checked) {
        setShowTurnOnModal(true);
      } else {
        setShowTurnOffModal(true);
      }
    } else {
      // no modal needed since the user is setting back to the original value
      registerProps.onChange(checked);
    }
  };

  const handleSuccessfulSetup = () => {
    setShowTurnOnModal(false);
    registerProps.onChange(true);
  };

  return (
    <>
      <SwitchButton
        name={registerProps.name}
        checked={registerProps.value}
        onChange={(event) => handleChange(event.target.checked)}
        label={label}
        help={helpText}
      />
      {turnOnModalAnim.state !== 'closed' && (
        <TurnOnModal
          onSuccess={handleSuccessfulSetup}
          onClose={() => {
            setShowTurnOnModal(false);
          }}
          anim={turnOnModalAnim}
        />
      )}
      {turnOffModalAnim.state !== 'closed' && (
        <TurnOffModal
          anim={turnOffModalAnim}
          onClose={() => {
            setShowTurnOffModal(false);
          }}
          onSuccess={() => {
            setShowTurnOffModal(false);
            registerProps.onChange(false);
          }}
        />
      )}
    </>
  );
};
