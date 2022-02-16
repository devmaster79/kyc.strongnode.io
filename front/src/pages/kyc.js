import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntryPage } from './style';
import EntryCard from '../components/EntryCard';
import Button from '../components/Button';

function KYC() {
  const navigate = useNavigate();

  const loadBlockpassWidget = async () => {
    const blockpass = new window.BlockpassKYCConnect('strongnode_596cc', {
      env: 'prod',
      refId: '1632811259976'
    });

    blockpass.startKYCConnect();
    blockpass.on('KYCConnectSuccess', () => {
      //add code that will trigger when data have been sent
      navigate('/dashboard');
    });

    blockpass.on('KYCConnectClose', () => {
      //add code that will trigger when the workflow is finished. ex:
      //alert('Finished!')
      navigate('/dashboard');
    });

    blockpass.on('KYCConnectCancel', () => {
      //add code that will trigger when the workflow is aborted. ex:
      //alert('Cancelled!')
      navigate('/dashboard');
    });
  };

  useEffect(() => {
    loadBlockpassWidget();
  }, []);

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
