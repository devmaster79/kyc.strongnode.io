import { useState, useEffect, useCallback } from 'react';
import TextButton from '../../../@ui/Button/TextButton'
import { AccountPopoverWrapper, IconWrapper} from './style';
import ConnectButton, { SneBalance } from 'components/ConnectButton';
import { useNavigate } from 'react-router-dom';
import userService from 'services/userService';
import * as authService from 'services/auth';
import { ReactComponent as ArrowDown} from '../../../icons/arrow-down.svg'
import { ReactComponent as ArrowUp} from '../../../icons/arrow-up.svg'
import { ReactComponent as AvatarIcon } from '../../../icons/avatar.svg'

export default function AccountPopover() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem('email') || '');
    userService.getProfile().then((r) => {
      setUserName(r.data[0].first_name + " " + r.data[0].last_name)
      setAvatar(r.data[0].profile_img_url || '');
    });
  }, []);

  const signOut = () => {
    authService.signOut();
    navigate('/verify-email');
  };

  return (
    <>
      <IconWrapper>
        { showModal ? <ArrowUp /> : <ArrowDown />}
        <AvatarIcon  onClick={() => setShowModal(!showModal)} />
      </IconWrapper>
      { showModal &&
        <AccountPopoverWrapper>
          {userName}
          <span>{email}</span>
          <ConnectButton />
          <ul>
            <li>SNE balance</li>
            <li onClick={() => navigate('/dashboard/profile')}>My Account</li>
          </ul>
          <TextButton onClick={signOut}>Sign out</TextButton>
        </AccountPopoverWrapper>
      }
    </>);
}
