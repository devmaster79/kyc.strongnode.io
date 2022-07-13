/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import {
  NotFoundError,
  Success,
  UnauthorizedError,
  UnexpectedError,
} from "./responses";
import { z } from "zod";

export namespace VerifyAccount {
  export const METHOD = "post";
  export const PATH = "/api/dvpn/verify";
  export const schema = z.object({
    email: z.string(),
    password: z.string(),
  });
  export type Request = { body: z.input<typeof schema> };
  export type AccountDetail = {
    dvpnAccess: boolean;
  };
  export type Response =
    | Success<AccountDetail>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError;
  export const request: Request | null = null;
  export const response: Response | null = null;
}

export namespace GenerateAccount {
  export const METHOD = "get";
  export const PATH = "/api/dvpn/generate";
  export type Request = {};
  export type AccountDetail = {
    id: number;
    password: string;
    access: boolean;
    createdAt: Date;
    updatedAt: Date;
    generatedPassword?: string;
  };
  export type Response =
    | Success<AccountDetail>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError;
  export const request: Request | null = null;
  export const response: Response | null = null;
}
