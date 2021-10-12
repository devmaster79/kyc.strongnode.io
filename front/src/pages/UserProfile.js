import { merge } from "lodash";
import { useSnackbar } from "notistack5";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Divider,
  Table,
  LinearProgress,
  Modal,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { useState, useEffect, useCallback } from "react";
import axios from "utils/axios";
import { updateProfile, createQR, verifyTOTP } from "../utils/api";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import UploadSingleFile from "components/UploadSingleFile";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import { ReactComponent as LockIcon } from "../icons/lock.svg";

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)",
  border: "5px solid #964CFA",
  boxSizing: "border-box",
  borderRadius: "16px",
  padding: theme.spacing(4),
  width: "50%",
  margin: "auto",
}));

const mfastyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [openMfa, setOpenMfa] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showError, setShowError] = useState(false);
  const [totp, setTOTP] = useState("");
  const [qrURL, setQRURL] = useState("");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Fetch value from local storage
  const token = localStorage.getItem("token");
  const useremail = localStorage.getItem("email");

  const handleOpenMfa = () => setOpenMfa(true);
  const handleCloseMfa = () => {
    setOpenMfa(false);
  }

  const handleTOTPInputChange = (event) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6);
      setTOTP(event.target.value);
    } else {
      setTOTP(event.target.value);
    }
  };

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    user_name: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      user_name: '',
      password: '',
      telegram_id: '',
      twitter_id: '',
      email: '',
      wallet_address: '',
      KYC_Completed: 'level1',
      enable_totp: user?.enable_totp,
      MFA: user?.enable_totp,
      cover: '',
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const {
          first_name,
          last_name,
          user_name,
          password,
          cover,
          email,
          wallet_address,
          telegram_id,
          twitter_id,
        } = values;
        console.log(values);
        // const formData = new FormData();
        // formData.append("image", cover);
        // formData.append("name", name);
        // formData.append("description", description);
        const url = process.env.REACT_APP_BASE_URL + `/api/users/profile/update`;
        console.log("server url: ", url);

        const data = {
          email,
          password,
          first_name,
          last_name,
          user_name,
          wallet_address,
          telegram_id,
          twitter_id,
        };

        updateProfile(data).then(r => {
          if(r.status === 200) {
            enqueueSnackbar("User updated successfully1", { variant: "success" });

          } else {
            enqueueSnackbar("Failed to update profile2", { variant: "fail" });
          }
        });
        // enqueueSnackbar("User updated successfully", { variant: "success" });
        // resetForm();
      } catch (error) {
        console.error(error);
        // enqueueSnackbar("Oops! An error occured", { variant: "success" });
        setSubmitting(false);
      }
    },
  });

  const doMFA = () => {
    if(values.enable_totp == true) {
      setFieldValue("enable_totp", !values.enable_totp)
    } else {
      handleOpenMfa();
    }
  }

  const checkMFACode = () => {
    verifyTOTP(useremail, totp).then(r => {
      if(r.data.verified) {
        setFieldValue("enable_totp", true);
        handleCloseMfa();
      } else {
        setShowError(true);
      }
		});
  }

  const loadBlockpassWidget = async (event) => {
    const blockpass = new window.BlockpassKYCConnect('strongnode_596cc',
      {
        env: 'prod',
        refId: '1632811259976',
      })

    blockpass.startKYCConnect()
    blockpass.on('KYCConnectSuccess', () => {
      //add code that will trigger when data have been sent
      navigate("/dashboard");
    })

    blockpass.on('KYCConnectClose', () => {
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
    async function fetch() {
      const url =
        process.env.REACT_APP_BASE_URL +
        `/api/users/profile/get?email=${useremail}`;
      console.log("server url: ", url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if(!result.data[0].enable_totp || result.data[0].enable_totp == null) {
        setShowQR(true);
        createQR(useremail).then(rq => {
          setQRURL(rq.data.url);
        });
      }
      formik.setValues(result.data[0]);
      // setUser(result.data[0]);
    }

    fetch();
    loadBlockpassWidget()
  }, []);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;
  const formStyle = {  }
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue("cover", file);
      }
    },
    [setFieldValue]
  );

  const levels = ["level1", "level2", "level3"];
  console.log("1.test =============== ", formik);

  return (
    <Container maxWidth="xl">
      <CardStyle>
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={4} alignItems="flex-start" sx={{
                display: {xs:'flex',}, justifyContent: {xs:'space-evenly'}, flexWrap:{xs:'wrap',md:'nowrap'}}}>
              <Stack spacing={5} sx={{mb:{xs:5,md:0}}}>
                <Box
                  sx={{
                    textAlign:'center',
                    width:{xs:'80%',md:200},
                    height: 200,
                    borderRadius: 1,
                  }}
                >
                  <UploadSingleFile
                    maxSize={31457280}
                    accept="image/*"
                    file={
                      values.cover && {
                        preview: URL.createObjectURL(values.cover),
                      }
                    }
                    onDrop={(e) => handleDrop(e, 1)}
                    error={Boolean(touched.cover && errors.cover)}
                    sx={{ height: 200 }}
                  />
                </Box>
                <Button sx={{ mb: 5 }} id="blockpass-kyc-connect" variant="contained">Register KYC</Button>
              </Stack>
              <Stack spacing={3} sx={{width:{xs:'80%'}}}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexGrow="1"
                  spacing={3}
                >
                  <TextField
                    fullWidth
                    // label="First Name"
                    placeholder="First Name"
                    {...getFieldProps("first_name")}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    fullWidth
                    placeholder="Last Name"
                    {...getFieldProps("last_name")}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Stack>
                <TextField
                  fullWidth
                  placeholder="User Name"
                  {...getFieldProps("user_name")}
                  error={Boolean(touched.user_name && errors.user_name)}
                  helperText={touched.user_name && errors.user_name}
                />
                <TextField
                  fullWidth
                  placeholder="Email"
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  disabled
                />
                <TextField
                  fullWidth
                  placeholder="Password"
                  type="Password"
                  {...getFieldProps("password")}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  fullWidth
                  placeholder="Telegram"
                  {...getFieldProps("telegram_id")}
                  error={Boolean(touched.telegram_id && errors.telegram_id)}
                  helperText={touched.telegram_id && errors.telegram_id}
                />
                <TextField
                  fullWidth
                  placeholder="Twitter"
                  {...getFieldProps("twitter_id")}
                  error={Boolean(touched.twitter_id && errors.twitter_id)}
                  helperText={touched.twitter_id && errors.twitter_id}
                />
                <TextField
                  fullWidth
                  placeholder="Wallet Address"
                  {...getFieldProps("wallet_address")}
                  error={Boolean(
                    touched.wallet_address && errors.wallet_address
                  )}
                  helperText={touched.wallet_address && errors.wallet_address}
                />
                <Stack direction="row" flexGrow="1" spacing={5}>
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch color="primary"  checked={values.enable_totp}  onClick={doMFA} />
                    }
                    label="MFA"
                    labelPlacement="start"
                  />
                  <TextField
                    id="outlined-select-currency"
                    select
                    placeholder="KYC Completed"
                    value={levels}
                    sx={{ flexGrow: 1 }}
                    {...getFieldProps("KYC_Completed")}
                  // onChange={handleChange}
                  >
                    {levels.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Modal
                  open={openMfa}
                  onClose={handleCloseMfa}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={mfastyle}>
                    {showQR &&
                      <div style={{marginTop: '20px'}}>
                        <img style={{margin: 'auto'}} src={qrURL} />
                        <p>Please setup MFA on authenticator app</p>
                      </div>
                    }
                    <InputGroup>
                      <LockIcon />
                      <Input
                        type="input"
                        placeholder="Enter your TOTP"
                        id="totp"
                        value={totp}
                        style={{ padding: "16px 20px 16px 40px" }}
                        onChange={handleTOTPInputChange}
                      />
                    </InputGroup>
                    {showError && <p style={{marginBottom: "10px", color: "red"}}>Invalid code please try again</p>}
                    <Button onClick={checkMFACode} full>
                      Confirm
                    </Button>
                  </Box>
                </Modal>
                <Button variant="contained" type="submit">
                  Edit
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormikProvider>
      </CardStyle>
    </Container>
  );
}
