import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import Signup from './pages/signup';
import SentEmail from './pages/sentemail'
import CreateAccountPassword from './pages/createaccountpassword'

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
      <Route path="/home">
        <Home />
      </Route>
    </Switch>
  )
}

export default Routes;