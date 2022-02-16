import React from "react"
import { useNavigate } from "react-router-dom"
import {EntryPage} from "./style"
import EntryCard from "../components/EntryCard"
import Button from "../components/Button"
import { Form, Formik } from "formik"
import ValidatedField from "../components/ValidatedField"
import Input from "../components/Input"
import {forgottenPassword} from "../static/formSchemas"
import {requestPasswordReset} from "./../utils/api.js"
import { magic } from '../utils/index'


function ForgottenPassword () {
    const navigate = useNavigate()

    const defaultFormValues = {
        email: ''
    }

    let showError = false

    const handleFormSubmit = async (data) => {
        localStorage.setItem('email', data.email)
        // sends password reset request to the BE
        await requestPasswordReset(data.email).then(async res => {
            if (res.data.length !== 0 && typeof res.data.status !== 'undefined') {
                navigate("/magiclink");
            } else {
                showError = true
            }
        })
    }

    return (
        <EntryPage>
            <EntryCard>
                <h2>Forgotten password</h2>
                <h5>We will send you a magic link and then you will be able to reset your password.</h5>
                <Formik
                    initialValues={defaultFormValues}
                    onSubmit={handleFormSubmit}
                    validationSchema={forgottenPassword}
                >
                    <Form style={{ marginTop: 30 }}>
                        <ValidatedField
                            as={Input}
                            name="email"
                            placeholder="Email"
                            style={{ padding: "16px 20px 16px 40px" }}
                            type="email"
                        />
                        {showError && <p style={{marginBottom: "10px", color: "red"}}>User with provided email does not exist.</p>}
                        <Button
                            type="submit"
                            full
                        >
                            Request password reset
                        </Button>
                    </Form>
                </Formik>
            </EntryCard>
        </EntryPage>
    )
}

export default ForgottenPassword
