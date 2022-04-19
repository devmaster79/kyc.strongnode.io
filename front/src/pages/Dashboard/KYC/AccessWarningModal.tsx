import Button from '@ui/Button/Button'
import Modal, { ModalProps } from '@ui/Modal/Modal'
import { IAnim } from '@ui/utils/useAnimated'

export interface AccessWarningModalProps {
  title: string;
  icon: ModalProps['icon'];
  onClose: () => void;
  onSuccess: () => void;
  anim: IAnim
}

export function AccessWarningModal ({ title, icon, onClose, onSuccess, anim }: AccessWarningModalProps) {
  return (
    <Modal
      anim={anim}
      title={title}
      icon={icon}
      onClose={onClose}
      footer={
        <>
          <Button type='button' variant='medium' color='invert' onClick={onClose}>Cancel</Button>
          <Button type='button' variant='medium' onClick={onSuccess}>Approve</Button>
        </>
      }
    >
      Unauthorized access to your account can occur.<br /> Are you sure you want to disable this?
    </Modal>
  )
}
