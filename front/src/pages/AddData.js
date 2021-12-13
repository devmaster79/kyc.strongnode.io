import { useSnackbar } from "notistack5";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Stack,
  Button,
  Select,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { useState, useEffect, useCallback } from "react";
import axios from "utils/axios";
import {
  addData,
} from "../utils/api";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

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
const MyStack = styled(Stack)`
  @media (max-width: 1024px) {
    margin-left: 0 !important;
  }
`;
export default function Dashboard() {

  const types = ["earned", "unlocked", "vested", "withdrawn"];


  const [user, setUser] = useState();
  const [value, setValue] = useState(0);
  const [type, setType] = useState(0);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Fetch value from local storage
  const token = localStorage.getItem("token");
  const useremail = localStorage.getItem("email");

  const ProfileSchema = Yup.object().shape({
    value: Yup.string().required("TokenAmount is required"),
    type: Yup.string().required("Type is required"),
  });

  const formik = useFormik({
    initialValues: {
      value: 0,
      type: 0
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const url =
          process.env.REACT_APP_BASE_URL + `/api/history/`;
        console.log("server url: ", url);

        const data = {
          user_name: user.user_name,
          token_amount: value / 1,
          action_type: types[type],
          date : Date.now()
        };
        console.log(data);
        addData(url, data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar("Data added successfully1", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to Add Data", { variant: "fail" });
          }
        });
      } catch (error) {
        console.error(error);
        // enqueueSnackbar("Oops! An error occured", { variant: "success" });
        setSubmitting(false);
      }
    },
  });


  useEffect(() => {
    async function fetch() {
      const url =
        process.env.REACT_APP_BASE_URL +
        `/api/users/profile/get?email=${useremail}`;
      console.log("server url: ", url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(result.data);

      setUser(result.data[0]);
    }

    fetch();
  }, [value]);

  const {
    handleSubmit,
  } = formik;

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

              <MyStack spacing={3} sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  placeholder="User Name"
                  value={user ? user.user_name : ""}
                  disabled
                />

                <TextField
                  fullWidth
                  placeholder="Token Amount"
                  type="Number"
                  value={value}
                  error={!value}
                  helperText={!value ? "Token Amount is required" : ""}
                  onChange={(event) => setValue(event.target.value)}
                />
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  {
                    types.map((data, i) => {
                      return <MenuItem value={i} key={i}>{data}</MenuItem>
                    })
                  }
                </Select>
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
