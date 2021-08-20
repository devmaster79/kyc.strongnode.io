import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import InputGroup from "../components/InputGroup";
import Line from "../components/Line";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navar";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #f3f3f5;
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 909px;
  background-color: #ffffff;
  padding: 50px 40px 40px 40px;
  margin-bottom: 120px;
  display: flex;
  flex-direction: column;
  justify-contents: space-between;
  border: 1px solid transparent;
  border-radius: 12px;
  h2 {
    margin-bottom: 10px;
  }
  p {
    margin-top: 20px;
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    line-height: 30px;
    color: #584a72;
  }
  h5 {
    margin-bottom: 12px;
    color: #584a72;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
  }
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const InputCol = styled.div`
  width: 48%;
  span {
    font-size: 14px;
    margin-bottom: 8px;
    color: #584a72;
  }
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const SubmitButtonWrapper = styled.div`
  margin-top: 10px;
  text-align: right;
`;

function PrivateSaleInterestForm() {
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/signup");
  };

  return (
    <Container>
      <Navbar privatesale />
      <Wrapper>
        <h2>StongNode Private Sale Interest Form</h2>

        <p>
          This form is for investors interested in participating in the private
          sale round for the StrongNode token. Your responses will be kept
          private and will not be distributed without prior consent.
        </p>
        <p>
          A representative from StrongNode will reach out to you after your
          submission is reviewed. KYC will be required for all StrongNood
          private sale participants.
        </p>

        <Line full />
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputRow>
            <InputCol>
              <InputGroup>
                <h5>Name *</h5>
                <Input type="text" placeholder="Name" id="name" />
              </InputGroup>
            </InputCol>

            <InputCol>
              <InputGroup>
                <h5>Telegram Handle(@username) *</h5>
                <Input type="text" placeholder="@username" id="telegram" />
              </InputGroup>
            </InputCol>
          </InputRow>

          <InputRow>
            <InputCol>
              <InputGroup>
                <h5>Country of Residence*</h5>
                <Input type="text" placeholder="USA" id="country" />
              </InputGroup>
            </InputCol>

            <InputCol>
              <InputGroup>
                <h5>Commitment amount (Minimum $500) *</h5>
                <Input type="text" placeholder="500" id="amount" />
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
                />
              </InputGroup>
            </InputCol>

            <InputCol>
              <InputGroup>
                <h5>Email *</h5>
                <Input type="text" placeholder="Email address" id="email" />
              </InputGroup>
            </InputCol>
          </InputRow>

          <InputRow>
            <InputCol>
              <InputGroup>
                <h5>Fund name</h5>
                <Input type="text" placeholder="Fund name" id="fund-name" />
              </InputGroup>
            </InputCol>

            <InputCol>
              <InputGroup>
                <h5>Fund website(if applicable)</h5>
                <Input
                  type="text"
                  placeholder="https://www.google.com"
                  id="fund-website"
                />
              </InputGroup>
            </InputCol>
          </InputRow>
          <SubmitButtonWrapper>
            <Button type="submit">Submit</Button>
          </SubmitButtonWrapper>
        </form>
      </Wrapper>
    </Container>
  );
}

export default PrivateSaleInterestForm;
