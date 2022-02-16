import {EntryPage} from "./style";
import EntryCard from "../components/EntryCard"
import {ReactComponent as UserIcon} from "../icons/username.svg"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import InputGroup from "../components/InputGroup"
import {ReactComponent as LockIcon} from "../icons/lock.svg"
import Input from "../components/Input"
import { Form, Formik } from "formik"
import PasswordStrengthBar from "react-password-strength-bar"
import Button from "../components/Button"
import {useSearchParams, useNavigate} from "react-router-dom"
import {createNewPassword} from "../static/formSchemas"
import {passwordResetSubmit} from "../utils/api"


const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4d79f6;
  margin-top: 30px;
  p {
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    color: #4d79f6;
    margin: 0 0 0 10px;
  }
`;

function CreateNewPassword () {
    const navigate = useNavigate()
    const userEmail = localStorage.getItem('email')
    const [password, setPassword] = useState("")
    const [showError, setShowError] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [searchParams] = useSearchParams()
    const [userName, setUserName] = useState('')

    const passwordToken = searchParams.get('token')

    useEffect(() => {
        // if password token is not right, navigate to root
        if (passwordToken === null)
            navigate('/')
    })

    const handlePasswordInputChange = (event) => {
        if (password === event.target.value)
            setShowError(false)
        else
            setShowError(true)

        setPassword(event.target.value)
    }

    const handleConfirmPasswordInputChange = (event) => {
        if (password === event.target.value) {
            setShowError(false);
        } else {
            setShowError(true);
        }
        setConfirmPassword(event.target.value);
    };

    const handleFormSubmit = async (data) => {
        if (password === confirmPassword && password !== '') {
            await passwordResetSubmit(password, passwordToken).then(res => {
                if (res.data.length !== 0 && typeof res.data.status !== 'undefined') {
                    if (res.data.status === 'success') {
                        setUserName(res.data.username)
                        localStorage.setItem("token", res.data.token)
                        localStorage.setItem('username', res.data.username)
                        localStorage.setItem('loggedin', true)
                        navigate('/dashboard')
                    } else {
                        console.error(res.data.message)
                    }
                }
            })
        }
    }

    const defaultFormValues = {
        password: '',
        "confirm-password": ''
    }

    return (
        <EntryPage>
            <EntryCard>
                <h2>Reset your password</h2>
                <h5>Choose your new password.</h5>
                <UserInfoWrapper>
                    <UserIcon />
                    <p>{userEmail}</p>
                </UserInfoWrapper>
                <Formik
                    initialValues={defaultFormValues}
                    validate={(value, props) => {
                        return {}
                    }}
                    onSubmit={handleFormSubmit}
                >
                    <Form style={{ marginTop: 30 }}>
                        {showError && <>
                            <p style={{ marginBottom: '10px', color: 'red' }}>
                                Password doesn&apos;t match!
                            </p></>
                        }
                        <InputGroup>
                            <LockIcon />
                            <Input
                                type="password"
                                placeholder="Password"
                                id="password"
                                name="password"
                                value={password}
                                style={{ padding: "16px 20px 16px 40px" }}
                                onChange={handlePasswordInputChange}
                            />
                        </InputGroup>

                        <InputGroup>
                            <LockIcon />
                            <Input
                                type="password"
                                placeholder="Confirm password"
                                name="confirm-password"
                                id="confirm-password"
                                style={{ padding: "16px 20px 16px 40px" }}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordInputChange}
                            />
                        </InputGroup>
                        <PasswordStrengthBar password={password} />
                        <Button style={{ marginTop: '18px' }} type="submit" full>
                            RESET PASSWORD
                        </Button>
                    </Form>
                </Formik>

            </EntryCard>
        </EntryPage>
    )
}

export default CreateNewPassword
