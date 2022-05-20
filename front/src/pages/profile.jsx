import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import EntryCard from '../components/EntryCard'
import InputGroup from '../components/InputGroup'
import Input from '../components/Input'
import Button from '../components/Button'
import { ReactComponent as TelegramIcon } from '../icons/telegram.svg'
import { ReactComponent as TwitterIcon } from '../icons/twitter.svg'
import { EntryPage } from './style'
import userService from '../services/userService'

const ProgressBarWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  jusity-content: flex-start;
  text-align: left;
  p {
    margin-top: 30px;
    font-style: medium;
    font-size: 14px;
    line-height: 18px;
    color: white;
  }
  progress {
    background: rgba(238, 238, 238, 0.0001);
    border: 2px solid #1df4f6;
    box-sizing: border-box;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 50.5px;
    height: 20px;
    margin-top: 20px;
    width: 100%;
    &::-webkit-progress-value {
      background: rgba(29, 244, 246, 0.51);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 50.5px;
    }
    &[value]::-webkit-progress-bar {
      background: transparent;
    }
  }
`

const InputWrapper = styled.div`
  text-align: left;
  p {
    margin-bottom: 3px;
    color: white;
    font-size: 12px;
  }
`

function Profile() {
  const navigate = useNavigate()

  const [telegramUserName, setTelegramUserName] = useState('')
  const [twitterUserName, setTwitterUserName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const handleCreateProfile = useCallback(
    async (data) => {
      try {
        const res = await userService.createProfile(data)
        if (res.data) {
          navigate('/private-sale-interest-form')
        }
      } catch (err) {
        console.error('Error for create password', err)
      }
    },
    [navigate]
  )

  const handleTGUserNameInputChange = (event) => {
    setTelegramUserName(event.target.value)
  }

  const handleTwitterUserNameInputChange = (event) => {
    setTwitterUserName(event.target.value)
  }

  const handleWalletAddressInputChange = (event) => {
    setWalletAddress(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = {
      telegram_id: telegramUserName,
      twitter_id: twitterUserName,
      wallet_address: walletAddress
    }
    handleCreateProfile(data)
  }

  return (
    <EntryPage>
      <EntryCard>
        <h2 style={{ fontFamily: 'Halyard' }}>Profile</h2>
        <ProgressBarWrapper>
          <p>10/100% Complete</p>
          <progress value="10" max="100" />
        </ProgressBarWrapper>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputWrapper>
            <p>Telegram</p>
            <InputGroup>
              <TelegramIcon />
              <Input
                type="text"
                placeholder="@username"
                id="telegram-username"
                style={{ padding: '16px 20px 16px 50px' }}
                value={telegramUserName}
                onChange={handleTGUserNameInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <InputWrapper>
            <p>Twitter</p>
            <InputGroup>
              <TwitterIcon />
              <Input
                type="text"
                placeholder="@username"
                id="twitter-username"
                style={{ padding: '16px 20px 16px 50px' }}
                value={twitterUserName}
                onChange={handleTwitterUserNameInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <InputWrapper>
            <p>Wallet address</p>
            <InputGroup>
              <Input
                type="text"
                placeholder="Wallet ID"
                id="wallet-id"
                value={walletAddress}
                onChange={handleWalletAddressInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <Button type="submit" full>
            NEXT
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  )
}

export default Profile
