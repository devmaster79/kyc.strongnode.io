import * as urls from "../../utils/config";
import { getResponseData, setToken } from "./utils";
import {
  GenericResponse,
  Success,
  UnexpectedError,
  ValidationError,
} from "./responses";

function sendVerificationEmail(
  email: string
): Promise<Success | UnexpectedError | ValidationError<"email", undefined>> {
  return getResponseData(urls.sendVerificationEmail, { email });
}

type RegisterParams = {
  user_name: string;
  first_name: string;
  last_name: string;
}

async function register(
  params: RegisterParams
): Promise<
  | GenericResponse
  | ValidationError<"user_name", undefined>
  | ValidationError<"user_name", "already-taken">
  | ValidationError<"first_name", undefined>
  | ValidationError<"last_name", undefined>
> {
  const data = await getResponseData(urls.register, {
    user_name: params.user_name,
    first_name: params.first_name,
    last_name: params.last_name,
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

const signOut = () => {
  localStorage.clear();
  setToken(null);
};

/* utils */
export { setToken, signOut };
/* login / preRegister  */
export { sendVerificationEmail };
/* Register */
export { RegisterParams, register };
/* Password Auth */
export * from "./passwordAuthService";
/* SMS Auth */
export * from "./smsAuthService";
/* Authenticator Auth */
export * from "./authenticatorAuthService";
