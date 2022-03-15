import { getResponseData, setToken } from "./utils";
import * as urls from "../../utils/config";
import { BannedError, GenericResponse, ValidationError } from "./responses";

export async function enablePasswordAuth(
  password: string
): Promise<GenericResponse | ValidationError<"password", undefined>> {
  return await getResponseData(urls.enablePasswordAuth, { password });
}

export async function disablePasswordAuth(): Promise<GenericResponse> {
  return await getResponseData(urls.disablePasswordAuth);
}

/** Verify password and set token */
export async function authByPassword(
  password: string
): Promise<
  | GenericResponse
  | BannedError
  | ValidationError<"password", undefined | "wrong">
> {
  const data = await getResponseData(urls.authByPassword, { password });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}
