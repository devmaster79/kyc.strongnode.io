import { Form, Formik, FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { EntryPage } from '../style'
import Button from '../../components/Button'
import EntryCard from '../../components/EntryCard'
import Input from '../../components/Input'
import ValidatedField from '../../components/ValidatedField'
import { signupSchema } from '../../static/formSchemas'
import * as authService from '../../services/auth'
import { useService } from 'hooks/useService'

export function Register () {
  const navigate = useNavigate()
  const { data: registerState, call: register } = useService(
    authService.register
  )

  const initFormState = {
    first_name: '',
    last_name: '',
    user_name: '',
    termsAgreement: false
  }

  const handleFormSubmit = async (data: typeof initFormState, { setErrors }: FormikHelpers<typeof initFormState>) => {
    const result = await register({
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name
    })
    if (
      result.result === 'validation-error' &&
      result.field === 'user_name' &&
      result.reason === 'already-taken'
    ) {
      setErrors({ user_name: 'This username is alredy taken' })
    }
    if (result.result === 'success') {
      navigate('/sign-in-with-token')
    }
  }

  return (
    <EntryPage>
      <EntryCard>
        <h2 style={{ fontFamily: 'Halyard' }}>CREATE AN ACCOUNT</h2>
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={signupSchema}
        >
          {({ handleBlur, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="first_name"
                onBlur={handleBlur}
                placeholder="First name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="last_name"
                onBlur={handleBlur}
                placeholder="Last name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="user_name"
                onBlur={handleBlur}
                placeholder="Username"
                style={{ padding: '16px 20px 16px 40px' }}
                type="text"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="termsAgreement"
                onBlur={handleBlur}
                style={{ width: 'auto' }}
                type="checkbox"
                wrapperStyle={{
                  alignItems: 'center',
                  display: 'flex',
                  height: '9px!important',
                  width: '9px!important'
                }}
                validateField={validateField}
              />
              <RegisterMsg>
                {registerState.result === 'loading' && 'Loading...'}
                {registerState.result === 'unauthorized-error' && (
                  <Error>You do not have access to this feature.</Error>
                )}
                {registerState.result === 'unexpected-error' && (
                  <Error>Something went wrong.</Error>
                )}
              </RegisterMsg>
              <Button
                disabled={registerState.result === 'loading'}
                type="submit"
                full
              >
                SIGN UP
              </Button>
            </Form>
          )}
        </Formik>
      </EntryCard>
    </EntryPage>
  )
}

const RegisterMsg = styled.p`
  margin-bottom: 10px;
`

const Error = styled.span`
  color: red;
`
