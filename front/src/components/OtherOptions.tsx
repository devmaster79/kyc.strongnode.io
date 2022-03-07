import { NavLink } from "react-router-dom";

interface OtherOptionsProps {
  hideSMS?: boolean;
  hideAuthenticator?: boolean;
  hidePassword?: boolean;
}

export const OtherOptions = ({
  hideSMS,
  hideAuthenticator,
  hidePassword,
}: OtherOptionsProps) => (
  <div>
    <h5>Try another method?</h5>
    {!hideSMS && <NavLink to={"/signinsms"}>Signin with SMS</NavLink>}
    {!hideAuthenticator && (
      <NavLink to={"/signinqr"}>Signin with Authenticator</NavLink>
    )}
    {!hidePassword && (
      <NavLink to={"/signinpassword"}>Signin with Password</NavLink>
    )}
  </div>
);
