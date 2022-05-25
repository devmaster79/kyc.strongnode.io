import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import InputGroup from '../components/InputGroup'
import Line from '../components/Line'
import Input from '../components/Input'
import Button from '../components/Button'
import { EntryPage } from './style'
import * as userService from '../services/userService'
import { ReactComponent as MagicImg } from '../assets/images/magic.svg'
import EntryCard from '../components/EntryCard'
import Media from './../theme/mediaQueries'

export const Wrapper = styled.div({
  width: '100%',
  maxWidth: '909px',
  padding: '50px 40px 40px 40px',
  marginBottom: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid #1df4f6',
  boxSizing: 'border-box',
  boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(10px)',
  borderRadius: '5px',
  h2: {
    marginBottom: '10px',
    color: 'white'
  },
  p: {
    marginTop: '20px',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '30px',
    color: 'white'
  },
  h5: {
    marginBottom: '5px',
    color: 'white',
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '500'
  }
})

const P = styled.p({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '26px',
  color: 'white',
  marginBottom: '20px',
  textAlign: 'center',
  paddingLeft: '32px',
  paddingRight: '32px'
})

const InputRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap'
})

const InputCol = styled.div({
  width: '48%',
  span: {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#584a72'
  },
  [Media.phone]: {
    width: '100%'
  }
})

const SubmitButtonWrapper = styled.div({
  marginTop: '10px',
  textAlign: 'right',
  '> button': {
    width: 'calc(50% - 16px)'
  }
})

function PrivateSaleInterestForm() {
  const navigate = useNavigate()

  const [investorName, setInvestorName] = useState('')
  const [formSubmitted, setFormSubmitted] = useState('')
  const [investorTelegramId, setInvestorTelegramId] = useState('')
  const [investorCountry, setInvestorCountry] = useState('')
  const [investorCommitmentAmount, setInvestorCommitmentAmount] = useState('')
  const [investorWalletAddress, setInvestorWalletAddress] = useState('')
  const [investorEmail, setInvestorEmail] = useState('')
  const [investorFundName, setInvestorFundName] = useState('')
  const [investorFundWebsite, setInvestorFundWebsite] = useState('')

  const handleInvestorNameInputChange = (event) => {
    setInvestorName(event.target.value)
  }

  const handleInvestorTelegramIdInputChange = (event) => {
    setInvestorTelegramId(event.target.value)
  }

  const handleInvestorCountryInputChange = (event) => {
    setInvestorCountry(event.target.value)
  }

  const handleInvestorCommitmentAmountInputChange = (event) => {
    setInvestorCommitmentAmount(event.target.value)
  }

  const handleInvestorWalletAddressInputChange = (event) => {
    setInvestorWalletAddress(event.target.value)
  }

  const handleInvestorEmailInputChange = (event) => {
    setInvestorEmail(event.target.value)
  }

  const handleInvestorFundNameInputChange = (event) => {
    setInvestorFundName(event.target.value)
  }

  const handleInvestorFundWebsiteInputChange = (event) => {
    setInvestorFundWebsite(event.target.value)
  }

  const handleCreateInvestor = useCallback(async (data) => {
    try {
      const res = await userService.createInvestor(data)
      if (res.data) {
        if (res.data.status === 'created') setFormSubmitted(1)
        else {
          alert('this is TEMP error')
          console.error(res.data)
        }
      }
    } catch (err) {
      console.error('Error for create password', err)
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      investor_name: investorName,
      investor_telegram_id: investorTelegramId,
      investor_country: investorCountry,
      investor_commitment_amount: investorCommitmentAmount,
      investor_wallet_address: investorWalletAddress,
      investor_email: investorEmail,
      investor_fund_name: investorFundName,
      investor_fund_website: investorFundWebsite
    }
    handleCreateInvestor(data)
  }

  return (
    <EntryPage>
      {formSubmitted && (
        <EntryCard>
          <MagicImg />
          <h2 style={{ marginTop: 25, marginBottom: 20 }}>Form submitted!</h2>
          <P>
            We&apos;ve sent a magic login link. Please check your email to login
            to StrongNodeID.
          </P>
          <Button style={{ width: '30%' }} full onClick={() => navigate('/')}>
            OK
          </Button>
        </EntryCard>
      )}

      {!formSubmitted && (
        <Wrapper>
          <h2 style={{ fontFamily: 'Halyard' }}>
            StrongNode Private Sale Interest Form
          </h2>
          <p>
            This form is for investors interested in participating in the
            private sale round for the StrongNode token. Your responses will be
            kept private and will not be distributed without prior consent.
          </p>
          <p>
            A representative from StrongNode will reach out to you after your
            submittion is reviewed. KYC will be required for all StrongNode
            private sale participants.
          </p>

          <Line full />
          <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
            <InputRow>
              <InputCol>
                <InputGroup>
                  <h5>Name *</h5>
                  <Input
                    type="text"
                    placeholder="Name"
                    id="name"
                    value={investorName}
                    onChange={handleInvestorNameInputChange}
                  />
                </InputGroup>
              </InputCol>

              <InputCol>
                <InputGroup>
                  <h5>Telegram Handle(@username)</h5>
                  <Input
                    type="text"
                    placeholder="@username"
                    id="telegram"
                    value={investorTelegramId}
                    onChange={handleInvestorTelegramIdInputChange}
                  />
                </InputGroup>
              </InputCol>
            </InputRow>

            <InputRow>
              <InputCol>
                <InputGroup>
                  <h5>Country of Residence*</h5>
                  <Input
                    type="text"
                    placeholder="USA"
                    id="country"
                    value={investorCountry}
                    onChange={handleInvestorCountryInputChange}
                  />
                </InputGroup>
              </InputCol>

              <InputCol>
                <InputGroup>
                  <h5>Commitment amount (Minimum $500) *</h5>
                  <Input
                    type="text"
                    placeholder="500"
                    id="amount"
                    value={investorCommitmentAmount}
                    onChange={handleInvestorCommitmentAmountInputChange}
                  />
                </InputGroup>
              </InputCol>
            </InputRow>

            <InputRow>
              <InputCol>
                <InputGroup>
                  <h5>Wallet address</h5>
                  <Input
                    type="text"
                    placeholder="Wallet address"
                    id="wallet-address"
                    value={investorWalletAddress}
                    onChange={handleInvestorWalletAddressInputChange}
                  />
                </InputGroup>
              </InputCol>

              <InputCol>
                <InputGroup>
                  <h5>Email *</h5>
                  <Input
                    type="text"
                    placeholder="Email address"
                    id="email"
                    value={investorEmail}
                    onChange={handleInvestorEmailInputChange}
                  />
                </InputGroup>
              </InputCol>
            </InputRow>

            <InputRow>
              <InputCol>
                <InputGroup>
                  <h5>Fund name</h5>
                  <Input
                    type="text"
                    placeholder="Fund name"
                    id="fund-name"
                    value={investorFundName}
                    onChange={handleInvestorFundNameInputChange}
                  />
                </InputGroup>
              </InputCol>

              <InputCol>
                <InputGroup>
                  <h5>Fund website(if applicable)</h5>
                  <Input
                    type="text"
                    placeholder="https://www.google.com"
                    id="fund-website"
                    value={investorFundWebsite}
                    onChange={handleInvestorFundWebsiteInputChange}
                  />
                </InputGroup>
              </InputCol>
            </InputRow>
            <SubmitButtonWrapper>
              <Button type="submit">Submit</Button>
            </SubmitButtonWrapper>
          </form>
        </Wrapper>
      )}
    </EntryPage>
  )
}

export default PrivateSaleInterestForm
