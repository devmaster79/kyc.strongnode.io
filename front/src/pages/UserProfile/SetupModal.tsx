import React from 'react'
import { Backdrop, Box, Modal, styled } from '@mui/material'

interface SetupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  Component: React.FunctionComponent<{ onSuccess: () => void }>;
}

export function SetupModal ({ open, onClose, onSuccess, Component }: SetupModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <ModalContainer>
        <Component onSuccess={() => {
          onSuccess()
          onClose()
        }}
        />
      </ModalContainer>
    </Modal>
  )
}

const ModalContainer = styled(Box)((props) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  background: props.theme.palette.background.paper,
  transform: 'translate(-50%, -50%)',
  width: '400',
  border: '2px solid #964CFA',
  borderRadius: '16px',
  padding: 32,
  sx: {
    boxShadow: 24
  }
}))
