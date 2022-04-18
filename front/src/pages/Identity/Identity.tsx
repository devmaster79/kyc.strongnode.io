import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Icon from '@ui/Icon/Icon'
import Modal from '@ui/Modal/Modal'
import { useAnimated } from '@ui/utils/useAnimated'
import { useState } from 'react'
import IdentityUpload from './IdentityUpload/IdentityUpload'

export default function Identity () {
  const [showModal, setShowModal] = useState(true)

  const [showPassportModal, setShowPassportModal] = useState(false)
  const [showNationalIDModal, setShowNationalIDModal] = useState(false)
  const [showDrivingLicenseModal, setShowDrivingLicenseModal] = useState(false)

  const showModalAnim = useAnimated(showModal, 500)
  const showPassportModalAnim = useAnimated(showPassportModal, 500)
  const showNationalIDModalAnim = useAnimated(showNationalIDModal, 500)
  const showDrivingLicenseModalAnim = useAnimated(showDrivingLicenseModal, 500)

  return (
    <>
      <Modal anim={showModalAnim} icon='identity' onClose={() => { /* TODO */ }} footer={<></>}>
        <IdentityWrapper>
          <h1>
            Strongnode
            <span>Web Identity</span>
          </h1>
          Register options
          <Button variant='xl' onClick={() => setShowPassportModal(true)} justify='space-between'>
            Passport <Icon name='passport' width={24} height={24} viewBox='0 0 24 24' />
          </Button>
          <Button variant='xl' onClick={() => { setShowNationalIDModal(true) }} justify='space-between'>
            National ID <Icon name='nationalID' width={24} height={24} viewBox='0 0 24 24' />
          </Button>
          <Button variant='xl' onClick={() => { setShowDrivingLicenseModal(true) }} justify='space-between'>
            Driving licence <Icon name='drivingLicense' width={24} height={24} viewBox='0 0 24 24' />
          </Button>
          <p>
            See the list of <a href='#'>supported documents</a>
          </p>
        </IdentityWrapper>
      </Modal>
      <Modal
        anim={showPassportModalAnim}
        title='Passport' icon='identityPassport' onClose={() => setShowPassportModal(false)}
        footer={
          <>
            <Button type='button' variant='large'>Continue</Button>
          </>
        }
      >
        <IdentityUpload
          icon='passportFront' description='Take picture of your national ID.
          Avoid glare and make sure all 4 corners are visible. Take a picture of both sides.' onSelectFile={() => {/* TODO */}}
        />
        <Separator />
        <IdentityUpload icon='passportHold' description='Take a picture of you holding your passport near your face so we can verify your identity.' onSelectFile={() => { /* TODO */ }} />
        <Separator />
      </Modal>

      <Modal
        anim={showNationalIDModalAnim}
        title='National ID' icon='identityNationalID' onClose={() => setShowNationalIDModal(false)}
        footer={
          <>
            <Button type='button' variant='large'>Continue</Button>
          </>
        }
      >
        <IdentityUpload icon='nationalIdFront' description='Take picture of your national ID. Avoid glare and make sure all 4 corners are visible. Take a picture of both sides.' onSelectFile={() => { /* TODO */ }} />
        <Separator />
        <IdentityUpload icon='nationalIdBack' description='Back side of your national ID' onSelectFile={() => { /* TODO */ }} />
        <Separator />
      </Modal>

      <Modal
        anim={showDrivingLicenseModalAnim}
        title='Driving licence' icon='identityDrivingLicense' onClose={() => setShowDrivingLicenseModal(false)}
        footer={
          <>
            <Button type='button' variant='large'>Continue</Button>
          </>
        }
      >
        <IdentityUpload icon='drivingLicenseFront' description='Take picture of your Driving license. Avoid glare and make sure all 4 corners are visible. Take a picture of both sides.' onSelectFile={() => { /* TODO */ }} />
        <Separator />
        <IdentityUpload icon='nationalIdBack' description='Back side of your Driving licence' onSelectFile={() => { /* TODO */ }} />
        <Separator />
      </Modal>
    </>
  )
}

const IdentityWrapper = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 32px;
    padding-bottom: 32px;

    span {
      font-family: 'Satoshi-Regular';
      font-weight: 300;
      display: block;
      padding-top: 15px;
    }
  }
  p {
    text-align: left;
    padding: 15px;

    a {
      color: ${props => props.theme.palette.text.secondary};
      text-decoration: underline;
    }
  }
`

const Separator = styled.hr`
  width: 354px;
  border: 1px solid ${props => props.theme.palette.border.light};
  margin: 32px 0;
`
