import { getResponseData, setToken } from "./utils";
import * as urls from "../../utils/config";
import {
  BannedError,
  GenericResponse,
  Success,
  UnauthorizedError,
  UnexpectedError,
  ValidationError,
} from "./responses";

/**
 * Verify OTP and set token
 */
export async function authByQRCode(
  otp: string
): Promise<
  | GenericResponse
  | BannedError
  | ValidationError<"token", undefined>
  | ValidationError<"token", "wrong">
> {
  const data = await getResponseData(urls.authByQRCode, { token: otp });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function generateQRCode(): Promise<
  { result: "success"; qrcode: string } | UnauthorizedError | UnexpectedError
> {
  return await getResponseData(urls.generateQRCode);
}

export async function enableQRAuth(
  token: string
): Promise<
  | GenericResponse
  | ValidationError<"token", undefined>
  | ValidationError<"token", "wrong">
> {
  return await getResponseData(urls.enableQRAuth, { token });
}

export async function disableQRAuth(): Promise<GenericResponse> {
  return await getResponseData(urls.disableQRAuth);
}
