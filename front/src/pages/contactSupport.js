import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import styled from '@material-ui/core/styles/styled';
import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import userService from '../services/userService';
import Button from '@material-ui/core/Button';

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)',
  border: '5px solid #964CFA',
  boxSizing: 'border-box',
  borderRadius: '16px',
  padding: theme.spacing(4),
  width: '90%',
  margin: 'auto'
}));

const inputStyle = {
  display: 'block',
  fontFamily: 'Halyard-Book',
  border: '1px solid #1df4f6',
  background: 'rgba(238,238,238,0.0001)',
  padding: '16px 20px 16px 20px',
  width: '80%',
  height: '52px',
  outline: 'none',
  borderRadius: '6px',
  fontSize: '18px',
  color: 'white',
  transition: 'box-shadow 0.2s',
  boxSizing: 'border-box',
  boxShadow: 'inset 0px 10px 10px rgb(0 0 0 / 25%)',
  marginTop: '12px'
};

const textAreaStyle = {
  display: 'block',
  fontFamily: 'Halyard-Book',
  border: '1px solid #1df4f6',
  background: 'rgba(238,238,238,0.0001)',
  padding: '16px 20px 16px 20px',
  width: '80%',
  height: '280px',
  outline: 'none',
  borderRadius: '6px',
  fontSize: '18px',
  color: 'white',
  transition: 'box-shadow 0.2s',
  boxSizing: 'border-box',
  boxShadow: 'inset 0px 10px 10px rgb(0 0 0 / 25%)',
  marginTop: '24px',
  resize: 'none'
};

function ContactSupport() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [buttonTitle, setButtonTitle] = useState('Send');

  const onSubmit = (data) => {
    userService.createSupportRequest(data).then((r) => {
      if (r.data.result === 'Success') {
        setButtonTitle('Success!');
        reset({ subject: '', message: '' });
      } else {
        setButtonTitle('Error! Try sending it later');
      }
    });
  };

  return (
    <Container>
      <CardStyle>
        <h2 style={{ color: 'white' }}>Contact support</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input placeholder={'Subject'} {...register('subject')} style={inputStyle} />

          {/* include validation with required or other standard HTML validation rules */}
          <textarea
            placeholder={'Message'}
            {...register('message', { required: true })}
            style={textAreaStyle}
          />
          {/* errors will return when field validation fails  */}
          {errors.message && <span>This field is required</span>}

          <Button
            variant="contained"
            type="submit"
            sx={{ width: '20%', marginTop: '24px', cursor: 'pointer' }}>
            {buttonTitle}
          </Button>
        </form>
      </CardStyle>
    </Container>
  );
}

export default ContactSupport;
