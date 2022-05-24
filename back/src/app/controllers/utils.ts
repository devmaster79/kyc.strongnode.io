import {
  AbstractApiresponse,
  validationError
} from 'shared/endpoints/responses'
import * as express from 'express'
import { ZodError } from 'zod'
import { AppLogger } from 'app/services/Logger'

/** This type enstrict the express' weak Request type, so use this instead of the originial */
type Request = express.Request & { body: unknown }
/** This type is for the routes with auth middleware */
type UserRequest = Request & { user: { email: string; user_name: string } }

/** Decorate the given controller with res.send */
export const withResponse =
  <R extends AbstractApiresponse>(
    controller: (req: UserRequest, res?: express.Response) => Promise<R>
  ) =>
  async (req: UserRequest, res: express.Response) => {
    try {
      const response = await controller(req, res)
      return res.status(response.statusCode).send(response)
    } catch (error) {
      if (error instanceof ZodError) {
        const response = validationError(error.issues)
        return res.status(response.statusCode).send(response)
      }

      res.status(500).send({ result: 'unexpected-error' })
      AppLogger.error(error)
    }
  }
