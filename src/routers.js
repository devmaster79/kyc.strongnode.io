import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Profile from './pages/profile';
import Signup from './pages/signup';
import SentEmail from './pages/sentemail'
import CreateAccountPassword from './pages/createaccountpassword'
import PrivateSaleInterestForm from './pages/privatesaleinterestform'

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Signup />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/sent-email">
        <SentEmail />
      </Route>
      <Route path="/create-account-password">
        <CreateAccountPassword />
      </Route>
      <Route path="/private-sale-interest-form">
        <PrivateSaleInterestForm />
      </Route>
    </Switch>
  )
}

export default Routes;