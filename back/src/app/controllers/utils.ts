import {
  AbstractApiresponse,
  unexpectedError,
  validationError
} from 'shared/endpoints/responses'
import * as express from 'express'
import { ZodError } from 'zod'
import { AppLogger } from 'app/services/Logger'
import { UserLevel } from 'app/models/user.model'

/** This type enstrict the express' weak Request type, so use this instead of the originial */
type Request = express.Request & { body: unknown }
/** This type is for the routes with auth middleware */
export type UserRequest = Request & {
  user: { email: string; username: string; level: UserLevel }
}

/** Decorate the given controller with res.send */
export const withResponse = <
  TResponse extends AbstractApiresponse,
  TRequest extends UserRequest = UserRequest
>(
  controller: (req: TRequest, res?: express.Response) => Promise<TResponse>
) => {
  /** The new controller that will call res.send on the given controller's return value  */
  async function controllerWithSendingResponses(
    req: TRequest,
    res: express.Response
  ) {
    const response = await controller(req, res)
    return res.status(response.statusCode).send(response)
  }

  return withErrorHandling(controllerWithSendingResponses)
}

/**
 * Decorate the given controller
 * so it lets you use **Server Sent Events** by just having a simple js itrator.
 * every yield will be sent to the client.
 */
export const withSseResponse = <
  TReturn,
  TRequest extends UserRequest = UserRequest
>(
  controller: (
    req: TRequest,
    res?: express.Response
  ) => AsyncGenerator<TReturn, void | undefined, undefined>
) => {
  /** The new controller that will iterate through the responses */
  async function controllerWithSseResponse(
    req: TRequest,
    res: express.Response
  ) {
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders() // flush the headers to establish SSE with client

    let shouldStop = false
    const responseIterator = controller(req, res)
    for await (const response of responseIterator) {
      if (shouldStop) break
      res.write(`${JSON.stringify(response)}\n\n`)
    }
    res.end()

    // If client closes connection, stop sending events
    res.on('close', () => {
      shouldStop = true
    })
  }

  return withErrorHandling(controllerWithSseResponse)
}

/** wraps the controller into a try catch */
function withErrorHandling<TReturn, TRequest = UserRequest>(
  controller: (req: TRequest, res: express.Response) => Promise<TReturn>
) {
  /** The new controller that will handle the errors */
  async function controllerWithErrorHandling(
    req: TRequest,
    res: express.Response
  ) {
    try {
      await controller(req, res)
    } catch (controllerError) {
      try {
        // Create response
        let response
        if (controllerError instanceof ZodError) {
          response = validationError(controllerError.issues)
        } else {
          response = unexpectedError()
        }

        // Send response
        if (res.headersSent) {
          res.end(`${JSON.stringify(response)}\n\n`)
        } else {
          res.status(response.statusCode).send(response)
        }

        AppLogger.error(controllerError)
      } catch (errorReportingError) {
        AppLogger.error(
          controllerError,
          "Even error reporting didn't work because of:",
          errorReportingError
        )
      }
    }
  }

  return controllerWithErrorHandling
}
