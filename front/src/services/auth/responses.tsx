export type Success = {
  result: 'success'
}
export type UnexpectedError = {
  result: 'unexpected-error'
}
export type UnauthorizedError = {
  result: 'unauthorized-error'
}
export type BannedError = {
  result: 'banned'
  remainingTimeMs: number
}
export type LimitReachedError = {
  result: 'limit-reached-error'
}
export type ValidationError<Field, Reason> = {
  result: 'validation-error'
  field: Field
  reason: Reason
}
export type GenericResponse = Success | UnexpectedError | UnauthorizedError
