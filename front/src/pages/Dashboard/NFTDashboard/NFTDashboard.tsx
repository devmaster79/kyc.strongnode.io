import { useState, useEffect, useCallback } from 'react';
import TextButton from '../../../@ui/Button/TextButton'
import ConnectButton, { SneBalance } from 'components/ConnectButton';
import { useNavigate } from 'react-router-dom';
import userService from 'services/userService';
import * as authService from 'services/auth';
import { ReactComponent as ArrowDown} from '../../../icons/arrow-down.svg'
import { ReactComponent as ArrowUp} from '../../../icons/arrow-up.svg'
import { ReactComponent as AvatarIcon } from '../../../icons/avatar.svg'
import NFTCard from './NFTCard/NFTCard';
import styled from '@emotion/styled'

const CardWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
`
export default function NFTDashboard() {
  var cards = ['1', '2', '3', '4', '5','6','7'];

  return (
    <>
      <h1>NFT Dashboard</h1>
      <CardWrapper>
      {cards.map((card) => (
        <NFTCard key={card}/>
      ))}
      </CardWrapper>
    </>);
}
