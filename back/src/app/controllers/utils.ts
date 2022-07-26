import {
  AbstractApiresponse,
  unexpectedError,
  validationError
} from 'shared/endpoints/responses'
import * as express from 'express'
import { ZodError } from 'zod'
import { AppLogger } from 'app/services/Logger'

/** This type enstrict the express' weak Request type, so use this instead of the originial */
type Request = express.Request & { body: unknown }
/** This type is for the routes with auth middleware */
export type UserRequest = Request & {
  user: { email: string; username: string }
}

/** Decorate the given controller with res.send */
export const withResponse = <R extends AbstractApiresponse>(
  controller: (req: UserRequest, res?: express.Response) => Promise<R>
) => {
  /** The new controller that will call res.send on the given controller's return value  */
  async function controllerWithSendingResponses(
    req: UserRequest,
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
export const withSseResponse = <T>(
  controller: (
    req: UserRequest,
    res?: express.Response
  ) => AsyncGenerator<T, void | undefined, undefined>
) => {
  /** The new controller that will iterate through the responses */
  async function controllerWithSseResponse(
    req: UserRequest,
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
function withErrorHandling<T>(
  controller: (req: UserRequest, res: express.Response) => Promise<T>
) {
  /** The new controller that will handle the errors */
  async function controllerWithErrorHandling(
    req: UserRequest,
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
