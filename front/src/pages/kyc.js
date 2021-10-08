import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import { ReactComponent as CheckIcon } from "../icons/check.svg";
import { NavigateBefore } from "@material-ui/icons";

const P = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #210e43;
  margin-bottom: 20px;
  text-align: center;
`;

function KYC() {
  const navigate = useNavigate();

  const loadBlockpassWidget = async (event) => {
    const blockpass =  new window.BlockpassKYCConnect('strongnode_596cc',
      {
        env: 'prod',
        refId: '1632811259976',
      })

    blockpass.startKYCConnect()
    blockpass.on('KYCConnectSuccess', () => {
      //add code that will trigger when data have been sent
      navigate("/dashboard");
    })

    blockpass.on('KYCConnectClose', () =>{
      //add code that will trigger when the workflow is finished. ex:
      //alert('Finished!')
      navigate("/dashboard");
    })

    blockpass.on('KYCConnectCancel', () => {
      //add code that will trigger when the workflow is aborted. ex:
      //alert('Cancelled!')
      navigate("/dashboard");
    })
  }

  useEffect(() => {
    loadBlockpassWidget()
  }, [])

  return (
    <EntryPage>
      <EntryCard>
        <Button id="blockpass-kyc-connect" full>
          Verify with Blockpass
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default KYC;
