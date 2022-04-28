import { PasswordSwitch } from './PasswordSwitch';
import styled from '@emotion/styled';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as userService from 'services/userService';
import * as DashboardForm from '@ui/Dashboard/Form';
import { useEffect } from 'react';
import { AuthenticatorSwitch } from './AuthenticatorSwitch';
import { SMSSwitch } from './SMSSwitch';
import { WalletCarousel } from './WalletCarousel';
import backgroundDark from '../../../assets/images/BG.png';
import backgroundLight from '../../../assets/images/BG-light.png';
import * as ProgressCircleSteps from '@ui/Dashboard/ProgressCircleSteps';
import { Banner } from '../../../@ui/Banner/Banner';

interface FormFields {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  enablePasswordAuth: boolean;
  enableSMSAuth: boolean;
  enableAuthenticatorAuth: boolean;
}

const walletsObject = [
  {
    featureIcon: 0,
    label: 'ADD WALLET',
    description: ''
  },
  {
    featureIcon: 1,
    label: 'WALLET 1',
    description: '(2J33...wM2t)'
  },
  {
    featureIcon: 0,
    label: 'ADD WALLET',
    description: ''
  }
];

export default function KYC() {
  const { register, handleSubmit, reset, control, formState } = useForm<FormFields>({
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      enablePasswordAuth: false,
      enableSMSAuth: false,
      enableAuthenticatorAuth: false
    }
  });

  useEffect(() => {
    userService
      .getProfile()
      .then((result) => {
        const data = result.data[0];
        reset({
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.user_name,
          email: data.email,
          enablePasswordAuth: data.enable_password,
          enableSMSAuth: data.enable_sms,
          enableAuthenticatorAuth: data.enable_authenticator
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await userService.updateProfile({
      first_name: data.firstName,
      last_name: data.lastName,
      user_name: data.username,
      enable_password: data.enablePasswordAuth,
      enable_sms: data.enableSMSAuth,
      enable_authenticator: data.enableAuthenticatorAuth
    });
  };

  return (
    <Container>
      <Banner
        title="StrongNode dVPN coming soon."
        description="Stay tuned for more information."
        soon
      />

      <h1>StrongNode ID and KYC</h1>
      <FormContainer>
        <ProgressCircleSteps.Container>
          <ProgressCircleSteps.Step
            label="user registration"
            progressAmount={60}
            progressLabel="A"
            progressBorder={false}
            disabled={false}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="KYC"
            progressAmount={0}
            progressLabel="B"
            progressBorder={true}
            disabled={false}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="Socials"
            progressAmount={0}
            progressLabel="D"
            progressBorder={true}
            disabled={true}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="Optional"
            progressAmount={35}
            progressLabel="E"
            progressBorder={false}
            disabled={true}
          />
        </ProgressCircleSteps.Container>
        <DashboardForm.Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DashboardForm.InputGroup>
            <DashboardForm.Input
              inputProps={{ placeholder: 'First name', ...register('firstName') }}
            />
            <DashboardForm.Input
              inputProps={{ placeholder: 'Last name', ...register('lastName') }}
            />
            <DashboardForm.Input
              inputProps={{ placeholder: 'Username', ...register('username') }}
            />
            <DashboardForm.Input
              inputProps={{ placeholder: 'Email', ...register('email'), disabled: true }}
            />
          </DashboardForm.InputGroup>
          <DashboardForm.Hr />
          <DashboardForm.ButtonGroup>
            <Controller
              control={control}
              name="enablePasswordAuth"
              render={({ field, fieldState }) => (
                <PasswordSwitch isDirty={fieldState.isDirty} registerProps={field} />
              )}
            />
            <Controller
              control={control}
              name="enableAuthenticatorAuth"
              render={({ field, fieldState }) => (
                <AuthenticatorSwitch isDirty={fieldState.isDirty} registerProps={field} />
              )}
            />
            <Controller
              control={control}
              name="enableSMSAuth"
              render={({ field, fieldState }) => (
                <SMSSwitch isDirty={fieldState.isDirty} registerProps={field} />
              )}
            />
          </DashboardForm.ButtonGroup>
          <DashboardForm.Button
            variant="large"
            disabled={!formState.isDirty || formState.isSubmitting}
          >
            Update
          </DashboardForm.Button>
        </DashboardForm.Form>
      </FormContainer>
      <WalletCarousel walletProps={walletsObject} />
    </Container>
  );
}

export const PasswordSetupModal = () => <div>Settings</div>;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 95px;
  padding-bottom: 70px;
  gap: 32px;
  width: 80%;
  margin: auto;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 65%;
  margin: auto;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
