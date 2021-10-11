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
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { useState, useEffect, useCallback } from "react";
import axios from "utils/axios";
import { updateProfile } from "../utils/api";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import UploadSingleFile from "components/UploadSingleFile";

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

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const token = localStorage.getItem("token");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
    async function fetch() {
      const useremail = localStorage.getItem("email");

      const url =
        process.env.REACT_APP_BASE_URL +
        `/api/users/profile/get?email=${useremail}`;
      console.log("server url: ", url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
            <Stack direction="row" spacing={5} alignItems="flex-start">
              <Stack spacing={5}>
                <Box
                  sx={{
                    width: 200,
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
                <Button id="blockpass-kyc-connect" variant="contained">Register KYC</Button>
              </Stack>
              <Stack spacing={3}>
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
                      <Switch color="primary"  checked={values.enable_totp}  onClick={(e) => setFieldValue("enable_totp", !values.enable_totp) } />
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
