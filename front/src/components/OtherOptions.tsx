import { NavLink } from 'react-router-dom'
import { ROUTES } from 'Router'
import styled from 'styled-components'

interface OtherOptionsProps {
  hideSMS?: boolean;
  hideAuthenticator?: boolean;
  hidePassword?: boolean;
}

export const OtherOptions = ({
  hideSMS,
  hideAuthenticator,
  hidePassword
}: OtherOptionsProps) => (
  <div>
    <h5>Try another method?</h5>
    <Options>
      {!hideSMS && (
        <li>
          <NavLink to={ROUTES.AUTH.SIGN_IN_WITH_SMS}>Sign in with SMS</NavLink>
        </li>
      )}
      {!hideAuthenticator && (
        <li>
          <NavLink to={ROUTES.AUTH.SIGN_IN_WITH_AUTHENTICATOR}>Sign in with Authenticator</NavLink>
        </li>
      )}
      {!hidePassword && (
        <li>
          <NavLink to={ROUTES.AUTH.SIGN_IN_WITH_PASSWORD}>Sign in with Password</NavLink>
        </li>
      )}
    </Options>
  </div>
)

const Options = styled.ul`
  list-style-type: none;
`
