import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Input from "../components/Input"
import userService from '../services/userService'
import { Form, Formik } from 'formik';
import ValidatedField from '../components/ValidatedField';
import styled from '@material-ui/core/styles/styled';
import { changePasswordSchema } from '../static/formSchemas'
import { useSnackbar } from 'notistack5';

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)',
  border: '5px solid #964CFA',
  boxSizing: 'border-box',
  borderRadius: '16px',
  padding: theme.spacing(4),
  width: '90%',
  margin: 'auto',
  height: '100%'
}));
export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const initFormState = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    try {
      const {
        old_password,
        new_password
      } = values;

      const data = {
        old_password,
        new_password
      };

      userService.changePassword(data).then((r) => {
        if (r.status === 200) {
          enqueueSnackbar('Password updated successfully.', {
            variant: 'success'
          });
        }
      }).catch(e => {
        enqueueSnackbar("Failed to update password", { variant: 'fail' });
        setSubmitting(false);
      });
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <CardStyle>
      <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={changePasswordSchema}>
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="old_password"
                onBlur={handleBlur}
                placeholder="Old password"
                type="password"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="new_password"
                onBlur={handleBlur}
                placeholder="New password"
                type="password"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="confirm_password"
                onBlur={handleBlur}
                placeholder="Confirm password"
                type="password"
                validateField={validateField}
              />
              <Button variant="contained" type="submit">
                Change password
              </Button>
            </Form>
          )}
        </Formik>
      </CardStyle>
    </Container>
  );
}
