import styled from '@emotion/styled'
import Modal from '@ui/Modal/Modal'
import { Outlet } from 'react-router-dom'
import ThemedLogo from '../../components/ThemedLogo'

export default function AuthLayout () {
  return (
    <Modal
      anim={{ delay: 0, state: 'open', destroyKey: '0' }}
      title=''
      closeIconHidden
    >
      <StyledThemedLogo />
      <Outlet />
    </Modal>
  )
}

const StyledThemedLogo = styled(ThemedLogo)`
  margin-top: 50px;
`