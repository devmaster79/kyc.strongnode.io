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
  Paper,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { useState, useEffect, useCallback } from "react";
import axios from "utils/axios";
import {
  updateProfile,
  createQR,
  verifyTOTP,
  sendSMS,
  checkSMS,
  uploadProfileImage,
} from "../utils/api";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import UploadSingleFile from "components/UploadSingleFile";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import PhoneInput from "react-phone-number-input";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)",
  border: "5px solid #964CFA",
  boxSizing: "border-box",
  borderRadius: "16px",
  padding: theme.spacing(4),
  width: "90%",
  margin: "auto",
}));
const SBPhoneInput = styled(PhoneInput)`
  > input {
    width: "90%";
  }
`;
const mfastyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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

  const [user, setUser] = useState();
  const [openMfa, setOpenMfa] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showError, setShowError] = useState(false);
  const [totp, setTOTP] = useState("");
  const [qrURL, setQRURL] = useState("");
  const [opensms, setOpensms] = useState(false);
  const [showSMSError, setSMSshowError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [cdisable, setCdisable] = useState(true);
  const [value, setValue] = useState("");
  const [btnLabel, setBtnLabel] = useState("Send");
  const [smscode, setSmscode] = useState("");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Fetch value from local storage
  const token = localStorage.getItem("token");
  const useremail = localStorage.getItem("email");

  const handleOpenMfa = () => setOpenMfa(true);
  const handleCloseMfa = () => {
    setOpenMfa(false);
    setTOTP("");
    setShowError(false);
  };

  const handleOpensms = () => setOpensms(true);
  const handleClosesms = () => {
    setOpensms(false);
    setSmscode("");
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
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    user_name: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      user_name: "",
      password: "",
      telegram_id: "",
      twitter_id: "",
      email: "",
      wallet_address: "",
      KYC_Completed: "level1",
      enable_totp: user?.enable_totp,
      enable_sms: user?.enable_sms,
      MFA: user?.enable_totp,
      cover: "",
      file: "",
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
        const url =
          process.env.REACT_APP_BASE_URL + `/api/users/profile/update`;
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

        updateProfile(data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar("User updated successfully1", {
              variant: "success",
            });
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
    if (values.enable_totp === true) {
      setFieldValue("enable_totp", !values.enable_totp);
    } else {
      handleOpenMfa();
    }
  };

  const checkMFACode = () => {
    verifyTOTP(useremail, totp).then((r) => {
      if (r.data.verified) {
        setFieldValue("enable_totp", true);
        const { enable_totp } = values;
        const data = {
          enable_totp,
        };
        updateProfile(data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar("User updated successfully1", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update profile2", { variant: "fail" });
          }
        });
        handleCloseMfa();
      } else {
        setShowError(true);
      }
    });
  };

  const doSMS = () => {
    if (values.enable_sms === true) {
      setFieldValue("enable_sms", !values.enable_sms);
    } else {
      handleOpensms();
    }
  };

  const check2faCode = () => {
    checkSMS(useremail).then((r) => {
      if (smscode === r.data[0].smscode) {
        setFieldValue("enable_sms", true);
        const { enable_sms } = values;
        const data = {
          enable_sms,
        };
        updateProfile(data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar("User updated successfully1", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update profile2", { variant: "fail" });
          }
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
    sendSMS(value.substring(1), useremail).then((r) => console.log(r));
    const counter = setInterval(() => {
      setBtnLabel(`${count}s`);
      count--;
      if (count === -1) {
        clearInterval(counter);
        setBtnLabel("Send");
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

  const loadBlockpassWidget = async (event) => {
    const blockpass = new window.BlockpassKYCConnect("strongnode_596cc", {
      env: "prod",
      refId: "1632811259976",
    });

    blockpass.startKYCConnect();
    blockpass.on("KYCConnectSuccess", () => {
      //add code that will trigger when data have been sent
      navigate("/dashboard");
    });

    blockpass.on("KYCConnectClose", () => {
      //add code that will trigger when the workflow is finished. ex:
      //alert('Finished!')
      navigate("/dashboard");
    });

    blockpass.on("KYCConnectCancel", () => {
      //add code that will trigger when the workflow is aborted. ex:
      //alert('Cancelled!')
      navigate("/dashboard");
    });
  };

  useEffect(() => {
    async function fetch() {
      const url =
        process.env.REACT_APP_BASE_URL +
        `/api/users/profile/get?email=${useremail}`;
      console.log("server url: ", url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!result.data[0].enable_totp || result.data[0].enable_totp == null) {
        setShowQR(true);
        createQR(useremail).then((rq) => {
          setQRURL(rq.data.url);
        });
      }

      formik.setValues(result.data[0]);
      // setUser(result.data[0]);
    }

    console.log(value);
    if (value !== "") setDisabled(false);
    if (!value) setDisabled(true);
    fetch();
    loadBlockpassWidget();
  }, [value]);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

  const formStyle = {};

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        resolve(baseURL);
      };
      console.log("fileInfo: ", fileInfo);
    });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      let base64;
      getBase64(file).then((result) => setFieldValue("cover", result));
      if (file) {
        setFieldValue("file", file);
      }
    },
    [setFieldValue]
  );
  const upload = () => {
    console.log("1111111111", values);
    uploadProfileImage(values.email, values.user_name, values.cover)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        }
      })
      .catch((err) => {
        if (err.request) {
          console.log(err.request);
        }
        if (err.response) {
          console.log(err.response);
        }
      });
  };

  const levels = ["level1", "level2", "level3"];

  // const MyStack = styled(Stack)(({ theme }) => ({

  //   [theme.breakpoints.down('md')]: {
  //     marginLeft:0
  //   },
  // }))

  return (
    <Container maxWidth="xl">
      <CardStyle>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} enctype="multipart/form-data">
            <Stack
              direction="row"
              spacing={4}
              alignItems="flex-start"
              sx={{
                display: { xs: "flex" },
                justifyContent: { xs: "space-evenly" },
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <Stack spacing={5} sx={{ width: "200px", mb: { xs: 5, md: 0 } }}>
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    height: 200,
                    borderRadius: 1,
                    mt: 5,
                  }}
                >
                  <UploadSingleFile
                    maxSize={31457280}
                    accept="image/*"
                    file={
                      values.cover && {
                        preview: URL.createObjectURL(values.file),
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
                <Button
                  sx={{ mb: 5 }}
                  id="blockpass-kyc-connect"
                  variant="contained"
                >
                  Register KYC
                </Button>
                <TextField
                  id="outlined-select-currency"
                  select
                  placeholder="KYC Completed"
                  value={levels}
                  sx={{ flexGrow: 1, width: "100%" }}
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
              <MyStack spacing={3} sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexGrow="1"
                  spacing={3}
                >
                  <TextField
                    id="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    // label="First Name"
                    placeholder="First Name"
                    {...getFieldProps("first_name")}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    id="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
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
                <Grid
                  container
                  direction={{ xs: "column", sm: "row" }}
                  sx={{ width: "100%" }}
                  justifyContent="space-around"
                  spacing={3}
                >
                  <SBGrid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ textAlign: "center" }}
                  >
                    <FormControlLabel
                      value="start"
                      control={
                        <Switch
                          color="primary"
                          checked={values.enable_totp === true}
                          onClick={doMFA}
                        />
                      }
                      label="MFA"
                      labelPlacement="start"
                    />
                  </SBGrid>
                  <SBGrid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ textAlign: "center" }}
                  >
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
                  hideBackdrop
                >
                  <Box sx={mfastyle}>
                    <Box
                      style={{
                        float: "right",
                        marginTop: "-22px",
                        marginRight: "-20px",
                      }}
                    >
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseMfa}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {showQR && (
                      <div style={{ marginTop: "20px" }}>
                        <img style={{ margin: "auto" }} src={qrURL} />
                        <p style={{ marginLeft: "20px" }}>
                          Please setup MFA on authenticator app
                        </p>
                      </div>
                    )}

                    <InputGroup>
                      <LockIcon />
                      <TextField
                        type="input"
                        placeholder="Enter your TOTP"
                        id="totp"
                        value={totp}
                        style={{ padding: "16px 20px 16px 40px" }}
                        onChange={handleTOTPInputChange}
                      />
                    </InputGroup>
                    {showError && (
                      <p style={{ marginBottom: "10px", color: "red" }}>
                        Invalid code please try again
                      </p>
                    )}
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      onClick={checkMFACode}
                      full
                    >
                      Confirm
                    </Button>
                  </Box>
                </Modal>
                <Modal
                  open={opensms}
                  onClose={handleClosesms}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  hideBackdrop
                >
                  <Box sx={mfastyle}>
                    <Box
                      style={{
                        float: "right",
                        marginTop: "-22px",
                        marginRight: "-20px",
                      }}
                    >
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClosesms}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <h2>2-Step Verification</h2>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <SBPhoneInput
                        defaultCountry="US"
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        sx={{ width: "80%" }}
                      />
                      <Button
                        type="text"
                        style={{
                          marginLeft: "10px",
                          height: "auto",
                          flex: "1",
                        }}
                        onClick={sendMessage}
                        disabled={disabled}
                      >
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
                        style={{ padding: "16px 20px 16px 40px" }}
                        onChange={(e) => handle2FA(e.target.value)}
                      />
                    </InputGroup>
                    {showSMSError && (
                      <p style={{ marginBottom: "10px", color: "red" }}>
                        Invalid code please try again
                      </p>
                    )}
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      onClick={check2faCode}
                      full
                      disabled={cdisable}
                    >
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
