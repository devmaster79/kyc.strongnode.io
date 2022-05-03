import { FieldPath } from 'react-hook-form'
import { ZodValidationError } from 'shared/endpoints/responses'

export interface FieldIssue<T> {
  path: FieldPath<T>
  message: string
}

export function getFieldIssues<TRequestBody extends Record<string, unknown>>(
  response: ZodValidationError<TRequestBody>
) {
  return response.issues
    .filter((issue) => issue.message !== 'undefined')
    .map(
      (issue) =>
        ({
          message: issue.message,
          path: issue.path.join('.')
        } as FieldIssue<TRequestBody>)
    )
}
