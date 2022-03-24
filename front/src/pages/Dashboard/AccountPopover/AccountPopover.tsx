import { useState, useEffect, useCallback } from 'react';
import TextButton from '../../../@ui/Button/TextButton';
import {
  AccountPopoverWrapper,
  IconWrapper,
  AvatarIconWrapper,
  AvatarIcon,
  AvatarArrow
} from './style';
import ConnectButton, { SneBalance } from 'components/ConnectButton';
import { useNavigate } from 'react-router-dom';
import userService from 'services/userService';
import * as authService from 'services/auth';
import { ReactComponent as ArrowDown } from '../../../icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../icons/arrow-up.svg';

export default function AccountPopover() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem('email') || '');
    userService.getProfile().then((r) => {
      setUserName(r.data[0].first_name + ' ' + r.data[0].last_name);
      setAvatar(r.data[0].profile_img_url || '');
    });
  }, []);

  const signOut = () => {
    authService.signOut();
    navigate('/verify-email');
  };

  return (
    <>
      <IconWrapper onClick={() => setShowModal(!showModal)}>
        <AvatarArrow style={showModal ? { transform: 'rotate(180deg)' } : {}}>
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.83205 4.75192C4.43623 5.34566 3.56377 5.34566 3.16795 4.75192L1.03647 1.5547C0.59343 0.890144 1.06982 -6.05855e-07 1.86852 -5.36031e-07L6.13148 -1.63351e-07C6.93018 -9.35268e-08 7.40657 0.890145 6.96353 1.5547L4.83205 4.75192Z"
              fill="white"
            />
          </svg>
        </AvatarArrow>

        <AvatarIconWrapper>
          <AvatarIcon>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.0001 0C8.02228 0 6.08888 0.58649 4.44439 1.6853C2.7999 2.78412 1.51818 4.3459 0.761301 6.17317C0.00442441 8.00043 -0.193609 10.0111 0.192243 11.9509C0.578095 13.8907 1.5305 15.6725 2.92903 17.0711C4.32755 18.4696 6.10938 19.422 8.04919 19.8079C9.989 20.1937 11.9997 19.9957 13.8269 19.2388C15.6542 18.4819 17.216 17.2002 18.3148 15.5557C19.4136 13.9112 20.0001 11.9778 20.0001 10C20.0001 7.34784 18.9465 4.8043 17.0712 2.92893C15.1958 1.05357 12.6523 0 10.0001 0V0ZM6.2501 10C6.00287 10 5.76119 9.92669 5.55563 9.78934C5.35007 9.65199 5.18986 9.45676 5.09525 9.22835C5.00064 8.99995 4.97588 8.74861 5.02411 8.50614C5.07235 8.26366 5.1914 8.04093 5.36621 7.86612C5.54103 7.6913 5.76376 7.57225 6.00623 7.52402C6.24871 7.47579 6.50004 7.50054 6.72845 7.59515C6.95686 7.68976 7.15208 7.84998 7.28943 8.05554C7.42678 8.2611 7.5001 8.50277 7.5001 8.75C7.5001 9.08152 7.3684 9.39946 7.13398 9.63388C6.89956 9.8683 6.58162 10 6.2501 10ZM13.7501 10C13.5029 10 13.2612 9.92669 13.0556 9.78934C12.8501 9.65199 12.6899 9.45676 12.5952 9.22835C12.5006 8.99995 12.4759 8.74861 12.5241 8.50614C12.5723 8.26366 12.6914 8.04093 12.8662 7.86612C13.041 7.6913 13.2638 7.57225 13.5062 7.52402C13.7487 7.47579 14 7.50054 14.2284 7.59515C14.4569 7.68976 14.6521 7.84998 14.7894 8.05554C14.9268 8.2611 15.0001 8.50277 15.0001 8.75C15.0001 9.08152 14.8684 9.39946 14.634 9.63388C14.3996 9.8683 14.0816 10 13.7501 10Z"
                fill="white"
              />
            </svg>
          </AvatarIcon>
        </AvatarIconWrapper>
      </IconWrapper>
      {showModal && (
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
      )}
    </>
  );
}
