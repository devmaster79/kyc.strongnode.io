import { ApiResponse, validationError } from 'shared/endpoints/responses';
import * as express from 'express';
import { ZodError } from 'zod';

/** This type enstrict the express' weak Request type, so use this instead of the originial */
type Request = express.Request & { body: unknown }
/** This type is for the routes with auth middleware */
type UserRequest = Request & { user: { email: string; user_name: string; }; };

/** Decorate the given controller with res.send */
export const withResponse = <R extends ApiResponse<string, number, Record<string, unknown>>>(
    controller: (req: UserRequest, res?: any) => Promise<R>
) => async (req: any, res: any) => {
    try {
        const response = await controller(req, res);
        return res.status(response.statusCode).send(response);
    } catch (error) {
        if (error instanceof ZodError) {
            const response = validationError(error.issues);
            return res.status(response.statusCode).send(response);
        }

        res.status(500).send({ result: "unexpected-error" });
        console.error(error);
    }
};
