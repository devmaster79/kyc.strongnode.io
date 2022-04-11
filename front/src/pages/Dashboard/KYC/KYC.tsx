import styled from '@emotion/styled'
import SwitchButton from '@ui/Button/SwitchButton'
import Modal from '@ui/Modal/Modal'
import { useState } from 'react'

export default function KYC () {
  const [is2fa, setIs2fa] = useState(true)
  const [show2faModal, setShow2faModal] = useState(false)

  const [isSMS, setIsSMS] = useState(true)
  const [showSMSModal, setShowSMSModal] = useState(false)

  const handle2faChange = () => {
    if (is2fa) {
      setShow2faModal(true)
      return
    }
    setIs2fa(true)
  }

  const handleSMSChange = () => {
    if (isSMS) {
      setShowSMSModal(true)
      return
    }
    setIsSMS(true)
  }

  return (
    <KYCWrapper>
      <h1>StrongNode ID and KYC</h1>

      <SwitchWrapper>
        <SwitchButton id='2fa' label='2FA' checked={is2fa} onChange={handle2faChange} />
        <SwitchButton id='sms' label='SMS' checked={isSMS} onChange={handleSMSChange} />
      </SwitchWrapper>

      {show2faModal &&
        <Modal title='Without 2FA' icon='lock' onClose={() => setShow2faModal(false)} onApprove={() => { setIs2fa(false); setShow2faModal(false) }}>
          Unauthorized access to your account can occur.<br /> Are you sure you want to disable this?
        </Modal>}
      {showSMSModal &&
        <Modal title='Without SMS' icon='sms' onClose={() => setShowSMSModal(false)} onApprove={() => { setIsSMS(false); setShowSMSModal(false) }}>
          Unauthorized access to your account can occur.<br /> Are you sure you want to disable this?
        </Modal>}
    </KYCWrapper>
  )
}

const KYCWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
`

const SwitchWrapper = styled.div`
  display: flex;
`
