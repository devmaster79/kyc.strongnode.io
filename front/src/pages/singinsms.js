import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import ValidatedField from "../components/ValidatedField";
import { signupSchema } from "../static/formSchemas";
import PhoneInput from 'react-phone-number-input';
import { sendSMS, checkSMS } from "../utils/api";
import 'react-phone-number-input/style.css'

function SigninSMS() {
  const navigate = useNavigate();

  const initFormState = {
    email: ""
  }

  const [smscode, setSmscode] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [cdisable, setCdisable] = useState(true);
	const [originCode, setOriginCode] = useState("");
	const [factorCode, setFactorCode] = useState("");
	const [showError, setShowError] = useState(false);
  const [value, setValue] = useState("");
	const [btnLabel, setBtnLabel] = useState("Send");

  const handleSubmit = (event) => {
    event.preventDefault();
		var confirm_code = 0;
		// for test
		const email = "test@gmail.com";

		checkSMS(email).then(r => {
			if(smscode === r.data[0].smscode) {
				navigate("/signintwostep");
			} else {
				setShowError(true);
			}
		});
  };

	const sendMessage = () => {
    let count = 30;
    const userID = window.localStorage.getItem("userID");
		// for test
		const email = "test@gmail.com";
    setDisabled(true);
    setShowError(false);
    sendSMS(value.substring(1), email).then(r => console.log(r));
    const counter = setInterval(() => {
      setBtnLabel(`${count}s`)
      count --;
      if (count === -1) {
          clearInterval(counter);
          setBtnLabel("Send");
          setDisabled(false)
      }
    }, 1000);
  }

	const handle2FA = (val) => {
		setSmscode(val);
    if (val) setCdisable(false);
    else setCdisable(true);
    setFactorCode(val);
    setShowError(false);
  }

	useEffect(() => {
    if (value !== "") setDisabled(false);
    if (!value) setDisabled(true);
  }, [value])

  return (
    <EntryPage>
      <EntryCard>
        <h2>2-Step Verification</h2>
        <div style={{display: 'flex'}}>
            <PhoneInput
							defaultCountry="US"
							placeholder="Enter phone number"
							value={value}
							onChange={setValue}
            />
            <Button type="text" style={{ marginLeft: '10px', height:'auto', flex: '1' }} onClick={ sendMessage } disabled={ disabled }>
							{btnLabel}
            </Button>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <LockIcon />
            <Input
              type="input"
              placeholder="Enter your SMS code"
              id="smsConfirm"
              value={smscode}
              style={{ padding: "16px 20px 16px 40px" }}
              onChange={(e) => handle2FA(e.target.value)}
            />
          </InputGroup>
					{showError && <p style={{marginBottom: "10px", color: "red"}}>Invalid code please try again</p>}
          <Button type="submit" full disabled={cdisable}>
            Confirm
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default SigninSMS;
