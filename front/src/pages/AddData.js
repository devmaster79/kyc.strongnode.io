import { useSnackbar } from 'notistack5';
import { Container, Box, Stack, Button, Select, TextField, MenuItem } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { historyAction } from '../utils/api';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

const CardStyle = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  border: '5px solid #964CFA',
  boxSizing: 'border-box',
  borderRadius: '16px',
  padding: theme.spacing(4),
  width: '90%',
  margin: 'auto'
}));
const MyStack = styled(Stack)`
  @media (max-width: 1024px) {
    margin-left: 0 !important;
  }
`;
export default function Dashboard() {
  const types = ['earned', 'unlocked', 'vested', 'withdrawn'];

  const [user, setUser] = useState();
  const [value, setValue] = useState(0);
  const [type, setType] = useState(0);
  const [date, setDate] = useState(new Date());

  const { enqueueSnackbar } = useSnackbar();

  //Fetch value from local storage
  const token = localStorage.getItem('token');
  const useremail = localStorage.getItem('email');

  const ProfileSchema = Yup.object().shape({
    value: Yup.string().required('TokenAmount is required'),
    type: Yup.string().required('Type is required')
  });

  const formik = useFormik({
    initialValues: {
      value: 0,
      type: 0
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const url = process.env.REACT_APP_BASE_URL + `/api/history/`;
        console.log('server url: ', url);

        const data = {
          user_name: user.user_name,
          token_amount: value / 1,
          action_type: types[type],
          date: date
        };
        console.log(data);
        historyAction(url, data).then((r) => {
          if (r.status === 200) {
            enqueueSnackbar('Data added successfully1', {
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Failed to Add Data', { variant: 'fail' });
          }
        });
      } catch (error) {
        console.error(error);
        // enqueueSnackbar("Oops! An error occured", { variant: "success" });
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    async function fetch() {
      const url = process.env.REACT_APP_BASE_URL + `/api/users/profile/get?email=${useremail}`;
      console.log('server url: ', url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(result.data);

      setUser(result.data[0]);
    }

    fetch();
  }, [token, useremail, value]);

  return (
    <Container maxWidth="xl" style={{ height: '100vh' }}>
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
              <MyStack spacing={3} sx={{ width: '100%' }}>
                <TextField
                  InputProps={{ style: { color: 'white' } }}
                  fullWidth
                  placeholder="User Name"
                  value={user ? user.user_name : ''}
                  disabled
                />

                <TextField
                  InputProps={{ style: { color: 'white' } }}
                  fullWidth
                  placeholder="Token Amount"
                  type="Number"
                  value={value}
                  error={!value}
                  helperText={!value ? 'Token Amount is required' : ''}
                  onChange={(event) => setValue(event.target.value)}
                />
                <Select
                  SelectDisplayProps={{ style: { color: 'white' } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  onChange={(event) => setType(event.target.value)}>
                  {types.map((data, i) => {
                    return (
                      <MenuItem value={i} key={i}>
                        {data}
                      </MenuItem>
                    );
                  })}
                </Select>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    InputProps={{ style: { color: 'white' } }}
                    renderInput={(params) => <TextField {...params} />}
                    label="Ignore date and time"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    minDateTime={new Date()}
                  />
                </LocalizationProvider>
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
