import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import UploadSingleFile from "components/UploadSingleFile";
import ethereum_address from "ethereum-address-es5";
import userService from "../../services/userService";
import {
  Container,
  Box,
  Stack,
  Button,
  Grid,
  TextField,
  MenuItem,
  Switch,
  styled,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { SetupModal } from "./SetupModal";
import { SetupAuthenticatorAuth } from "./SetupAuthenticatorAuth";
import { SetupSMSAuth } from "./SetupSMSAuth";
import { SetupPasswordAuth } from "./SetupPasswordAuth";
import { rest } from "lodash";

interface FormFields {
  first_name: string;
  last_name: string;
  user_name: string;
  telegram_id: string;
  twitter_id: string;
  email: string;
  wallet_address: string;
  KYC_Completed: string;
  cover: string;
  file?: Blob;
  enable_password: boolean;
  enable_authenticator: boolean;
  enable_sms: boolean;
}

export default function UserProfile() {
  const [showSMSAuthSetup, setShowSMSAuthSetup] = useState(false);
  const [showAuthenticatorAuthSetup, setShowAuthenticatorAuthSetup] = useState(
    false
  );
  const [showPasswordAuthSetup, setShowPasswordAuthSetup] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    user_name: Yup.string().required("User Name is required"),
  });

  const formik = useFormik<FormFields>({
    initialValues: {
      first_name: "",
      last_name: "",
      user_name: "",
      telegram_id: "",
      twitter_id: "",
      email: "",
      wallet_address: "",
      KYC_Completed: "level1",
      cover: "",
      file: undefined,
      enable_password: false,
      enable_authenticator: false,
      enable_sms: false,
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          user_name: values.user_name,
          wallet_address: values.wallet_address,
          telegram_id: values.telegram_id,
          twitter_id: values.twitter_id,
          enable_password: values.enable_password,
          enable_authenticator: values.enable_authenticator,
          enable_sms: values.enable_sms,
        };

        userService.updateProfile(data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar("User updated successfully1", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update profile2", { variant: "error" });
          }
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    userService.getProfile().then((res) => {
      if (res.status == 200) {
        formik.setValues(
          {
            first_name: res.data[0].first_name,
            last_name: res.data[0].last_name,
            user_name: res.data[0].user_name,
            telegram_id: res.data[0].telegram_id,
            twitter_id: res.data[0].twitter_id,
            email: res.data[0].email,
            wallet_address: res.data[0].wallet_address,
            KYC_Completed: "level1",
            cover: "",
            file: undefined,
            enable_password: res.data[0].enable_password,
            enable_authenticator: res.data[0].enable_authenticator,
            enable_sms: res.data[0].enable_sms,
          },
          false
        );
      }
    });
  }, []);

  const { values, errors, touched, getFieldProps, setFieldValue } = formik;

  const readBlobAsBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      let fileInfo;
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        if (typeof reader.result == "string") {
          resolve(reader.result);
        } else {
          reject("Couldn't read file as DataURL");
        }
      };
    });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      readBlobAsBase64(file).then((result) => {
        setFieldValue("cover", result);
      });
      if (file) {
        setFieldValue("file", file);
      }
    },
    [setFieldValue]
  );

  const upload = () => {
    userService
      .uploadProfileImage(values.email, values.user_name, values.cover)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar("Uploaded successfully!", {
            variant: "success",
          });
          window.location.reload();
        } else {
          enqueueSnackbar("Failed to upload!", { variant: "error" });
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

  const levels = ["level1", "level2", "level3"];

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
                display: { xs: "flex" },
                justifyContent: { xs: "space-evenly" },
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <Stack spacing={5} sx={{ flex: 0 }}>
                <Box>
                  <UploadSingleFile
                    maxSize={31457280}
                    accept="image/*"
                    file={
                      values.file && {
                        preview: URL.createObjectURL(values.file),
                      }
                    }
                    onDrop={(acceptedFiles: File[]) =>
                      handleDrop(acceptedFiles)
                    }
                    error={Boolean(touched.cover && errors.cover)}
                    sx={{ height: 200 }}
                  />
                </Box>
                <Button onClick={upload} sx={{ mb: 5 }} variant="contained">
                  Upload
                </Button>
                <TextField
                  id="outlined-select-currency"
                  select
                  placeholder="KYC Completed"
                  disabled
                  SelectProps={{ value: formik.values.KYC_Completed }}
                  sx={{ flexGrow: 1, width: "100%" }}
                  {...getFieldProps("KYC_Completed")}
                >
                  {levels.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack spacing={3} sx={{ width: "100%" }}>
                <h2>General</h2>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexGrow="1"
                  spacing={3}
                >
                  <TextField
                    id="first_name"
                    fullWidth
                    placeholder="First Name"
                    {...getFieldProps("first_name")}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    id="last_name"
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
                    (touched.wallet_address && errors.wallet_address) ||
                      !ethereum_address.isAddress(formik.values.wallet_address)
                  )}
                  helperText={
                    (touched.wallet_address && errors.wallet_address) ||
                    !ethereum_address.isAddress(formik.values.wallet_address)
                      ? "Incorrect Address"
                      : ""
                  }
                />
                <Grid container direction={"column"} sx={{ color: "white" }}>
                  <h2>Two factor authentication</h2>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={formik.values.enable_authenticator}
                        onClick={() => {
                          if (formik.values.enable_authenticator) {
                            formik.setFieldValue("enable_authenticator", false);
                            formik.submitForm();
                          } else {
                            setShowAuthenticatorAuthSetup(true);
                          }
                        }}
                      />
                    }
                    label="Enable Authenticator Verification"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={formik.values.enable_sms}
                        onClick={() => {
                          if (formik.values.enable_sms) {
                            formik.setFieldValue("enable_sms", false);
                            formik.submitForm();
                          } else {
                            setShowSMSAuthSetup(true);
                          }
                        }}
                      />
                    }
                    label="Enable SMS Verification"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={formik.values.enable_password}
                        onClick={() => {
                          if (formik.values.enable_password) {
                            formik.setFieldValue("enable_password", false);
                            formik.submitForm();
                          } else {
                            setShowPasswordAuthSetup(true);
                          }
                        }}
                      />
                    }
                    label="Enable Password Verification"
                    labelPlacement="start"
                  />
                  <SetupModal
                    Component={SetupAuthenticatorAuth}
                    onSuccess={() => {
                      formik.setFieldValue("enable_authenticator", true);
                      formik.submitForm();
                    }}
                    onClose={() => setShowAuthenticatorAuthSetup(false)}
                    open={showAuthenticatorAuthSetup}
                  />
                  <SetupModal
                    Component={SetupSMSAuth}
                    onSuccess={() => {
                      formik.setFieldValue("enable_sms", true);
                      formik.submitForm();
                    }}
                    onClose={() => setShowSMSAuthSetup(false)}
                    open={showSMSAuthSetup}
                  />
                  <SetupModal
                    Component={SetupPasswordAuth}
                    onSuccess={() => {
                      formik.setFieldValue("enable_password", true);
                      formik.submitForm();
                    }}
                    onClose={() => setShowPasswordAuthSetup(false)}
                    open={showPasswordAuthSetup}
                  />
                </Grid>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormikProvider>
      </CardStyle>
    </Container>
  );
}

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)",
  border: "5px solid #964CFA",
  color: theme.palette.text.primary,
  boxSizing: "border-box",
  borderRadius: "16px",
  padding: theme.spacing(4),
  width: "90%",
  margin: "auto",
}));

const SBGrid = styled(Grid)`
  padding-left: 0 !important;
`;
