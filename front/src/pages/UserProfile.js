import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import styled from '@material-ui/core/styles/styled';
import { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import UploadSingleFile from 'components/UploadSingleFile';
import InputGroup from '../components/InputGroup';
import { ReactComponent as LockIcon } from '../icons/lock.svg';
import PhoneInput from 'react-phone-number-input';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ethereum_address from 'ethereum-address-es5';
import userService from '../services/userService';
import * as authService from 'services/auth';

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)',
  border: '5px solid #964CFA',
  boxSizing: 'border-box',
  borderRadius: '16px',
  padding: theme.spacing(4),
  width: '90%',
  margin: 'auto'
}));
const SBPhoneInput = styled(PhoneInput)`
  > input {
    width: '90%';
  }
`;
const mfastyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const SBGrid = styled(Grid)`
  padding-left: 0 !important;
`;
const MyStack = styled(Stack)`
  @media (max-width: 1024px) {
    margin-left: 0 !important;
  }
`;
export default function Dashboard() {
  const navigate = useNavigate();
  const [openMfa, setOpenMfa] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showError, setShowError] = useState(false);
  const [totp, setTOTP] = useState('');
  const [qrURL, setQRURL] = useState('');
  const [opensms, setOpensms] = useState(false);
  const [showSMSError, setSMSshowError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [cdisable, setCdisable] = useState(true);
  const [value, setValue] = useState('');
  const [btnLabel, setBtnLabel] = useState('Send');
  const [smscode, setSmscode] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Fetch value from local storage
  const token = localStorage.getItem('token');

  const handleOpenMfa = () => setOpenMfa(true);
  const handleCloseMfa = () => {
    setOpenMfa(false);
    setTOTP('');
    setShowError(false);
  };

  const handleOpensms = () => setOpensms(true);
  const handleClosesms = () => {
    setOpensms(false);
    setSmscode('');
    setSMSshowError(false);
  };

  const handleTOTPInputChange = (event) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6);
      setTOTP(event.target.value);
    } else {
      setTOTP(event.target.value);
    }
  };

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    user_name: Yup.string().required('User Name is required')
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      user_name: '',
      telegram_id: '',
      twitter_id: '',
      email: '',
      wallet_address: '',
      KYC_Completed: 'level1',
      enable_qr: null,
      enable_sms: null,
      MFA: null,
      cover: '',
      file: ''
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const { first_name, last_name, user_name, email, wallet_address, telegram_id, twitter_id } =
          values;

        const data = {
          email,
          first_name,
          last_name,
          user_name,
          wallet_address,
          telegram_id,
          twitter_id
        };

        userService.updateProfile(data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar('User updated successfully1', {
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Failed to update profile2', { variant: 'fail' });
          }
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const doMFA = () => {
    if (values.enable_qr === true) {
      setFieldValue('enable_qr', !values.enable_qr);
    } else {
      handleOpenMfa();
    }
  };

  const checkMFACode = () => {
    authService.enableQRAuth(totp).then((r) => {
      if (r.result === 'success') {
        setFieldValue('enable_qr', true);
        enqueueSnackbar('User updated successfully1', {
          variant: 'success'
        });
        handleCloseMfa();
      } else {
        setShowError(true);
      }
    });
  };

  const doSMS = () => {
    if (values.enable_sms === true) {
      setFieldValue('enable_sms', !values.enable_sms);
    } else {
      handleOpensms();
    }
  };

  const check2faCode = () => {
    authService.enableSMSAuth(smscode).then((r) => {
      if (r.result === 'success') {
        setFieldValue('enable_sms', true);
        enqueueSnackbar('User updated successfully!', {
          variant: 'success'
        });
        handleClosesms();
      } else {
        setSMSshowError(true);
      }
    });
  };

  const sendMessage = () => {
    let count = 30;
    setDisabled(true);
    setSMSshowError(false);
    authService.sendSMSAndSaveNumber(value.substring(1));
    const counter = setInterval(() => {
      setBtnLabel(`${count}s`);
      count--;
      if (count === -1) {
        clearInterval(counter);
        setBtnLabel('Send');
        setDisabled(false);
      }
    }, 1000);
  };

  const handle2FA = (val) => {
    if (val.length > 4) {
      val = val.slice(0, 4);
      setSmscode(val);
    } else {
      setSmscode(val);
    }

    if (val) setCdisable(false);
    else setCdisable(true);
    setShowError(false);
  };

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
    async function fetch() {
      const result = await userService.getProfile();

      if (!result.data[0].enable_qr || result.data[0].enable_qr == null) {
        setShowQR(true);
        authService.generateQRCode().then((res) => {
          setQRURL(res.qrcode);
        });
      }

      formik.setValues(result.data[0]);
    }
    if (value !== '') setDisabled(false);
    if (!value) setDisabled(true);
    fetch();
    loadBlockpassWidget();
  }, [value]);

  const { values, errors, touched, getFieldProps, setFieldValue } = formik;

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = '';
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      getBase64(file).then((result) => setFieldValue('cover', result));
      if (file) {
        setFieldValue('file', file);
      }
    },
    [setFieldValue]
  );
  const upload = () => {
    userService
      .uploadProfileImage(values.email, values.user_name, values.cover)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar('Uploaded successfully!', {
            variant: 'success'
          });
          window.location.reload();
        } else {
          enqueueSnackbar('Failed to upload!', { variant: 'fail' });
        }
      })
      .catch((err) => {
        if (err.request) {
          console.error(err.request);
        }
        if (err.response) {
          console.error(err.response);
        }
      });
  };

  const levels = ['level1', 'level2', 'level3'];

  return (
    <Container maxWidth="xl">
      <CardStyle>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Stack
              direction="row"
              spacing={4}
              alignItems="flex-start"
              sx={{
                display: { xs: 'flex' },
                justifyContent: { xs: 'space-evenly' },
                flexWrap: { xs: 'wrap', md: 'nowrap' }
              }}>
              <Stack spacing={5} sx={{ width: '200px', mb: { xs: 5, md: 0 } }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    height: 200,
                    borderRadius: 1,
                    mt: 5
                  }}>
                  <UploadSingleFile
                    maxSize={31457280}
                    accept="image/*"
                    file={
                      values.cover && {
                        preview: URL.createObjectURL(values.file)
                      }
                    }
                    onDrop={(e) => handleDrop(e, 1)}
                    error={Boolean(touched.cover && errors.cover)}
                    sx={{ height: 200 }}
                  />
                </Box>
                <Button onClick={upload} sx={{ mb: 5 }} variant="contained">
                  Upload
                </Button>
                <Button sx={{ mb: 5 }} id="blockpass-kyc-connect" variant="contained">
                  Register KYC
                </Button>
                <TextField
                  id="outlined-select-currency"
                  select
                  placeholder="KYC Completed"
                  disabled
                  SelectProps={{ value: formik.values.KYC_Completed }}
                  sx={{ flexGrow: 1, width: '100%' }}
                  {...getFieldProps('KYC_Completed')}>
                  {levels.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <MyStack spacing={3} sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" flexGrow="1" spacing={3}>
                  <TextField
                    id="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    placeholder="First Name"
                    {...getFieldProps('first_name')}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    id="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    fullWidth
                    placeholder="Last Name"
                    {...getFieldProps('last_name')}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Stack>
                <TextField
                  fullWidth
                  placeholder="User Name"
                  {...getFieldProps('user_name')}
                  error={Boolean(touched.user_name && errors.user_name)}
                  helperText={touched.user_name && errors.user_name}
                />
                <TextField
                  fullWidth
                  placeholder="Email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  disabled
                />
                <TextField
                  fullWidth
                  placeholder="Telegram"
                  {...getFieldProps('telegram_id')}
                  error={Boolean(touched.telegram_id && errors.telegram_id)}
                  helperText={touched.telegram_id && errors.telegram_id}
                />
                <TextField
                  fullWidth
                  placeholder="Twitter"
                  {...getFieldProps('twitter_id')}
                  error={Boolean(touched.twitter_id && errors.twitter_id)}
                  helperText={touched.twitter_id && errors.twitter_id}
                />
                <TextField
                  fullWidth
                  placeholder="Wallet Address"
                  {...getFieldProps('wallet_address')}
                  error={Boolean(
                    (touched.wallet_address && errors.wallet_address) ||
                    !ethereum_address.isAddress(formik.values.wallet_address)
                  )}
                  helperText={
                    (touched.wallet_address && errors.wallet_address) ||
                      !ethereum_address.isAddress(formik.values.wallet_address)
                      ? 'Incorrect Address'
                      : ''
                  }
                />
                <Grid
                  container
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{ width: '100%' }}
                  justifyContent="space-around"
                  spacing={3}>
                  <SBGrid item xs={6} sm={6} md={6} sx={{ textAlign: 'end', color: 'white' }}>
                    <FormControlLabel
                      value="start"
                      control={
                        <Switch
                          color="primary"
                          checked={values.enable_qr === true}
                          onClick={doMFA}
                        />
                      }
                      label="MFA"
                      labelPlacement="start"
                    />
                  </SBGrid>
                  <SBGrid item xs={6} sm={6} md={6} sx={{ textAlign: 'end', color: 'white' }}>
                    <FormControlLabel
                      value="start"
                      control={
                        <Switch
                          color="primary"
                          checked={values.enable_sms === true}
                          onClick={doSMS}
                        />
                      }
                      label="SMS Verification"
                      labelPlacement="start"
                    />
                  </SBGrid>
                  <SBGrid item xs={12} sm={12} md={4}></SBGrid>
                </Grid>
                <Modal
                  open={openMfa}
                  onClose={handleCloseMfa}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  hideBackdrop>
                  <Box sx={mfastyle}>
                    <Box
                      style={{
                        float: 'right',
                        marginTop: '-22px',
                        marginRight: '-20px'
                      }}>
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseMfa}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {showQR && (
                      <div style={{ marginTop: '20px' }}>
                        <img style={{ margin: 'auto' }} src={qrURL} />
                        <p style={{ marginLeft: '20px' }}>Please setup MFA on authenticator app</p>
                      </div>
                    )}

                    <InputGroup>
                      <LockIcon />
                      <TextField
                        type="input"
                        placeholder="Enter your TOTP"
                        id="totp"
                        value={totp}
                        style={{ padding: '16px 20px 16px 40px' }}
                        onChange={handleTOTPInputChange}
                      />
                    </InputGroup>
                    {showError && (
                      <p style={{ marginBottom: '10px', color: 'red' }}>
                        Invalid code please try again
                      </p>
                    )}
                    <Button variant="contained" sx={{ width: '100%' }} onClick={checkMFACode} full>
                      Confirm
                    </Button>
                  </Box>
                </Modal>
                <Modal
                  open={opensms}
                  onClose={handleClosesms}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  hideBackdrop>
                  <Box sx={mfastyle}>
                    <Box
                      style={{
                        float: 'right',
                        marginTop: '-22px',
                        marginRight: '-20px'
                      }}>
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClosesms}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <h2>2-Step Verification</h2>
                    <div
                      style={{
                        display: 'flex',
                        marginTop: '20px',
                        marginBottom: '20px'
                      }}>
                      <SBPhoneInput
                        defaultCountry="US"
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        sx={{ width: '80%' }}
                      />
                      <Button
                        type="text"
                        style={{
                          marginLeft: '10px',
                          height: 'auto',
                          flex: '1'
                        }}
                        onClick={sendMessage}
                        disabled={disabled}>
                        {btnLabel}
                      </Button>
                    </div>
                    <InputGroup sx={{ mt: 3 }}>
                      <LockIcon />
                      <TextField
                        type="number"
                        placeholder="Enter your SMS code"
                        id="smsConfirm"
                        value={smscode}
                        style={{ padding: '16px 20px 16px 40px' }}
                        onChange={(e) => handle2FA(e.target.value)}
                      />
                    </InputGroup>
                    {showSMSError && (
                      <p style={{ marginBottom: '10px', color: 'red' }}>
                        Invalid code please try again
                      </p>
                    )}
                    <Button
                      variant="contained"
                      sx={{ width: '100%' }}
                      onClick={check2faCode}
                      full
                      disabled={cdisable}>
                      Confirm
                    </Button>
                  </Box>
                </Modal>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </MyStack>
            </Stack>
          </form>
        </FormikProvider>
      </CardStyle>
    </Container>
  );
}
